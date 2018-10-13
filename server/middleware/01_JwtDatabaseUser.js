const User = require('../modules/05_user/User');

/**
 * Load user into request if found
 *
 * @param {Object} ctx
 */
const middleware = async (ctx, next) => {
  const jwttoken = parseJwtHeader(ctx.request.header);
  const user = await User.getUserFromJwt(jwttoken);
  ctx.state['user'] = user;
  return await next();
}

/**
 * Parse JWT from HTTP headers
 *
 * @param {Object} header
 */
const parseJwtHeader = (header) => {
  if (process.env.FSTACK_DEBUG) console.log('Authorization header:', header.authorization);
  const token = (header.authorization || '')
    .replace('Bearer', '')
    .trim();
  return token;
}

module.exports = middleware;
