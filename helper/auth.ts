import {Request, Response} from 'express'

import {
  COOKIE_OPTIONS,
  LOGIN_REFRESH_TOKEN_COOKIE_MAX_AGE,
  LOGIN_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
  TOKEN_COOKIE_NAME
} from '../../../constants.js'
import {newAccessToken, newRefreshToken, verify} from '../token/factory.js'

/**
 * Temporary scope until real auth2 is implemented.
 */
const scope = {
  res1: ['read', 'write'],
  res2: ['read', 'write']
}

export function setAuthentication(userId: string, res: Response) {
  const accessToken = newAccessToken({
    subject: userId,
    payload: {
      scope
    }
  })

  const refreshToken = newRefreshToken({
    accessToken: accessToken.token,
    payload: {
      scope
    }
  })

  setAuthenticationCookies(res, accessToken.token, refreshToken.token)

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token
  }
}

export function setAuthenticationCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(TOKEN_COOKIE_NAME, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: LOGIN_TOKEN_COOKIE_MAX_AGE * 1000
  })
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: LOGIN_REFRESH_TOKEN_COOKIE_MAX_AGE * 1000
  })
}

export function getAuthentication(req: Request) {
  const accessToken = req.cookies[TOKEN_COOKIE_NAME]
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]

  const {sub} = verify(accessToken)

  if (!sub) {
    throw new Error('No subject found in access token')
  }

  return {
    userId: sub,
    accessToken,
    refreshToken
  }
}

export function generateInternalToken({
  ressourceId,
  accessToken
}: {
  ressourceId: string
  accessToken: string
}) {
  const parts = verify(accessToken)

  let internalScope

  if (Array.isArray(parts.scope)) {
    internalScope = parts.scope
  } else {
    internalScope = parts.scope[ressourceId]
  }

  const {token: limitedAccessToken} = newAccessToken({
    subject: parts.sub,
    payload: {
      scope: internalScope
    }
  })

  return `Bearer ${limitedAccessToken}`
}
