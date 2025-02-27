"use client";

import { Button, Input } from "@heroui/react";

// 与设备交互的区域
// 发送数据, 信号
export const UserArea = () => {
    return (
        <div className="flex flex-row bg-default-400">
            <Input className="m-2" placeholder="Message" />
            <div className="flex justify-end bg-default-400">
                <Button className="m-2">Send</Button>
            </div>
        </div>
    );
}