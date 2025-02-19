'use client';

import { useSwitch } from "@heroui/react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { MatchCaseIcon, MoonFilledIcon, SunFilledIcon } from "./icons";
import { UseSwitchProps } from "@heroui/react";

export const IconSwitch = ({ icon: Icon, ...props }: { icon: React.FC<any> } & UseSwitchProps) => {
    const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
        useSwitch(props);

    return (
        <div className="flex flex-col gap-2">
            <Component {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "w-6 h-6",
                            "flex items-center justify-center",
                            "rounded-lg bg-default-100 hover:bg-default-200",
                        ],
                    })}
                >
                    <Icon />
                </div>
            </Component>
        </div>
    );
};