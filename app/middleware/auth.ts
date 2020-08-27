import { Context } from '@nuxt/types'
import uAuth from '~/app/@biz/uAuth'

export default async function ({ query }: Context) {
  uAuth.checkAndUpdateAuthInfo(query)
}