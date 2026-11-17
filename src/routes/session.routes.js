// Maps a verb and URL to guards, rules and one controller. No logic here.
const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const rules = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Hosts run the game.
router.post('/', requireUser('HOST'), rules.createRules, validate, sessionController.create);
router.patch('/:code/status', requireUser('HOST'), rules.statusRules, validate, sessionController.changeStatus);

// Players join and look around.
router.get('/:code', requireUser(), rules.codeRules, validate, sessionController.get);
router.post('/:code/players', requireUser(), rules.joinRules, validate, playerController.join);
router.get('/:code/players', requireUser(), rules.codeRules, validate, playerController.list);

module.exports = router;