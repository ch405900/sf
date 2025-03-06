import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { DEFAULT_BAUD_RATE } from "@/model/constants";

enum ContextState {
    IDLE,
    ACCESS_PORT_FAILED,
    GRANTED,
    UNSUPPORT,
}

// 定义 Context 结构
interface SerialContextType {
    state: ContextState,
    portList: SerialPort[]; // 所有可用的串口
    selectedPort: SerialPort | null; // 当前选中的串口
    setSelectedPort: (port: SerialPort | null) => void; // 用于设置当前选中的串口
    portLogs: Map<SerialPort, string[]>; // 每个串口的日志
    setPortLogs: React.Dispatch<React.SetStateAction<Map<SerialPort, string[]>>>; // 用于设置每个串口的日志
    reloadPortList: () => Promise<SerialPort[]>; // 用于重新加载串口列表
    openPort: (port: SerialPort, baudRate?: number) => Promise<boolean>; // 用于打开串口
    closePort: (port: SerialPort) => Promise<boolean>; // 用于关闭串口
    openedPorts: Set<SerialPort>; // 已打开的串口
}

// 创建 Context
const SerialContext = createContext<SerialContextType | undefined>(undefined);

export const SerialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contextState, setContextState] = useState<ContextState>(ContextState.IDLE);
    const [portList, setPortList] = useState<SerialPort[]>([]);
    const [selectedPort, setSelectedPort] = useState<SerialPort | null>(null);
    const [portLogs, setPortLogs] = useState<Map<SerialPort, string[]>>(new Map());
    const [openedPorts, setOpenedPorts] = useState<Set<SerialPort>>(new Set());
    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
    const textDecoderRef = useRef<TextDecoder | null>(null);
    const keepReadingRef = useRef(true);

    // Function to fetch ports that can be called on demand
    const fetchPorts = useCallback(async () => {
        // Check if we're in a browser environment with Web Serial API available
        const isBrowser = typeof window !== 'undefined';
        const isSerialAvailable = isBrowser && 'serial' in navigator;

        if (isSerialAvailable) {
            try {
                const ports = await navigator.serial.getPorts();
                setPortList(ports);
                return ports;
            } catch (error) {
                console.error("Error fetching serial ports:", error);
                setPortList([]);
                return [];
            }
        } else {
            // We're either in SSR or the browser doesn't support Web Serial API
            setPortList([]);

            if (isBrowser) {
                console.warn("Web Serial API is not available in this browser.");
                setContextState(ContextState.UNSUPPORT);
            }
            return [];
        }
    }, []);

    // Close current port if selected port changes
    const closeCurrentReader = useCallback(async () => {
        // Cancel ongoing reading operation
        keepReadingRef.current = false;

        // Close the reader if it exists
        if (readerRef.current) {
            try {
                await readerRef.current.cancel();
                readerRef.current = null;
            } catch (error) {
                console.error("Error closing reader:", error);
            }
        }
    }, []);

    // Function to read from a port
    const readFromPort = useCallback(async (port: SerialPort) => {
        if (!port.readable) {
            console.error("Port is not readable");
            return;
        }

        // Create a text decoder if one doesn't exist yet
        if (!textDecoderRef.current) {
            textDecoderRef.current = new TextDecoder();
        }

        try {
            // Get a reader from the port's readable stream
            readerRef.current = port.readable.getReader();
            keepReadingRef.current = true;

            // Read data until cancelled
            while (keepReadingRef.current) {
                const { value, done } = await readerRef.current.read();

                if (done) {
                    // The stream was cancelled
                    break;
                }

                if (value) {
                    // Decode the received data
                    const text = textDecoderRef.current.decode(value);

                    // Split the text by new lines
                    const lines = text.split(/\r?\n/);

                    // Update the portLogs with new data
                    setPortLogs(prevLogs => {
                        const newLogs = new Map(prevLogs);
                        const portLog = newLogs.get(port) || [];

                        // If last log line doesn't end with a newline, append to it
                        if (portLog.length > 0 && !text.includes('\n') && !text.includes('\r')) {
                            const lastLineIndex = portLog.length - 1;
                            const newLastLine = portLog[lastLineIndex] + lines[0];

                            const updatedLog = [...portLog.slice(0, lastLineIndex), newLastLine];

                            // Add any additional lines
                            if (lines.length > 1) {
                                updatedLog.push(...lines.slice(1));
                            }

                            newLogs.set(port, updatedLog);
                        } else {
                            // Otherwise add all lines
                            newLogs.set(port, [...portLog, ...lines.filter(line => line.trim() !== '')]);
                        }

                        return newLogs;
                    });
                }
            }
        } catch (error) {
            console.error("Error reading from port:", error);
        } finally {
            // Clean up the reader
            if (readerRef.current) {
                try {
                    await readerRef.current.cancel();
                } catch (cancelError) {
                    console.error("Error cancelling reader:", cancelError);
                }
                readerRef.current = null;
            }
        }
    }, []);

    // Function to open a port
    const openPort = useCallback(async (port: SerialPort, baudRate: number = parseInt(DEFAULT_BAUD_RATE)) => {
        // 如果端口已打开，直接返回
        if (openedPorts.has(port)) {
            console.log("Port is already open");
            return true;
        }

        try {
            // 允许UI更新
            await new Promise(resolve => setTimeout(resolve, 10));

            // Close any existing connection first
            await closeCurrentReader();

            // Configure the port
            await port.open({
                baudRate: baudRate,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                flowControl: 'none'
            });

            // If it's already open, this will throw an error, which we'll catch
            console.log(`Port opened with baud rate ${baudRate}`);

            // Start reading from the port
            readFromPort(port);

            // Add the port to the openedPorts set
            setOpenedPorts(prevOpenedPorts => new Set(prevOpenedPorts).add(port));

            return true;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Port already open')) {
                console.log('Port was already open, starting to read');
                // Start reading from the port
                readFromPort(port);

                // Add the port to openedPorts if not already there
                setOpenedPorts(prevOpenedPorts => new Set(prevOpenedPorts).add(port));

                return true;
            }

            console.error("Error opening port:", error);
            return false;
        } finally {
        }
    }, [closeCurrentReader, readFromPort, openedPorts]);

    // Function to close a port
    const closePort = useCallback(async (port: SerialPort) => {
        // 检查端口是否已打开
        if (!openedPorts.has(port)) {
            console.log("Port is not open, no need to close");
            return true;
        }

        try {
            // Stop reading first
            await closeCurrentReader();

            // Then close the port
            if (port.readable) {
                await port.close();
                console.log("Port closed");
            }

            // Remove the port from the openedPorts set
            setOpenedPorts(prevOpenedPorts => {
                const newOpenedPorts = new Set(prevOpenedPorts);
                newOpenedPorts.delete(port);
                return newOpenedPorts;
            });

            return true;
        } catch (error) {
            console.error("Error closing port:", error);
            return false;
        }
    }, [closeCurrentReader, openedPorts]);

    // Watch for changes to selectedPort
    useEffect(() => {
        // Clean up function
        return () => {
            if (selectedPort) {
                closeCurrentReader();
            }
        };
    }, [selectedPort, closeCurrentReader]);

    return (
        <SerialContext.Provider
            value={{
                state: contextState,
                portList,
                selectedPort,
                setSelectedPort,
                portLogs,
                setPortLogs,
                reloadPortList: fetchPorts,
                openPort,
                closePort,
                openedPorts,
            }}
        >
            {children}
        </SerialContext.Provider>
    );
};

// 自定义 Hook，简化使用 Context
export const useSerial = () => {
    const context = useContext(SerialContext);
    if (!context) {
        throw new Error("useSerial must be used within a SerialProvider");
    }
    return context;
};
