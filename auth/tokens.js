const jwt = require('jsonwebtoken')
const _ = require('lodash')

const createTokens = async (user, secret) => {
  const createToken = await jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '1m',
    },
  )

  const createRefreshToken = await jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '7d',
    },
  )
  const verifyToken = jwt.verify(createToken, secret)
  const verifyRefresh = jwt.verify(createRefreshToken, secret)

  return {
    accessToken: createToken,
    refreshToken: createRefreshToken,
    accessTokenExpiredAt: verifyToken.exp * 1000,
    refreshTokenExpiredAt: verifyRefresh.exp * 1000,
  }
}

const refreshTokens = async (refreshToken, models, SECRET) => {
  let userId = -1
  try {
    userId = jwt.verify(refreshToken, SECRET).user.id
  } catch (err) {
    return {}
  }
  //console.log(`UserID is ${userId}`)
  const user = await models.getUserById(userId)
 // console.log(`secret is ${SECRET}`)

  if (user) {
    return (await createTokens(user, SECRET))
  } else {
    return {}
  }
  
}

module.exports = {
  createTokens,
  refreshTokens,
}
