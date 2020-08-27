<template>
  <infinity-scroll class="complaint-list-wrapper" :fetch="fetchComplaintInfo">
    <template #list="{list}">
      <div class="complaint-list">
        <div class="complaint-item normal" v-for="item in list" @click="toDetail(item.complaintId)">
          <div class="platform-process">
            <div class="complaint-platform">
              <span class="label">投诉平台：</span>
              {{ item.account ? item.account.name : '' }}
            </div>
            <div class="complaint-process applied" v-if="item.process==='applied'">已申请</div>
            <div class="complaint-process handled" v-else-if="item.process==='handled'">已处理</div>
            <div class="complaint-process canceled" v-else-if="item.process==='canceled'">已撤诉</div>
            <div class="complaint-process completed" v-else-if="item.process==='completed'">已完成</div>
          </div>
          <div class="complaint-time">
            <span class="label">投诉时间：</span>
            {{ item.applyAt }}
          </div>
          <div class="complaint-reason">
            <span class="label">投诉原因：</span>
            {{ item.reason ? item.reason.text : '' }}
          </div>
          <div class="complaint-detail-btn">
            <span>查看投诉详情</span>
            <i class="iconfont next_icon"></i>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="complaint-list-empty">
        <van-empty description="暂无投诉记录"/>
      </div>
    </template>
  </infinity-scroll>
</template>

<script lang="ts">
import Vue from 'vue'
import uCached from '~/app/@biz/uCached'
import { dayjs } from 'coa-nuxt'
import InfinityScroll from '~/app/components/InfinityScroll.vue'
import uCgi from '~/app/@biz/uCgi'

export default Vue.extend({
  layout: 'auth',

  head: { title: '投诉记录' },

  asyncData ({ query }) {
    const orderId = uCached.getOrderId()
    return { orderId }
  },

  components: {
    InfinityScroll
  },

  data () {
    return { orderId: '' }
  },

  methods: {
    toDetail (complaintId: string) {
      this.$router.push(`/complaint/${complaintId}`)
    },
    async fetchComplaintInfo (pager: Dic<any>) {
      const params = { ...pager, status: 1, orderId: this.orderId }
      const { body: compliantInfo } = await uCgi.complaintList(params)
      compliantInfo.list && compliantInfo.list.forEach((item: Dic<any>) => item.applyAt && (item.applyAt = dayjs(item.applyAt).format('YYYY-MM-DD HH:mm')))
      return compliantInfo
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

@supports (bottom: env(safe-area-inset-bottom)) {
  .complaint-list-wrapper {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.complaint-list-wrapper {
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: @gray-color;

  .complaint-list {
    width: 100%;
    padding: 30/@vw 24/@vw;
    box-sizing: border-box;

    .complaint-item {
      width: 100%;
      box-sizing: border-box;
      flex: none;
      background-color: #ffffff;
      margin-top: 30/@vw;
      padding: 30/@vw;
      border-radius: 6/@vw;

      .platform-process {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 30/@vw;

        .complaint-process {
          padding: 2/@vw 14/@vw;
          line-height: 30/@vw;
          background: rgba(248, 245, 236, 1);
          border-radius: 17/@vw;
          text-align: center;
          font-size: 20/@vw;
          color: #333333;
          flex: none;
          white-space: nowrap;

          &.applied {
            color: #F56C6C;
            background-color: #FEF0F0;
          }

          &.handled {
            color: #5A90FF;
            background-color: #dae4f6;
          }

          &.completed {
            color: #48C429;
            background-color: #EDF5EB;
          }

          &.canceled {
            color: #999999;
            background-color: #F2F2F2;
          }
        }
      }

      .complaint-reason, .complaint-time, .complaint-platform {
        font-size: 28/@vw;
        line-height: 40/@vw;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70vw;

        .label {
          color: #999999;
        }
      }

      .complaint-time {
        max-width: 100%;
        width: 100%;
        padding-top: 30/@vw;
        border-top: 1px solid #EEEEEE;
      }

      .complaint-reason {
        padding: 20/@vw 0 30/@vw;
        max-width: 100%;
        width: 100%;
        border-bottom: 1px solid #EEEEEE;
      }

      .complaint-detail-btn {
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        padding-top: 30/@vw;
        font-size: 24/@vw;
        color: rgba(90, 144, 255, 1);
        line-height: 32/@vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .complaint-list-empty {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    padding-bottom: 100/@vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20/@vw;
    line-height: 32/@vw;
    color: #666666;
    background-color: #ffffff;
  }
}
</style>
