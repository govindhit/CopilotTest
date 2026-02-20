import { Request, Response, NextFunction } from 'express';

export function validateTaskInput(req: Request, res: Response, next: NextFunction) {
  const { title, description, completed, priority } = req.body;
  if (title === undefined || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string.' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean.' });
  }
  if (priority === undefined || !['high', 'medium', 'low'].includes(priority)) {
    return res.status(400).json({ error: "Priority is required and must be one of 'high', 'medium', or 'low'." });
  }
  next();
}

export function validateTaskUpdateInput(req: Request, res: Response, next: NextFunction) {
  const { title, description, completed, priority } = req.body;
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string.' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean.' });
  }
  if (priority !== undefined && !['high', 'medium', 'low'].includes(priority)) {
    return res.status(400).json({ error: "Priority must be one of 'high', 'medium', or 'low'." });
  }
  next();
}
