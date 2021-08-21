const { indexSuggestions, getSuggestions, deleteIndex } = require('../controllers/suggestions.controller');
const router = require('express').Router();

// Retrieve suggetions
router.get('/', getSuggestions);

// Index suggestions
router.post('/', indexSuggestions);

// Delete index
router.delete('/', deleteIndex);

module.exports = router;