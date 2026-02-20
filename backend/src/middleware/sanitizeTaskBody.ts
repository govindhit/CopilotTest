import { Request, Response, NextFunction } from 'express';

// Remove any keys that are not allowed for task creation/update
const allowedFields = ['title', 'description', 'completed', 'priority'];

export function sanitizeTaskBody(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete req.body[key];
      }
    });
  }
  next();
}
