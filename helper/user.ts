import type {Request, Response} from 'express'

import {
  COOKIE_OPTIONS,
  LOGIN_TOKEN_COOKIE_MAX_AGE,
  USER_DATA_TOKEN_NAME
} from '../constants.js'

export function setUserCookie(req: Request, res: Response, userDataToken: any) {
  res.cookie(USER_DATA_TOKEN_NAME, userDataToken, {
    ...COOKIE_OPTIONS,
    // domain: new URL(req.headers.origin).hostname,
    maxAge: LOGIN_TOKEN_COOKIE_MAX_AGE * 1000,
    httpOnly: false
  })
}
