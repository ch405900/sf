"use client";

import { SearchMenu } from "./search-menu";
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";


export const SearchBar = () => {

    return <div className="flex flex-row gap-4 items-stretch">
        <SearchMenu></SearchMenu>
        <div className="flex flex-row gap-2 items-center justify-center">
            <div className="text-sm" >0 results</div>
            <Button size="sm" isIconOnly aria-label="Like">
                <FontAwesomeIcon
                    icon={faArrowUp}
                />
            </Button>
            <Button size="sm" isIconOnly aria-label="Like">
                <FontAwesomeIcon
                    icon={faArrowDown}
                />
            </Button>
        </div>
    </div>
}
