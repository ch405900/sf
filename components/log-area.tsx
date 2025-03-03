import { Divider } from "@heroui/react"
import MenuBar from "./menu-bar"
import { LogBody } from "./log-body"

export const LogArea = () => {
    return (
        <div className="flex flex-col p-2 h-full">
            <MenuBar></MenuBar>
            <Divider className="my-2" />
            <div className="flex-1 overflow-auto">
                <LogBody></LogBody>
            </div>
        </div>
    )
}