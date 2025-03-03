"use client";

import React, { useState } from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ExpandIcon, CollapseIcon } from './icons';
import { useSerial } from './serial-context';
import { useTranslation } from "next-i18next";

interface CardContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({ children, title = "Serial Flow" }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [requestingPort, setRequestingPort] = useState(false);
  const { t } = useTranslation('common');
  const { selectedPort, setSelectedPort, reloadPortList, portList } = useSerial();

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
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="text-sm"
                >
                  {t("menu", "Menu")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Serial Flow Actions">
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
                  <DropdownItem key="port-header" className="font-semibold opacity-70" isReadOnly>
                    {t("availablePorts", "Available Ports")}
                  </DropdownItem>
                ) : null}

                {portList.length > 0 && !selectedPort ? portList.map((port, index) => {
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
                      onClick={() => setSelectedPort(port)}
                    >
                      {t("connectToPort", "Connect to Port")} {index + 1} {portInfo ? `(${portInfo})` : ''}
                    </DropdownItem>
                  );
                }) : null}
              </DropdownMenu>
            </Dropdown>

            {portList.length > 0 ? (
              <Button
                size="sm"
                color={selectedPort ? "danger" : "primary"}
                className="text-sm"
                isDisabled={!selectedPort && portList.length !== 1}
                onClick={() => {
                  if (selectedPort) {
                    // 已选择端口，执行断开操作
                    setSelectedPort(null);
                  } else if (portList.length === 1) {
                    // 如果只有一个端口，直接连接它
                    setSelectedPort(portList[0]);
                  }
                }}
              >
                {selectedPort
                  ? t("disconnect", "Disconnect")
                  : t("connect", "Connect")}
              </Button>
            ) : null}
          </div>
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
