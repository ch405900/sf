"use client";

import { Input } from "@heroui/react";
import { MatchCaseIcon, MatchRegexIcon, MatchWordIcon, SearchIcon } from "./icons";
import { IconSwitch } from "./match-case-switch";
import { useTranslation } from "next-i18next";

export const SearchMenu = () => {
    const size = "sm";
    const { t } = useTranslation('common');

    return (
        <div className="flex-grow">
            <Input
                size={size}
                placeholder={t('label.Search')}
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
