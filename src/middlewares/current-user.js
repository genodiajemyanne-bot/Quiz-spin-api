// TEMPORARY - Week 11 only.
// Login is built in Week 12. Until then the caller says who they are in a header:
//     X-Demo-User: 2099-0001
// Anyone can type any ID, so this is NOT security.
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');

if (env.nodeEnv === 'production') {
  throw new Error('current-user.js is the Week 11 stand-in. Replace it before production.');
}

async function currentUser(req, res, next) {
  const schoolId = req.get('X-Demo-User');
  const user = schoolId ? await userRepository.findBySchoolId(schoolId) : null;

  // The database stores 'host' / 'player'; the code compares 'HOST' / 'PLAYER'.
  req.user = user
    ? { user_id: user.user_id, school_id: user.school_id, role: user.role.toUpperCase() }
    : null;
  next();
}

module.exports = currentUser;