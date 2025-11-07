const express = require('express');
const router = express.Router();
const { getAllActors, getActorById, getActorsSorted, getActorsByNationality } = require('../controllers/actorController');

router.get('/', getAllActors);
router.get('/sorted', getActorsSorted);
router.get('/nationality/:nationality', getActorsByNationality);
router.get('/:id', getActorById);

module.exports = router;