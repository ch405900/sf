import { Button, Input, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, PressEvent } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, SearchIcon } from "./icons";
import { useState, useEffect } from "react";
import { IconSwitch } from "./match-case-switch";
import { useSerial } from "./serial-context";
import { useTranslation } from "next-i18next";
import { BuadRateList, LevelList, DEFAULT_BAUD_RATE, DEFAULT_LOG_LEVEL, LogLevel } from "@/model/constants";
import { USB_VENDOR } from "@/model/usbvendor";

export default function MenuBar() {

    const _sizes = ["sm", "md", "lg"];
    const size = "sm";
    const [_matchCase, _setMatchCase] = useState(false);
    const [selectedBaudRate, setSelectedBaudRate] = useState(DEFAULT_BAUD_RATE);
    const [selectedLogLevel, setSelectedLogLevel] = useState(DEFAULT_LOG_LEVEL);

    const { portList, setSelectedPort } = useSerial();
    const { t } = useTranslation('common');

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
            <Popover placement="bottom"
            >
                <PopoverTrigger >
                    <Button size='sm' className="min-w-[120px] px-4"
                        color="primary"
                        variant='bordered'>
                        {`${selectedBaudRate}Bps`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Listbox
                        disallowEmptySelection
                        aria-label="Single selection example"
                        selectedKeys={[selectedBaudRate]}
                        selectionMode="single"
                        variant="flat">
                        {BuadRateList.map((rate) => (
                            <ListboxItem key={rate.key} onPress={
                                () => {
                                    onBaudRateChange(rate.key)
                                }
                            }>
                                {rate.label}
                            </ListboxItem>
                        ))}
                    </Listbox>
                </PopoverContent>
            </Popover>
            <Popover placement="bottom">
                <PopoverTrigger >
                    <Button size='sm' className="min-w-[120x] w-auto px-4"
                        variant='faded'>
                        {LevelList.find((item) => {
                            return item.key === selectedLogLevel
                        })?.label}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Listbox
                        disallowEmptySelection
                        aria-label="Single selection example"
                        selectedKeys={[selectedLogLevel]}
                        selectionMode="single"
                        variant="flat">
                        {LevelList.map((level) => (
                            <ListboxItem key={level.key} onPress={
                                () => {
                                    onLogLevelChange(level.key)
                                }
                            }>
                                {level.label}
                            </ListboxItem>
                        ))}
                    </Listbox>
                </PopoverContent>
            </Popover>
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