import CustomError from "./CustomError";

export default class AuthenticationError extends CustomError {
    error: number;
    constructor(message: string) {
        super('authentication');
        this.message = message;
        this.error = -4000
    }

    getStatusCode(): number {
        return 401;
    }

}