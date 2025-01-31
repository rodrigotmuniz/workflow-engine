import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc().getContext()
    const method  = request.args[1]
    this.logger.log(`Intercepting ${method}`)

    return next.handle().pipe(
      map((response) => {
        if (response == null) {
          this.logger.log(`Response is null for ${method}, returning empty object`)
          return {}
        }

        const responseData = response.data ? response : { data: response }
        this.logger.log(`Returning response for ${method}: ${JSON.stringify(responseData)}`)
        return responseData
      }),
    )
  }
}
