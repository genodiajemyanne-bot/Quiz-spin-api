const { Player } = require('../models');

// The seat of one account in one session, or null. This one query is the rejoin rule.
function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}
function findAllBySession(sessionId) {
  return Player.findAll({ where: { session_id: sessionId }, order: [['player_id', 'ASC']] });
}
function create(data) {
  return Player.create(data);
}

module.exports = { findSeat, findAllBySession, create };