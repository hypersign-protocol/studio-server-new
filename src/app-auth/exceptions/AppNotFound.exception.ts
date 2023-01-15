import { HttpException, HttpStatus  } from "@nestjs/common";

export class AppNotFoundException extends HttpException {
    constructor(msg?: string, status?: HttpStatus){
        super(msg || 'Application Not found', status || HttpStatus.NOT_FOUND)
    }
}
