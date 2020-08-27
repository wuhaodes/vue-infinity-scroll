<template>
  <nuxt/>
</template>
<script lang="ts">
import Vue from 'vue'
import uDie from '~/app/@biz/uDie'
import uCached from '~/app/@biz/uCached'
import uCgi from '~/app/@biz/uCgi'

export default Vue.extend({
  layout: 'auth',

  async asyncData ({ query, app }) {
    const orderId = query.orderId as string || ''
    const oldOrderId = uCached.getOrderId() || ''

    if (orderId && orderId !== oldOrderId)
      uCached.setOrderId(orderId)

    orderId || oldOrderId || uDie.error('缺少订单号')

    const check = query.check as string || ''
    if (check != 'complaintId')
      return
    const { body: orderInfo } = await uCgi.tradeOrderGetSimple({ orderId })

    const complaintId = orderInfo.complaintId || ''
    const router = app.router || uDie.error('获取路由对象失败')

    if (!complaintId)
      return router.replace(`/complaint/create`)
    else
      return router.replace(`/complaint/${complaintId}`)
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";
</style>
