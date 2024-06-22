export class SanitizeHelper {
    static input(text: string): string {
        return text
            .trim()
            .replace(/['";=<>]/g, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
    }
}
