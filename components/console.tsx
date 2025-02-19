'use client'

import { useState } from 'react';

export function Console({ className }: { className?: string }) {
    const [console, setConsole] = useState('');

    return (
        <div className={`flex flex-col gap-2 ${className} bg-default-100`}>
            <div>{console}</div>
        </div>
    )
}
