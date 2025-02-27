"use client";

import { Input } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, MatchWordIcon, SearchIcon } from "./icons";
import { IconSwitch } from "./match-case-switch";

export const SearchMenu = () => {
    const size = "sm";

    return (
        <div className="flex-grow">
            <Input
                size={size}
                placeholder="搜索"
                startContent={
                    <div className="flex flex-row gap-1">
                        <SearchIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                    </div>
                }
                endContent={
                    <div className="flex flex-row gap-1">
                        <IconSwitch icon={MatchCaseIcon}></IconSwitch>
                        <IconSwitch icon={MatchRegexIcon}></IconSwitch>
                        <IconSwitch icon={MatchWordIcon}></IconSwitch>
                    </div>
                }
            />
        </div>
    )
}
