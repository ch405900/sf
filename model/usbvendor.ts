class Product {
    constructor(public vendor: string, public name: string, public alias: string) { }
}

export const USB_VENDOR = new Map<number, Product>([
    [12346, new Product("Expressif", "ESP32-S3", "ESP32-S3")],
]);