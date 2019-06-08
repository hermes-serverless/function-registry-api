export interface RouteErrorConstructorArgs {
  errorName: string
  msg: string
  statusCode: number
}

export class RouteError extends Error {
  private msg: string
  private errorName: string
  private statusCode: number

  constructor({ errorName, msg, statusCode }: RouteErrorConstructorArgs) {
    super(msg)
    this.msg = msg
    this.statusCode = statusCode
    this.errorName = errorName
  }

  getStatusCode() {
    return this.statusCode
  }

  getMessage() {
    return this.msg
  }

  getErrorName() {
    return this.errorName
  }
}

export class NoSuchUser extends RouteError {
  constructor(args: RouteErrorConstructorArgs) {
    super(args)
  }
}

export class NoSuchFunction extends RouteError {
  constructor(args: RouteErrorConstructorArgs) {
    super(args)
  }
}
