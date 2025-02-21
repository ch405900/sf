enum DataSourceType {
    WEB_SERIAL = 'web-serial',
    TCP = 'tcp',
    MOCK = 'mock'
}

// 通用配置类型
interface ConnectionConfig {
    type: DataSourceType;
    baudRate: number;
    port?: string;
    host?: string;
    portNumber?: number;
}

// 通用数据源接口
interface DataSource {
    open(): Promise<void>;
    close(): Promise<void>;
    onData(callback: (data: Uint8Array) => void): Promise<void>;
    writeData(data: Uint8Array): void;
}


// Web Serial 实现
class WebSerialDataSource implements DataSource {
    private port: SerialPort | null = null;
    private reader: ReadableStreamDefaultReader | null = null;

    constructor(private config: ConnectionConfig) { }

    async open(): Promise<void> {
        this.port = await navigator.serial.requestPort();
        await this.port.open({ baudRate: this.config.baudRate });
    }

    async close(): Promise<void> {
        await this.port?.close();
    }

    async onData(callback: (data: Uint8Array) => void): Promise<void> {
        while (this.port!.readable) {
            const reader = this.port!.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        // |reader| has been canceled.
                        break;
                    }
                    // Do something with |value|...
                    callback(value);
                }
            } catch (error) {
                // Handle |error|...
            } finally {
                reader.releaseLock();
            }
        }
    }

    async writeData(data: Uint8Array): Promise<void> {
        const writer = this.port!.writable!.getWriter();
        await writer.write(data);
        writer.releaseLock();
    }
}

// 工厂函数
export function createDataSource(config: ConnectionConfig): DataSource {
    switch (config.type) {
        case DataSourceType.WEB_SERIAL:
            return new WebSerialDataSource(config);

        default:
            throw new Error(`Unsupported data source type: ${config.type}`);
    }
}

