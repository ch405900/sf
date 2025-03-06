"use client";

import { useSerial } from "./serial-context";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "@heroui/react";

// 日志渲染器,
export const LogRenderer = () => {
    const { selectedPort, setSelectedPort, portLogs, portList, reloadPortList, openedPorts } = useSerial();
    const { t } = useTranslation("common");
    const logContainerRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [requestingPort, setRequestingPort] = useState(false);

    // Set isClient to true when component mounts on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Reload port list when component mounts on client side
    useEffect(() => {
        if (isClient) {
            reloadPortList();
        }
    }, [isClient, reloadPortList]);

    // Auto-scroll to the bottom when new logs are added
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [selectedPort, portLogs]);

    // Get logs for the selected port
    const currentLogs = selectedPort ? portLogs.get(selectedPort) || [] : [];

    // Determine if we should show logs based on port selection and connection state
    const shouldShowLogs = selectedPort && openedPorts.has(selectedPort);

    // Request user to select a serial port
    const handleRequestPort = async () => {
        try {
            setRequestingPort(true);
            if (typeof navigator !== 'undefined' && navigator.serial) {
                await navigator.serial.requestPort();
                const ports = await reloadPortList();
                console.log('New ports after reload:', ports); // 添加日志
                if (ports && ports.length > 0) {
                    console.log('Setting first port:', ports[0]); // 添加日志
                    setSelectedPort(ports[0]);
                }
            }
        } catch (error) {
            // Check if it's the "user cancelled" error
            if (error instanceof Error &&
                (error.name === 'NotFoundError' ||
                    error.message.includes('No port selected by the user'))) {
                // This is expected when user cancels the dialog - no need to show an error
                console.log('User cancelled port selection');
            } else {
                // For other errors, log to console
                console.error('Error requesting serial port:', error);
            }
        } finally {
            setRequestingPort(false);
        }
    };

    // Handle selecting a port
    const handleSelectPort = (port: SerialPort) => {
        console.log('Selecting port:', port);
        setSelectedPort(port);
    };

    return (
        <div
            ref={logContainerRef}
            className="flex flex-1 flex-col min-h-0 h-full gap-2 overflow-auto bg-default-100 p-4 font-mono text-sm"
        >
            {!selectedPort && (
                <div className="text-gray-500 flex flex-col items-center justify-center h-full">
                    {/* Request port message - buttons moved to card header */}
                    <div className="mb-4">{t("selectSerialPort", "Select a serial port to view logs")}</div>
                    {portList.length > 0 && <div className="mb-4">{t("availableSerialPorts")}</div>}
                    {!isClient ? (
                        <div>{t("loadingSerialPorts")}</div>
                    ) : (
                        <>
                            {portList.length === 0 ? (
                                <div>{t("noSerialPortsDetected")}
                                </div>
                            ) : (
                                <ul className="list-disc pl-5 text-gray-600">
                                    {portList.map((port, index) => {
                                        // Try to get port info - handle different browser implementations
                                        let portInfo = "";
                                        try {
                                            if (port.getInfo) {
                                                const info = port.getInfo();
                                                portInfo = info.usbVendorId && info.usbProductId
                                                    ? `(VID: ${info.usbVendorId?.toString(16)}, PID: ${info.usbProductId?.toString(16)})`
                                                    : "";
                                            }
                                        } catch (e) {
                                            // Ignore errors when trying to get port info
                                        }
                                        return (
                                            <li
                                                key={index}
                                                className="mb-1 hover:text-gray-800 hover:bg-gray-100 p-2 rounded cursor-pointer"
                                                onClick={() => handleSelectPort(port)}
                                            >
                                                {`${t("serialPort", "Serial Port")} ${index + 1}`} {portInfo}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                    {portList.length == 0 ? <Button className="width-full w-xs"
                        onPress={handleRequestPort} color="default" variant="ghost">
                        {t("requestPorts", "Request Port")}
                    </Button> : null}
                </div>
            )}
            {selectedPort && shouldShowLogs && (
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto">
                        {currentLogs.length === 0 ? (
                            <div className="text-gray-500 flex items-center justify-center flex-1">
                                {t("noLogsAvailable", "No logs available for this port")}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-auto">
                                {currentLogs.map((log, index) => (
                                    <div key={index} className="whitespace-pre-wrap break-words">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}