"use client";

import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, SearchIcon } from "./icons";
import { useEffect, useState } from "react";
import { IconSwitch } from "./match-case-switch";
import { USB_VENDOR } from "@/config/usbvendor";
import { useTranslation } from "react-i18next";
import { useSerial } from "./serial-context";
import { BuadRateList, LevelList } from "@/config/constants";

export default function MenuBar() {
    const { t, i18n } = useTranslation();

    const sizes = ["sm", "md", "lg"];
    const size = "sm";
    const [matchCase, setMatchCase] = useState(false);

    const { portList, setSelectedPort } = useSerial();

    function onPortChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedPort = portList.find(port => port.getInfo().usbVendorId + ":" + port.getInfo().usbProductId === e.target.value);
        if (selectedPort) {
            setSelectedPort(selectedPort);
            console.log(`set selected port: ${selectedPort.getInfo().usbVendorId}:${selectedPort.getInfo().usbProductId}`);
        }
    }

    return (
        <div className="flex flex-row gap-4 pl-2">
            <Select
                className="min-w-[120px] w-auto"
                size={size}
                placeholder="Port"
                isDisabled={portList.length == 0}
                onChange={onPortChange}
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
                ) : (<SelectItem key="No Device" data-value="No Device">{t('No Device')}</SelectItem>)}
            </Select>
            <Select
                disableSelectorIconRotation
                className="min-w-[120px] w-auto"
                size={size}
                isDisabled={portList.length == 0}
                placeholder="BuadRate"
            >
                {BuadRateList.map((rate) => (
                    <SelectItem key={rate.key} >
                        {rate.label}
                    </SelectItem>
                ))}
            </Select>
            <Select
                disableSelectorIconRotation
                className="min-w-[100px] w-auto"
                size={size}
                placeholder="Level"
            >
                {LevelList.map((level) => (
                    <SelectItem key={level.key} >{level.label}</SelectItem>
                ))}
            </Select>
            <Input
                size={size}
                aria-label={t('Filter')}
                placeholder={t('Filter')}
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