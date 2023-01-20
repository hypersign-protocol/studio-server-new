import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus, HttpExceptionOptions } from '@nestjs/common';

export class AppNotFoundException extends HttpException {
  constructor(/*status?: number, options?: HttpExceptionOptions, response?: string | Record<string, any>*/) {

    super({
      message: ['Application Not Found'],
      statusCode: HttpStatus.BAD_REQUEST,
      error: "Bad Request"

    }, HttpStatus.BAD_REQUEST);

  }
}




@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();



    let status;
    let message;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: ['Internal server error'],
      };
    }

    response.status(status).json(message);
  }
}
