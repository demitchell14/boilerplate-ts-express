export default class CustomError extends Error {
    type: string;
    message: string;
    constructor(type: string, message = 'Oops! An error occurred.') {
        super()
        this.type = type;
        this.message = message;
    }

    getStatusCode() {
        return 500;
    }
}