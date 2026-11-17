const playerService = require('../services/player.service');

// 201 for a new seat, 200 for a rejoin (same row, same score).
async function join(req, res, next) {
  try {
    const { session, player, created } = await playerService.join(
      req.params.code,
      req.body.nickname,
      req.user
    );
    res.status(created ? 201 : 200).json({ session, player });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    res.json(await playerService.list(req.params.code));
  } catch (error) {
    next(error);
  }
}

module.exports = { join, list };