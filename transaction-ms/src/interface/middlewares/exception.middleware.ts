import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionMiddleware implements ExceptionFilter {
  catch(exception: HttpException) {
    const status: HttpStatus = exception.getStatus();
    const error =
      status === HttpStatus.BAD_REQUEST
        ? // @ts-expect-error inside message are Validation details
          exception.getResponse().message
        : exception;

    return {
      status,
      data: null,
      error,
    };
  }
}
