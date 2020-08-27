<template>
  <div></div>
</template>
<script lang="ts">
import Vue from 'vue'
import uAuth from '~/app/@biz/uAuth'
import uDie from '~/app/@biz/uDie'

export default Vue.extend({
  async asyncData ({ query, app }) {
    uAuth.checkAndUpdateAuthInfo(query)
    const to = query.to as string || uDie.error('缺少跳转目的地')
    const router = app.router || uDie.error('获取路由对象失败')

    // 跳转到 订单退款列表页
    if (to === 'order-refund')
      router.replace('/order/refund')
    // 跳转到 订单退款申请页
    else if (to === 'order-refund-apply') {
      const orderId = query.orderId as string || ''
      router.replace(`/order/refund/create?orderId=${orderId}`)
    } else if (to === 'order-refund-get') {
      const orderId = query.orderId as string || ''
      const orderRefundId = query.orderRefundId as string || ''
      router.replace(`/order/refund/${orderRefundId}?orderId=${orderId}`)
    }
    /// 跳转到订单列表页
    else if (to === 'complaint') {
      const check = query.check as string || ''
      const orderId = query.orderId as string || ''
      router.replace(`/complaint?orderId=${orderId}&check=${check}`)
    }
    // 跳转到 订单投诉申请页
    else if (to === 'complaint-post') {
      const orderId = query.orderId as string || ''
      router.replace(`/complaint/create?orderId=${orderId}`)
    }
    // 跳转到 订单投诉详情页
    else if (to === 'complaint-get') {
      const orderId = query.orderId as string || ''
      const complaintId = query.complaintId as string || ''
      router.replace(`/complaint/${complaintId}?orderId=${orderId}`)
    }

    return {
      query
    }
  },
  data () {
    return {
      query: {} as Dic<string>
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";
</style>
