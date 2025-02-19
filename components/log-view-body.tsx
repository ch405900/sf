'use client';

import { LogRenderer } from "./log-renderer";
import { SearchBar } from "./searchbar";
import { UserArea } from "./user-area";

export const LogViewBody = () => {
    return <div className="flex-1 flex flex-col ml-2">
        <SearchBar />
        <div className="flex flex-col min-h-0 mt-4 flex-1 bg-default-100">
            <LogRenderer />
            <UserArea />
        </div>
    </div>;
}


