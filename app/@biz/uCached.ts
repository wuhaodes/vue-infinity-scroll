import uAuth from '~/app/@biz/uAuth'
import { storage } from 'coa-nuxt'

const ORDER_ID = 'orderId'

export default new class {
  setOrderId (orderId: string) {
    const cacheId = this.getCacheId(ORDER_ID)
    storage.session.set(cacheId, orderId)
  }

  getOrderId () {
    const cacheId = this.getCacheId(ORDER_ID)
    return storage.session.get(cacheId)
  }

  private getCacheId (key: string) {
    const { appId, acid } = uAuth.getAuthInfo()
    return `${acid}:${appId}:${key}`
  }
}