"use client";

import React, { useState, Fragment, useMemo, useEffect } from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, Listbox, ListboxItem, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { ExpandIcon, CollapseIcon } from './icons';
import { useSerial } from './serial-context';
import { useTranslation } from "next-i18next";
import { addToast } from "@heroui/toast";
import { USB_VENDOR } from "@/model/usbvendor";
import CardTitleDeviceDropList from './card-title-device-drop-list';

interface CardContainerProps {
  children: React.ReactNode;
  title?: string;
}

type Variant = "flat" | "solid" | "bordered" | undefined;

export const CardContainer: React.FC<CardContainerProps> = ({ children, title = "Serial Flow" }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { t } = useTranslation('common');
  const { selectedPort, setSelectedPort, reloadPortList, portList, openPort, closePort, openedPorts } = useSerial();

  // Toggle fullscreen state
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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
    return `Port ${portList.indexOf(port) + 1}`;
  };

  const handleReloadPortList = async () => {
    await reloadPortList();
  };

  // 使用useMemo缓存设备名称，避免在连接状态变化时重新计算
  const deviceName = useMemo(() => {
    if (!selectedPort) return '';
    return getDeviceName(selectedPort);
  }, [selectedPort, portList]); // 添加 portList 依赖

  const handleDisconnect = async () => {
    if (selectedPort) {
      await closePort(selectedPort);
      setSelectedPort(null);
    }
  };

  const handleConnect = async () => {
    if (selectedPort) {
      await openPort(selectedPort);
    }
  };

  // 限制连接/断开频率
  const [lastConnectionTime, setLastConnectionTime] = useState(0);

  useEffect(() => {
    handleConnection();
  }, [selectedPort]);

  const handleConnection = async () => {
    const currentTime = Date.now();
    if (currentTime - lastConnectionTime < 1500) {
      console.log(`too fast`);
      return;
    }
    setLastConnectionTime(currentTime);
    try {
      if (selectedPort && openedPorts.has(selectedPort)) {
        // 端口已打开，执行断开操作
        const success = await closePort(selectedPort);
        if (success) {
          toastDisconnectSuccess();
        } else {
          toastDisconnectFailed();
        }
      } else if (selectedPort) {
        // 端口已选择但未打开，执行连接操作
        const success = await openPort(selectedPort);
        if (success) {
          toastConnectionSuccess();
        } else {
          toastConnectionFailed();
        }
      } else if (selectedPort) {
        // 端口已选择但未打开，执行连接操作
        const success = await openPort(selectedPort);
        if (success) {
          toastConnectionSuccess();
        } else {
          toastConnectionFailed();
        }
      } else if (portList.length === 1) {
        // 如果只有一个端口且未选择，直接连接它
        /* setSelectedPort(portList[0]);
        const success = await openPort(portList[0]);
        if (success) {
          showToast(t("connectSuccess", "Connect Success"), `${t("connectSuccessDesc", "You have successfully connected to")} ${deviceName}`);
        } else {
          showToast(t("connectFailed", "Connect Failed"), t("connectFailedDesc", "Failed to connect to the serial port."));
        } */
      }
    } catch (error) {
      console.error("Error during port operation:", error);
      toastConnectionError();
    }
  }

  const showToast = (title: string, description: string, variant: Variant = "flat", timeout: number = 600, shouldShowTimeoutProgess: boolean = true) => {
    addToast({
      title,
      description,
      variant,
      timeout,
      shouldShowTimeoutProgess,
    });
  }

  const toastConnectionError = () => {
    showToast(t("error", "Error"), t("operationFailed", "Operation failed. Please try again."));
  }

  const toastConnectionSuccess = () => {
    showToast(t("connectSuccess", "Connect Success"), t("connectSuccessDesc", "You have successfully connected to the serial port."));
  }
  const toastConnectionFailed = () => {
    showToast(t("connectFailed", "Connect Failed"), t("connectFailedDesc", "Failed to connect to the serial port."));
  }

  const toastDisconnectSuccess = () => {
    showToast(t("disconnectSuccess", "Disconnect Success"), t("disconnectSuccessDesc", "You have successfully disconnected from the serial port."));
  }
  const toastDisconnectFailed = () => {
    showToast(t("disconnectFailed", "Disconnect Failed"), t("disconnectFailedDesc", "Failed to disconnect from the serial port."));
  }


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
                  className={`text-sm transition-all duration-300`}
                >
                  {t("menu", "Menu")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Serial Flow Actions" variant="faded">
                {/* {!hasPermission ? (<DropdownItem
                  key="request"
                  onPress={handleRequestPort} 
                  isDisabled={requestingPort || (selectedPort !== null)}
                >
                  {requestingPort
                    ? t("requestingPorts", "Requesting port access...")
                    : t("requestPorts", "Request Serial Port Access")}
                </DropdownItem>) : null} */}
                {/* 
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
                          onPress={() => {
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
                ) : null} */}
                <DropdownItem key="reload" onPress={handleReloadPortList}>
                  {t("reload", "Reload Port List")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Center - Connection Status with Icon */}
        <div className="flex items-center justify-center">
          <Popover
            placement="bottom"
            classNames={{
              content: [
                "w-[260px] px-1 py-1 rounded-small",
              ]
            }}>
            <PopoverTrigger >
              <Button
                size='sm'
                variant='light'
                className={`
              font-medium
              ${selectedPort && openedPorts.has(selectedPort)
                    ? 'text-gray-700'
                    : selectedPort
                      ? 'text-gray-700'
                      : 'text-gray-600'
                  }
              transition-colors duration-300
              `}>
                <div className={`
                w-2 h-2 rounded-full 
                ${selectedPort && openedPorts.has(selectedPort)
                    ? 'bg-green-500 animate-pulse'
                    : selectedPort
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-red-500'
                  }
                transition-colors duration-300
              `}></div>
                {(!selectedPort) ? t("noConnectedDevices") : deviceName}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <CardTitleDeviceDropList></CardTitleDeviceDropList>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          isIconOnly
          variant="light"
          aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          onPress={toggleFullScreen}
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
