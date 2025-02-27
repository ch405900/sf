"use client";

import { SidePanel } from "./sidepanel";
import { LogViewBody } from "./log-view-body";

export const LogBody = () => {
    return (
        <div className="flex flex-row h-[calc(100vh-4rem)]">
            <SidePanel ></SidePanel>
            <LogViewBody ></LogViewBody>
        </div>
    );
}