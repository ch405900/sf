import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, SearchIcon } from "./icons";
import { useState, useEffect } from "react";
import { IconSwitch } from "./match-case-switch";
import { useSerial } from "./serial-context";
import { useTranslation } from "next-i18next";
import { BuadRateList, LevelList, DEFAULT_BAUD_RATE, DEFAULT_LOG_LEVEL } from "@/model/constants";
import { USB_VENDOR } from "@/model/usbvendor";

export default function MenuBar() {

    const _sizes = ["sm", "md", "lg"];
    const size = "sm";
    const [_matchCase, _setMatchCase] = useState(false);
    const [selectedBaudRate, setSelectedBaudRate] = useState(DEFAULT_BAUD_RATE);
    const [selectedLogLevel, setSelectedLogLevel] = useState(DEFAULT_LOG_LEVEL);

    const { portList, setSelectedPort } = useSerial();
    const { t } = useTranslation('common');

    // 当端口列表变化时，默认选择第一个端口
    useEffect(() => {
        if (portList.length > 0) {
            setSelectedPort(portList[0]);
            console.log(`Auto selected first port: ${portList[0].getInfo().usbVendorId}:${portList[0].getInfo().usbProductId}`);
        } else {
            setSelectedPort(null);
        }
    }, [portList, setSelectedPort]);

    function onPortChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedPort = portList.find(port => port.getInfo().usbVendorId + ":" + port.getInfo().usbProductId === e.target.value);
        if (selectedPort) {
            setSelectedPort(selectedPort);
            console.log(`set selected port: ${selectedPort.getInfo().usbVendorId}:${selectedPort.getInfo().usbProductId}`);
        }
    }

    function onBaudRateChange(value: string) {
        setSelectedBaudRate(value);
        console.log(`set baud rate: ${value}`);
    }

    function onLogLevelChange(value: string) {
        setSelectedLogLevel(value);
        console.log(`set log level: ${value}`);
    }

    return (
        <div className="flex flex-row gap-4 pl-2">
         {/*    <Select
                className="min-w-[120px] w-auto"
                size={size}
                placeholder={t("label.Port")}
                isDisabled={portList.length == 0}
                onChange={onPortChange}
                selectedKeys={portList.length > 0 && portList[0] ? [portList[0].getInfo().usbVendorId + ":" + portList[0].getInfo().usbProductId] : []}
            >
                {portList.length > 0 ? (
                    portList.map((port) => {
                        const info = port.getInfo();
                        const key = info.usbVendorId + ":" + info.usbProductId;
                        if (info.usbVendorId && USB_VENDOR.has(info.usbVendorId)) {
                            const vendor = USB_VENDOR.get(info.usbVendorId);
                            const name = vendor?.alias;
                            return <SelectItem key={key} data-value={port}>{name}</SelectItem>
                        }
                        return <SelectItem key={key} data-value={port}>{key}</SelectItem>;
                    })
                ) : (<SelectItem key="No Device" data-value="No Device">{('No Device')}</SelectItem>)}
            </Select> */}   
            <Select
                disableSelectorIconRotation
                className="min-w-[120px] w-auto"
                size={size}
                isDisabled={portList.length == 0}
                placeholder={t("label.BuadRate")}
                selectedKeys={[selectedBaudRate]}
                onChange={onBaudRateChange}
            >
                {BuadRateList.map((rate) => (
                    <SelectItem key={rate.key} >
                        {rate.label}
                    </SelectItem>
                ))}
            </Select>
            <Select
                disableSelectorIconRotation
                className="min-w-[120px] w-auto"
                size={size}
                placeholder={t("label.Level")}
                selectedKeys={[selectedLogLevel]}
                onChange={onLogLevelChange}
            >
                {LevelList.map((level) => (
                    <SelectItem key={level.key} >{level.label}</SelectItem>
                ))}
            </Select>
            <Input
                size={size}
                aria-label={t("label.Filter")}
                placeholder={t('label.Filter')}
                startContent={
                    <SearchIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                endContent={
                    <div className="flex flex-row gap-1">
                        <IconSwitch icon={MatchCaseIcon}></IconSwitch>
                        <IconSwitch icon={MatchRegexIcon}></IconSwitch>
                    </div>
                }
            />
        </div>
    )
}