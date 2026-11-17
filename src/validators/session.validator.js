const { body, param } = require('express-validator');

const codeParam = param('code')
  .matches(/^[1-9]\d{5}$/)
  .withMessage('The join code must be six digits.');

const createRules = [
  body('question_set_id').isInt({ min: 1 }).withMessage('question_set_id must be a positive whole number.').toInt(),
];

const statusRules = [
  codeParam,
  body('status').isIn(['active', 'completed']).withMessage('status must be "active" or "completed".'),
];

const joinRules = [
  codeParam,
  body('nickname').trim().isLength({ min: 1, max: 24 }).withMessage('nickname must be 1 to 24 characters.'),
];

const codeRules = [codeParam];

module.exports = { createRules, statusRules, joinRules, codeRules };