import { Router } from 'express';

import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/task.controller';
import { validateTaskInput, validateTaskUpdateInput } from '../middleware/taskValidation';
import { sanitizeTaskBody } from '../middleware/sanitizeTaskBody';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', sanitizeTaskBody, validateTaskInput, createTask);
router.put('/:id', sanitizeTaskBody, validateTaskUpdateInput, updateTask);
router.delete('/:id', deleteTask);

export default router;
