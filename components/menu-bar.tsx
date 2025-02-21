"use client";

import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, SearchIcon } from "./icons";
import { useEffect, useState } from "react";
import { IconSwitch } from "./match-case-switch";
import { USB_VENDOR } from "@/config/usbvendor";

export const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
];

export const BuadRateList = [
    { key: "1200", label: "1200", alias: "1.2kbps" },
    { key: "2400", label: "2400", alias: "2.4kbps" },
    { key: "4800", label: "4800", alias: "4.8kbps" },
    { key: "9600", label: "9600", alias: "9.6kbps" },
    { key: "19200", label: "19200", alias: "19.2kbps" },
    { key: "38400", label: "38400", alias: "38.4kbps" },
    { key: "57600", label: "57600", alias: "57.6kbps" },
    { key: "115200", label: "115200", alias: "115.2kbps" },
    { key: "230400", label: "230400", alias: "230.4kbps" },
    { key: "460800", label: "460800", alias: "460.8kbps" },
    { key: "921600", label: "921600", alias: "921.6kbps" },
];

const LevelList = [
    { key: "1", label: "Verbose" },
    { key: "2", label: "Debug" },
    { key: "3", label: "Info" },
    { key: "4", label: "Warn" },
    { key: "5", label: "Error" },
    { key: "6", label: "Fatal" },
];

export const MenuBar = () => {
    const sizes = ["sm", "md", "lg"];
    const size = "sm";
    const [matchCase, setMatchCase] = useState(false);

    const [portList, setPortList] = useState<SerialPort[]>([]);
    const [port, setPort] = useState<SerialPort | null>(null);

    useEffect(() => {
        const fetchPorts = async () => {
            const portList = await navigator.serial.getPorts();
            setPortList(portList);
            portList.forEach(async (port) => {
                const info = await port.getInfo();
                console.log(info);
            });
        };
        fetchPorts();
    }, []);

    return (
        <div className="flex flex-row gap-4 pl-2">
            <Select
                className="min-w-[120px] w-auto"
                size={size}
                placeholder="Port"
            >
                {portList.map((port) => {
                    const info = port.getInfo();
                    if (info.usbVendorId && USB_VENDOR.has(info.usbVendorId)) {
                        const vendor = USB_VENDOR.get(info.usbVendorId);
                        const name = vendor?.alias;
                        return <SelectItem key={name}>{name}</SelectItem>
                    }
                    return <SelectItem key={info.usbVendorId + ":" + info.usbProductId}>{info.usbVendorId + ":" + info.usbProductId}</SelectItem>;
                })}
            </Select>
            <Select
                disableSelectorIconRotation
                className="min-w-[120px] w-auto"
                size={size}
                placeholder="BuadRate"
            >
                {BuadRateList.map((rate) => (
                    <SelectItem key={rate.key}>
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
                    <SelectItem key={level.key}>{level.label}</SelectItem>
                ))}
            </Select>
            <Input
                size={size}
                placeholder="过滤"
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