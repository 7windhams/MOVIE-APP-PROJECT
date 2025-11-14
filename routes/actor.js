const express = require('express');
const router = express.Router();
const { 
    getAllActors, 
    getActorById, 
    getActorsSorted, 
    getActorsByNationality, 
    createActor, 
    updateActor 
} = require('../controllers/actorController');

router.get('/', getAllActors);
router.get('/sorted', getActorsSorted);
router.get('/nationality/:nationality', getActorsByNationality);
router.get('/:id', getActorById);
router.post('/', createActor);
router.patch('/:id', updateActor);

module.exports = router;