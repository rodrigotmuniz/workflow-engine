import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { throwError } from 'rxjs'
import { QueryFailedError } from 'typeorm'

@Catch(QueryFailedError)
export class AppQueryFailedErrorFilter implements ExceptionFilter<QueryFailedError> {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    return throwError(() => ({
      message: exception.message,
      status: 409,
    }))
  }
}
