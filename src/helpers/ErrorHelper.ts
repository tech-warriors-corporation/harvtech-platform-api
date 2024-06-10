export class ErrorHelper {
    static createErrorModel(message: string) {
        return {
            error: { message },
        }
    }
}
