const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Recipe = require('../models/Recipe');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const list = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes
router.post(
    '/',
    requireAuth,
    [
        body('id').isString().isLength({min:5}).withMessage('ID inválido'),
        body('name').isString().isLength({min:3}).withMessage('El nombre debe tener al menos 3 caracteres'),
        body('category').isString().notEmpty().withMessage('La categoría es obligatoria')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id, name, category } = req.body;
            const recipe = new Recipe({ id, name, category });
            await recipe.save();
            res.status(201).json(recipe);
        } catch (err) {
            next(err);
        }
    }
);

// PUT /api/recipes/:id
router.put(
    '/:id',
    requireAuth,
    [
        body('name').isString().isLength({min:3}).withMessage('El nombre debe tener al menos 3 caracteres'),
        body('category').isString().notEmpty().withMessage('La categoría es obligatoria')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const updates = {};
            if (req.body.name !== undefined) updates.name =req.body.name;
            if (req.body.category !== undefined) updates.category = req.body.category;

            const updated = await Recipe.findOneAndUpdate({ id }, updates, { new: true, runValidators: true });

            if (!updated) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    }
);

// DELETE /api/recipes/:id
router.delete(
    '/:id',
    requireAuth,
    [
        param('id').isString().isLength({min:5}).withMessage('ID inválido'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const deleted = await Recipe.findOneAndDelete({id});
            if (!deleted) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
        } catch (err) {
            next(err);
        }
    }
)

module.exports = router;