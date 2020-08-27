<template>
  <div :class="['infinity-scroll',isLoading?'loading':'']" :data-distance="distance" :data-delay="delay" v-infinity:scroll="reachBottom" v-if="cInfo.list">
    <slot name="list" :list="cInfo.list" v-if="cInfo.list.length"></slot>
    <slot name="empty" v-else></slot>
    <van-loading size="24px" v-if="isLoading">加载中...</van-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    fetch: {
      type: Function,
      required: true
    },
    delay: {
      type: Number,
      required: false,
      default: 200
    },
    distance: {
      type: Number,
      required: false,
      default: 0
    }
  },
  async created () {
    await this.fetchData()
  },
  data () {
    return {
      cInfo: { list: '' as any as any[], params: {} as Dic<any> },
      isLoading: false
    }
  },
  methods: {
    async reachBottom () {
      const cInfo = this.cInfo || {}
      const params = cInfo.params

      if (params.more === false || params.page >= params.pageMax)
        return

      if (params.page !== undefined)
        params.page += 1

      this.isLoading = true
      await this.fetchData()

      this.isLoading = false
    },
    async fetchData () {
      const info = this.cInfo || {}
      const list = info.list || []
      const params = info.params

      const { last: pageLast, page: pagerPage } = params

      // 组装分页参数
      let fetchPager = {} as Dic<any>

      // 老模式
      if (pageLast !== undefined)
        fetchPager.last = pageLast

      // 新模式
      if (pagerPage !== undefined)
        fetchPager.page = pagerPage

      const moreInfo = await this.fetch(fetchPager)

      const newList = moreInfo.list || moreInfo
      list.push(...newList)

      const { page = {}, pager = {} } = moreInfo


      // 老模式
      if (page.more !== undefined)
        params.more = page.more
      if (page.last !== undefined)
        params.last = page.last

      // 新模式
      if (pager.pageMax !== undefined)
        params.pageMax = pager.pageMax
      if (pager.page !== undefined)
        params.page = pager.page

      info.list = list
      info.params = params
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

.infinity-scroll {

  &.loading {
    & > div:nth-of-type(1) {
      padding-bottom: 0 !important;
    }

    .van-loading {
      text-align: center;
      padding: 30/@vw;
    }
  }

}
</style>