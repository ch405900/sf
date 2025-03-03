import { DEFAULT_LOG_LEVEL } from "./constants";

// Log level state management
interface LogFilterState {
    currentLevel: string;
}

// Initialize with default log level
const logFilterState: LogFilterState = {
    currentLevel: DEFAULT_LOG_LEVEL
};

// Get current log level
export function getCurrentLogLevel(): string {
    return logFilterState.currentLevel;
}

// Set current log level
export function setCurrentLogLevel(level: string): void {
    logFilterState.currentLevel = level;
}

// Check if a log message with a certain level should be displayed based on current filter level
export function shouldDisplayLog(messageLevel: string): boolean {
    // Lower levels (like Verbose=1) should display higher level logs (like Error=5)
    // But higher levels (like Error=5) should not display lower level logs (like Debug=2)
    return parseInt(messageLevel) >= parseInt(logFilterState.currentLevel);
}
