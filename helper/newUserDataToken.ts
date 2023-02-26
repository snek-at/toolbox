import {userGet} from '@snek-functions/iam'

export const newUserDataToken = async (userId: string) => {
  const data = await userGet({userId})

  return JSON.stringify(data)
}
