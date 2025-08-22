import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    if (!request || !response) {
      return next.handle();
    }

    const method = request.method;
    const url = request.originalUrl || request.url;
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = response.statusCode ?? 200;
          const ms = Date.now() - started;
          this.logger.log(`${method} ${url} status:${status} ${ms}ms`);
        },
        error: (err: unknown) => {
          let status = response?.statusCode ?? 500;
          let message = 'Unhandled error';
          let stack: string | undefined;

          if (err instanceof HttpException) {
            status = err.getStatus();
            message = err.message;
            stack = (err as Error).stack;
          } else if (err instanceof Error) {
            message = err.message;
            stack = err.stack;
          } else {
            message = String(err);
          }

          const ms = Date.now() - started;
          this.logger.error(
            `${method} ${url} status:${status} +${ms}ms - ${message}`,
            stack,
          );
        },
      }),
    );
  }
}
