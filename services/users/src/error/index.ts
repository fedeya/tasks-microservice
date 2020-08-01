import { Request, Response, NextFunction, Router, Handler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';

export class ErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class ErrorRouter {
  private _router = Router();

  constructor() {
    this.route.bind(this);
  }

  get router() {
    return this._router;
  }

  route(path: string) {
    const get = this.get.bind(this);
    const post = this.post.bind(this);
    const put = this.put.bind(this);
    const deleteA = this.delete.bind(this);

    return {
      get(...handlers: Handler[]) {
        get(path, ...handlers);
        return this;
      },
      post(...handlers: Handler[]) {
        post(path, ...handlers);
        return this;
      },
      put(...handlers: Handler[]) {
        put(path, ...handlers);
        return this;
      },
      delete(...handlers: Handler[]) {
        deleteA(path, ...handlers);
        return this;
      }
    };
  }

  get(path: string, ...handlers: Handler[]) {
    const handler = this.handlerExeception(handlers.pop());
    this.router.get(path, handlers, handler);
    return this;
  }

  post(path: string, ...handlers: Handler[]) {
    const handler = this.handlerExeception(handlers.pop());
    return this.router.post(path, handlers, handler);
  }

  put(path: string, ...handlers: Handler[]) {
    const handler = this.handlerExeception(handlers.pop());
    this.router.put(path, handlers, handler);
    return this;
  }

  delete(path: string, ...handlers: Handler[]) {
    const handler = this.handlerExeception(handlers.pop());
    this.router.delete(path, handlers, handler);
    return this;
  }

  handlerExeception(handler: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        handler(req, res)?.catch(($error: Error) => {
          errorParse($error, next);
        });
      } catch (err) {
        errorParse(err, next);
      }
    };
  }
}

export function errorParse(error: Error, next: NextFunction) {
  if (
    error instanceof MongooseError.ValidationError ||
    error instanceof MongooseError.CastError ||
    error instanceof MongoError
  ) {
    next(new ErrorHandler(400, error.message));
    return;
  }

  if (error instanceof ErrorHandler) {
    next(error);
    return;
  }

  next(new ErrorHandler(500, 'Error Perfoming Action'));
}

export function handleError(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { message, statusCode = 500 } = err;
  res.status(statusCode).json({ message, statusCode });
}
