import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class AppAllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    const message = getMessage(exception)
    const statusCode = getStatusCode(exception)

    response.status(statusCode).json({ message })
  }
}

const getMessage = (exception: any) => {
  if (typeof exception === 'string') {
    return exception
  }
  if (exception.response && exception.response.message) {
    return exception.response.message
  }
  return exception.message ?? 'Unknown error!!!'
}

const getStatusCode = (exception) => {
  const statusCodeNumber = Number(exception.status)
  return isNaN(statusCodeNumber) ? 500 : statusCodeNumber
}
