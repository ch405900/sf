import { SidePanel } from "./sidepanel";
import { LogViewBody } from "./log-view-body";

export const LogBody = () => {
    return (
        <div className="flex flex-row h-full">
            <SidePanel></SidePanel>
            <LogViewBody></LogViewBody>
        </div>
    );
}