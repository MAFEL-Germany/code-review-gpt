export function extractBaseUrl(urlString: string): string {
    try {
        const url = new URL(urlString);
        return url.origin; // This returns the protocol, hostname, and port (if specified)
    } catch (error) {
        console.error("Invalid URL:", error);
        return "";
    }
}