export class RouteError extends Error {
  msg: string
  statusCode: number
  constructor(msg: string, statusCode: number) {
    super(msg)
    this.msg = msg
    this.statusCode = statusCode
  }

  getStatusCode() {
    return this.statusCode
  }

  getMessage() {
    return this.msg
  }
}

export class NoSuchUser extends RouteError {
  constructor(msg: string, statusCode: number) {
    super(msg, statusCode)
  }
}

export class NoSuchFunction extends RouteError {
  constructor(msg: string, statusCode: number) {
    super(msg, statusCode)
  }
}
