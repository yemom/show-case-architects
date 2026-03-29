import express from 'express';
import auth from '../midleware/auth.js';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/', getCategories);
categoryRoute.post('/', auth, createCategory);
categoryRoute.put('/:id', auth, updateCategory);
categoryRoute.delete('/:id', auth, deleteCategory);

export default categoryRoute;
