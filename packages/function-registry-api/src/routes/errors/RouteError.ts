import { ValidationError as SequelizeValidationError } from 'sequelize/types'

interface ObjectWithKeys {
  [key: string]: any
}

export interface RouteErrorConstructorArgs {
  errorName: string
  msg: string
  statusCode: number
  detail?: ObjectWithKeys
}

export class RouteError extends Error {
  private msg: string
  private errorName: string
  private statusCode: number
  private detail: any

  constructor({ errorName, msg, statusCode, detail }: RouteErrorConstructorArgs) {
    super(msg)
    this.msg = msg
    this.statusCode = statusCode
    this.errorName = errorName
    if (detail != null) this.detail = detail
  }

  getResponseObject() {
    return {
      error: this.errorName,
      message: this.msg,
      ...(this.detail != null ? { detail: this.detail } : {}),
    }
  }

  getStatusCode() {
    return this.statusCode
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

export class NoSuchRun extends RouteError {
  constructor(args: RouteErrorConstructorArgs) {
    super(args)
  }
}

export class ValidationError extends RouteError {
  constructor(msg: string, statusCode: number, validationError: SequelizeValidationError) {
    const errorName = 'ValidationError'
    const validationErrors = validationError.errors.reduce((acum, el) => {
      return {
        ...acum,
        [el.path]: el.message,
      }
    }, {})

    super({
      errorName,
      msg,
      statusCode,
      detail: validationErrors,
    })
  }
}

export class FunctionAlreadyExists extends RouteError {
  constructor(msg?: string) {
    super({
      msg: msg ? msg : `Function with this name and version already exists for this user`,
      errorName: 'FunctionAlreadyExists',
      statusCode: 409,
    })
  }
}
