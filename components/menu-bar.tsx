"use client";

import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, SearchIcon } from "./icons";
import { useState } from "react";
import { IconSwitch } from "./match-case-switch";

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


export const MenuBar = () => {
    const sizes = ["sm", "md", "lg"];
    const size = "sm";
    const [matchCase, setMatchCase] = useState(false);
    return (
        <div className="flex flex-row gap-4 pl-2">
            <Select
                disableSelectorIconRotation
                className="max-w-[8vw]"
                size={size}
                placeholder="Port"
            >
                {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
            </Select>
            <Select
                disableSelectorIconRotation
                className="max-w-[10vw]"
                size={size}
                placeholder="BuadRate"
            >
                {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
            </Select>
            <Select
                disableSelectorIconRotation
                className="max-w-[8vw]"
                size={size}
                placeholder="Level"
            >
                {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
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