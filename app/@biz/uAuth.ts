import uDie from '~/app/@biz/uDie'
import { storage } from 'coa-nuxt'
import uCached from '~/app/@biz/uCached'

const APP_ID = 'appId'
const ACCESS = 'access'
const AC_ID = 'acid'
const WXA_ID = 'wxaid'

export default new class {

  setAuthInfo (authInfo: { appId: string, wxaid: string, acid: string, access: string }) {
    const { acid, access, appId, wxaid } = authInfo

    this.setAcid(acid)
    this.setWxaid(wxaid)
    this.setAccess(access)
    this.setAppId(appId)
  }

  getAuthInfo () {
    const acid = storage.local.get(AC_ID)
    const access = storage.local.get(ACCESS)
    const appId = storage.local.get(APP_ID)
    const wxaid = storage.local.get(WXA_ID)

    return { acid, access, appId, wxaid }
  }

  setAppId (appId: string) {
    storage.local.set(APP_ID, appId)
  }

  setAccess (access: string) {
    storage.local.set(ACCESS, access)
  }

  setAcid (acid: string) {
    storage.local.set(AC_ID, acid)
  }

  setWxaid (wxaid: string) {
    storage.local.set(WXA_ID, wxaid)
  }

  checkAndUpdateAuthInfo (query: any) {

    const authInfo = this.getAuthInfo()

    const appId = query.appId as string || ''
    const access = query.access as string || ''
    const acid = query.acid as string || ''
    const wxaid = query.wxaid as string || ''

    if (acid && acid != authInfo.acid)
      this.setAcid(acid)

    if (appId && appId != authInfo.appId)
      this.setAppId(appId)

    if (wxaid && wxaid != authInfo.wxaid)
      this.setWxaid(wxaid)

    if (access && access != authInfo.access)
      this.setAccess(access)

    let message = ''

    authInfo.appId || appId || (message = '缺少appId')
    authInfo.access || access || (message = '缺少access')
    authInfo.acid || acid || (message = '缺少acid')
    authInfo.wxaid || wxaid || (message = '缺少wxaid')

    //缺少关键信息
    if (message)
      uDie.error(message)

  }

  checkAndUpdateOrderId (query: any) {

    const orderId = query.orderId as string || ''
    const oldOrderId = uCached.getOrderId() || ''

    if (orderId && orderId !== oldOrderId)
      uCached.setOrderId(orderId)

    orderId || oldOrderId || uDie.error('缺少订单号')
  }

}