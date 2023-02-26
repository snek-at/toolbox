import {Request} from 'express'

import {withAuthorizationHeader} from './withAuthorizationHeader.js'

export async function proxyRequest(
  fetchParams: [RequestInfo, string | undefined],
  req: Request
) {
  const [input, initStr] = fetchParams

  const init = (initStr ? JSON.parse(initStr) : undefined) as
    | RequestInit
    | undefined

  const headers: Headers = new Headers(init?.headers)

  withAuthorizationHeader(req, headers)

  if (!isWhitelisted(input)) {
    throw new Error(`URL is not whitelisted`)
  }

  console.log(init, headers)

  const fetchRes = await fetch(input, {
    ...init,
    headers
  })

  return fetchRes
}

function isWhitelisted(input: RequestInfo | URL) {
  const FETCH_PROXY_WHITELIST = ['https://api.github.com', 'https://photonq.at']

  const url = input.toString()
  if (!FETCH_PROXY_WHITELIST.some(whitelist => url.startsWith(whitelist))) {
    return false
  }

  return true
}
