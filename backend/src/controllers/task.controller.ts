
import { Request, Response } from 'express';
import { Task } from '../models/task.model';
import logger from '../middleware/logger';

let tasks: Task[] = [];
let nextId = 1;


export const getTasks = (req: Request, res: Response) => {

    // Sort tasks by dueDate (ascending), tasks with no dueDate go last
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    res.json(sortedTasks);
    logger.info(`Returned ${sortedTasks.length} tasks (sorted by dueDate)`);
};

export const getTaskById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  logger.debug(`Fetching task by id: ${id}`);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    logger.error(`Task not found: id=${id}`);
    return res.status(404).json({ error: 'Task not found' });
  }
  logger.info(`Returned task id=${id}`);
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {
  logger.debug('Creating new task');
  let dueDate = req.body.dueDate;
  if (!dueDate && req.body.priority === 'high') {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    dueDate = now.toISOString().split('T')[0];
  }
  const task: Task = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description || '',
    completed: req.body.completed ?? false,
    priority: req.body.priority,
    ...(dueDate ? { dueDate } : {}),
  };
  tasks.push(task);
  logger.info(`Created task id=${task.id}`);
  res.status(201).json(task);
};

export const updateTask = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  logger.debug(`Updating task id=${id}`);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    logger.error(`Task not found for update: id=${id}`);
    return res.status(404).json({ error: 'Task not found' });
  }
  if (task.completed) {
    logger.error(`Attempt to edit completed task id=${id}`);
    return res.status(400).json({ error: 'Completed tasks cannot be edited.' });
  }
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.description !== undefined) task.description = req.body.description;
  if (req.body.completed !== undefined) task.completed = req.body.completed;
  if (req.body.priority !== undefined) task.priority = req.body.priority;
  if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
  logger.info(`Updated task id=${id}`);
  res.json(task);
};

export const deleteTask = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  logger.debug(`Deleting task id=${id}`);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    logger.error(`Task not found for delete: id=${id}`);
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  logger.info(`Deleted task id=${id}`);
  res.status(204).send();
};
