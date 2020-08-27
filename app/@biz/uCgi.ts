import { CgiBin } from 'coa-nuxt'
import { Data, Headers, Params } from 'coa-nuxt/cgi-bin'
import uDie from '~/app/@biz/uDie'
import uAuth from '~/app/@biz/uAuth'

const bin = new class extends CgiBin {
  // 错误弹框提示
  protected toastError (message: string) {
    uDie.hint(message)
  }

  // 用户授权信息过期时，需要重新登入
  protected handle401 () {
    // uPassport.goOAuth()
    uDie.hint('缺少关键信息')
  }

  protected handleHeaders (header: Headers) {

    const { appId, access, acid, wxaid } = uAuth.getAuthInfo()

    header.appId = appId
    header.access = access
    header.acid = acid
    header.wxaid = wxaid
    if (process.env.NODE_ENV !== 'production')
      header.env = process.env.NODE_ENV as string
  }

}

export default new class {

  serviceReasonList = (params?: Params) => bin.get('cgi.biz.service.reason.list', params)

  tradeOrderGet = (params?: Params) => bin.get('cgi.trade.order.get', params)
  tradeOrderGetSimple = (params?: Params) => bin.get('cgi.trade.order.get.simple', params)
  tradeOrderRefundGet = (params?: Params) => bin.get('cgi.trade.order.refund.ua.get', params)
  tradeOrderRefundApply = (data?: Data) => bin.post(`cgi.trade.order.refund.ua.apply`, data, { toastError: false })
  tradeOrderRefundCancel = (data?: Data) => bin.put(`cgi.trade.order.refund.ua.cancel`, data)
  tradeOrderRefundRevise = (data?: Data) => bin.put(`cgi.trade.order.refund.ua.put`, data)
  tradeOrderListMineRefund = (params?: Params) => bin.get('cgi.trade.order.ua.list.mine_refund', params)

  complaintPost = (data?: Data) => bin.post(`cgi.biz.complaint.ua.post`, data)
  complaintGet = (params?: Params) => bin.get('cgi.biz.complaint.ua.get', params)
  complaintCancel = (data?: Data) => bin.put(`cgi.biz.complaint.ua.cancel`, data)
  complaintComplete = (data?: Data) => bin.put(`cgi.biz.complaint.ua.complete`, data)
  complaintList = (params?: Params) => bin.get(`cgi.biz.complaint.ua.list`, params)

  ossToken = (params?: Params) => bin.get(`cgi.about.oss.token`, params)

} as any
