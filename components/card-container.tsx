"use client";

import React, { useState, Fragment, useMemo } from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ExpandIcon, CollapseIcon } from './icons';
import { useSerial } from './serial-context';
import { useTranslation } from "next-i18next";
import { addToast } from "@heroui/toast";
import { USB_VENDOR } from "@/model/usbvendor";

interface CardContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({ children, title = "Serial Flow" }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [requestingPort, setRequestingPort] = useState(false);
  const { t } = useTranslation('common');
  const { selectedPort, setSelectedPort, reloadPortList, portList, openPort, closePort, openedPorts, isPortOpening } = useSerial();

  // Toggle fullscreen state
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Request user to select a serial port
  const handleRequestPort = async () => {
    try {
      setRequestingPort(true);
      // The browser will show a port picker.
      if (typeof navigator !== 'undefined' && navigator.serial) {
        await navigator.serial.requestPort();
        // After user selects a port, refresh the port list
        await reloadPortList();
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

  const getDeviceName = (port: SerialPort) => {
    try {
      if (port.getInfo) {
        const info = port.getInfo();
        if (info.usbVendorId) {
          const vendor = USB_VENDOR.get(info.usbVendorId);
          if (vendor) {
            return `${vendor.alias} (${info.usbVendorId.toString(16)}:${info.usbProductId?.toString(16) || 'N/A'})`;
          }
          return `Device ${info.usbVendorId.toString(16)}:${info.usbProductId?.toString(16) || 'N/A'}`;
        }
      }
    } catch (e) {
      console.error("Error getting port info:", e);
    }
    return port.label || `Port ${portList.indexOf(port) + 1}`;
  };

  const handleReloadPortList = async () => {
    await reloadPortList();
  };

  // 使用useMemo缓存设备名称，避免在连接状态变化时重新计算
  const deviceName = useMemo(() => {
    if (!selectedPort) return '';
    return getDeviceName(selectedPort);
  }, [selectedPort]);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out 
        bg-white rounded-lg shadow-lg overflow-hidden
        border border-gray-200
        ${isFullScreen ?
          'fixed inset-0 z-50 m-0 rounded-none' :
          'w-full max-w-6xl mx-auto my-4'}
      `}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>

          <div className="flex items-center space-x-2">
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  color="danger"
                  size="sm"
                  className="text-sm"
                >
                  {t("menu", "Menu")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Serial Flow Actions" variant="faded">
                <DropdownItem
                  key="request"
                  onClick={handleRequestPort}
                  isDisabled={requestingPort || (selectedPort !== null)}
                >
                  {requestingPort
                    ? t("requestingPorts", "Requesting port access...")
                    : t("requestPorts", "Request Serial Port Access")}
                </DropdownItem>

                {portList.length > 0 && !selectedPort ? (
                  <Fragment>
                    <DropdownItem key="port-header" className="font-semibold opacity-70" isReadOnly>
                      {t("availablePorts", "Available Ports")}
                    </DropdownItem>
                    {portList.map((port, index) => {
                      // Try to get port info and format it for display
                      let portInfo = "";
                      try {
                        if (port.getInfo) {
                          const info = port.getInfo();
                          if (info.usbVendorId) {
                            portInfo = `${info.usbVendorId}:${info.usbProductId || 'N/A'}`;
                          }
                        }
                      } catch (e) {
                        console.error("Error getting port info:", e);
                      }

                      return (
                        <DropdownItem
                          key={`port-${index}`}
                          onClick={() => {
                            setSelectedPort(port);
                            addToast({
                              title: t("connectSuccess", "Connect Success"),
                              description: `${t("connectSuccessDesc", "You have successfully connected to")} ${t("serialPort", "Serial Port")} ${index + 1}`,
                              variant: "flat",
                              timeout: 3000,
                              shouldShowTimeoutProgess: true,
                            });
                          }}
                        >
                          {t("connectToPort", "Connect to Port")} {index + 1} {portInfo ? `(${portInfo})` : ''}
                        </DropdownItem>
                      );
                    })}
                  </Fragment>
                ) : null}

                <DropdownItem key="reload" onClick={handleReloadPortList}>
                  {t("reload", "Reload Port List")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {portList.length > 0 ? (
              <Button
                color={selectedPort && openedPorts.has(selectedPort) ? "danger" : "primary"}
                size="sm"
                className="w-[120px] ml-2 text-sm flex justify-center"
                isDisabled={!selectedPort && portList.length !== 1 || isPortOpening}
                isLoading={isPortOpening}
                onPress={async () => {
                  try {
                    if (selectedPort && openedPorts.has(selectedPort)) {
                      // 端口已打开，执行断开操作
                      const success = await closePort(selectedPort);
                      if (success) {
                        addToast({
                          title: t("disconnectSuccess", "Disconnect Success"),
                          description: t("disconnectSuccessDesc", "You have successfully disconnected from the serial port."),
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      } else {
                        addToast({
                          title: t("disconnectFailed", "Disconnect Failed"),
                          description: t("disconnectFailedDesc", "Failed to disconnect from the serial port."),
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      }
                    } else if (selectedPort) {
                      // 端口已选择但未打开，执行连接操作
                      const success = await openPort(selectedPort);
                      if (success) {
                        addToast({
                          title: t("connectSuccess", "Connect Success"),
                          description: `${t("connectSuccessDesc", "You have successfully connected to")} ${deviceName}`,
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      } else {
                        addToast({
                          title: t("connectFailed", "Connect Failed"),
                          description: t("connectFailedDesc", "Failed to connect to the serial port."),
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      }
                    } else if (portList.length === 1) {
                      // 如果只有一个端口且未选择，直接连接它
                      setSelectedPort(portList[0]);
                      const success = await openPort(portList[0]);
                      if (success) {
                        addToast({
                          title: t("connectSuccess", "Connect Success"),
                          description: `${t("connectSuccessDesc", "You have successfully connected to")} ${t("serialPort", "Serial Port")} 1`,
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      } else {
                        addToast({
                          title: t("connectFailed", "Connect Failed"),
                          description: t("connectFailedDesc", "Failed to connect to the serial port."),
                          variant: "flat",
                          timeout: 2000,
                          shouldShowTimeoutProgess: true,
                        });
                      }
                    }
                  } catch (error) {
                    console.error("Error during port operation:", error);
                    addToast({
                      title: t("error", "Error"),
                      description: t("operationFailed", "Operation failed. Please try again."),
                      variant: "flat",
                      timeout: 2000,
                      shouldShowTimeoutProgess: true,
                    });
                  }
                }}
              >
                {selectedPort && openedPorts.has(selectedPort)
                  ? t("disconnect", "Disconnect")
                  : isPortOpening
                    ? t("connecting", "Connecting")
                    : t("connect", "Connect")}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Center - Connection Status with Icon */}
        <div className="flex items-center justify-center">
          {selectedPort && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`
                w-2 h-2 rounded-full 
                ${selectedPort && openedPorts.has(selectedPort)
                  ? 'bg-green-500 animate-pulse'
                  : isPortOpening && selectedPort
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                }
                transition-colors duration-300
              `}></div>
              <span className={`
                font-medium
                ${selectedPort && openedPorts.has(selectedPort)
                  ? 'text-gray-700'
                  : isPortOpening && selectedPort
                    ? 'text-gray-700'
                    : 'text-gray-600'
                }
                transition-colors duration-300
              `}>{deviceName}</span>
            </div>
          )}
        </div>

        <Button
          isIconOnly
          variant="light"
          aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={toggleFullScreen}
          className="text-gray-600 hover:text-gray-800"
        >
          {isFullScreen ? <CollapseIcon className="w-5 h-5" /> : <ExpandIcon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Card Content */}
      <div className={`${isFullScreen ? 'h-[calc(100vh-56px)]' : 'h-[calc(80vh-56px)]'}`}>
        {children}
      </div>
    </div>
  );
};
