import { Listbox, ListboxItem } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSerial } from './serial-context';
import { USB_VENDOR } from "@/model/usbvendor";

export default function CardTitleDeviceDropList() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const { selectedPort, setSelectedPort, reloadPortList, portList, openPort, closePort, openedPorts } = useSerial();
  const { t } = useTranslation('common');

  const getDeviceName = (port: SerialPort) => {
    const info = port.getInfo();
    try {
      if (info.usbVendorId) {
        const vendor = USB_VENDOR.get(info.usbVendorId);
        if (vendor) {
          return `${vendor.alias} (${info.usbVendorId.toString(16)}:${info.usbProductId?.toString(16) || 'N/A'})`;
        }
        return `Device ${info.usbVendorId.toString(16)}:${info.usbProductId?.toString(16) || 'N/A'}`;
      }
    } catch (e) {
      console.error("Error getting port info:", e);
    }
    return `${info.usbVendorId}:${info.usbProductId || 'N/A'}` || `${portList.indexOf(port) + 1}`;
  };

  return (
    <Listbox
      disallowEmptySelection
      aria-label="Single selection example"
      selectedKeys={selectedKeys}
      selectionMode="none"
      variant="flat"
      onSelectionChange={(keys) => {
        // 将 Selection 类型转换为 Set<string>
        if (typeof keys === "string") {
          setSelectedKeys(new Set([keys]));
        } else if (keys instanceof Set) {
          setSelectedKeys(keys as Set<string>);
        }
      }}
    >
      {portList.map((port, index) => {
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
          <ListboxItem
            key={`port-${index}`}
            onPress={() => {
              setSelectedPort(port);
              // addToast({
              //   title: t("connectSuccess", "Connect Success"),
              //   description: `${t("connectSuccessDesc", "You have successfully connected to")} ${t("serialPort", "Serial Port")} ${index + 1}`,
              //   variant: "flat",
              //   timeout: 3000,
              //   shouldShowTimeoutProgess: true,
              // });
            }}
          >
            {getDeviceName(port)}
          </ListboxItem>
        );
      })}
    </Listbox>
  )
}