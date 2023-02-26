import {Request} from 'express'

export function withAuthorizationHeader(req: Request, headers: Headers) {
  const value = req.headers.authorization

  if (value) {
    headers.set('Authorization', value)
  }
}
