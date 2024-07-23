import { NextFunction, Request, Response } from 'express';

export const api = {
  http: function (handler: any) {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        const object = req.body;
        const options = {
          params: req.params,
          query: req.query,
          headers: req.headers,
        };

        const result = await handler(object, options);
        res.json(result);
      } catch (error) {
        next(error);
      }
    };
  },
};
