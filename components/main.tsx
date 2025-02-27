"use client";

import { Divider } from "@heroui/react";
import { LogBody } from "./log-body";
import MenuBar from "./menu-bar";
import { SerialProvider } from "./serial-context";

export const Main = () => {

    return (
        <SerialProvider>
            <div className="h-screen flex flex-col p-2">
                <MenuBar ></MenuBar>
                <Divider className="my-2" />
                <LogBody ></LogBody>
            </div>
        </SerialProvider>
    );
}


