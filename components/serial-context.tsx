import React, { createContext, useContext, useState, useEffect } from "react";

// 定义 Context 结构
interface SerialContextType {
    portList: SerialPort[];
    selectedPort: SerialPort | null;
    setSelectedPort: (port: SerialPort) => void;
    portLogs: Map<SerialPort, string[]>;
    setPortLogs: React.Dispatch<React.SetStateAction<Map<SerialPort, string[]>>>;
}

// 创建 Context
const SerialContext = createContext<SerialContextType | undefined>(undefined);

export const SerialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [portList, setPortList] = useState<SerialPort[]>([]);
    const [selectedPort, setSelectedPort] = useState<SerialPort | null>(null);
    const [portLogs, setPortLogs] = useState<Map<SerialPort, string[]>>(new Map());

    useEffect(() => {
        const fetchPorts = async () => {
            const ports = await navigator.serial.getPorts();
            setPortList(ports);
        };
        fetchPorts();
    }, []);

    return (
        <SerialContext.Provider value={{ portList, selectedPort, setSelectedPort, portLogs, setPortLogs }}>
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
