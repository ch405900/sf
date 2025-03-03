"use client";

import { SerialProvider } from "./serial-context";
import { LogArea } from "./log-area";

export const Main = () => {
    return (
        <SerialProvider>
            <div className="h-full flex flex-col">
                <LogArea />
            </div>
        </SerialProvider>
    );
}
