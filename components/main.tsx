'use client';

import { Divider } from "@heroui/react";
import { MenuBar } from "./menu-bar";
import { LogBody } from "./log-body";

export const Main = () => {
    return (
        <div className="h-screen flex flex-col p-2">
            <MenuBar />
            <Divider className="my-2" />
            <LogBody />
        </div>
    );
}


