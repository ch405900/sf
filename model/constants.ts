export const BuadRateList = [
    { key: "1200", label: "1200", alias: "1.2kbps" },
    { key: "2400", label: "2400", alias: "2.4kbps" },
    { key: "4800", label: "4800", alias: "4.8kbps" },
    { key: "9600", label: "9600", alias: "9.6kbps" },
    { key: "19200", label: "19200", alias: "19.2kbps" },
    { key: "38400", label: "38400", alias: "38.4kbps" },
    { key: "57600", label: "57600", alias: "57.6kbps" },
    { key: "115200", label: "115200", alias: "115.2kbps" },
    { key: "230400", label: "230400", alias: "230.4kbps" },
    { key: "460800", label: "460800", alias: "460.8kbps" },
    { key: "921600", label: "921600", alias: "921.6kbps" },
];

export interface LogLevel {
    key: string;
    label: string;
    color: string;
}

export const LevelList: Array<LogLevel> = [
    { key: "1", label: "Verbose", color: "#d7d7d7" },
    { key: "2", label: "Debug", color: "#d7d7d7" },
    { key: "3", label: "Info", color: "#d7d7d7" },
    { key: "4", label: "Warn", color: "#d7d7d7" },
    { key: "5", label: "Error", color: "#d7d7d7" },
    { key: "6", label: "Fatal", color: "#d7d7d7" },
];

// Default values
export const DEFAULT_BAUD_RATE = "115200";
export const DEFAULT_LOG_LEVEL = "1"; // Verbose