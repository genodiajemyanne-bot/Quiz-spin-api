const sessionService = require('../services/session.service');

async function create(req, res, next) {
  try {
    const session = await sessionService.create(req.body.question_set_id, req.user);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    res.json(await sessionService.findOrFail(req.params.code));
  } catch (error) {
    next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const session = await sessionService.changeStatus(req.params.code, req.body.status, req.user);
    res.json(session);
  } catch (error) {
    next(error);
  }
}

module.exports = { create, get, changeStatus };