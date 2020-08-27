<template>
  <div class="complaint-detail-wrapper" v-if="complaintInfo">
    <div class="complaint-detail-view">
      <div class="complaint-process">
        <div class="complaint-process-detail">
          <van-icon name="passed" color="#48C429" v-if="complaintInfo.process==='handled'"/>
          <i :class="['iconfont',`${complaintInfo.process}_icon`, complaintInfo.process]" v-else></i>
          <span class="complaint-status" v-if="complaintInfo.process==='canceled'">买家已撤销投诉</span>
          <span class="complaint-status" v-else-if="complaintInfo.process==='applied'">平台已受理，正在处理中</span>
          <span class="complaint-status" v-else-if="complaintInfo.process==='handled'">平台已处理，请确认处理结果</span>
          <span class="complaint-status" v-else-if="complaintInfo.process==='completed'">投诉受理结束</span>
        </div>
        <div class="complaint-detail-tips" v-if="complaintInfo.process==='applied'">
          我们已经收了你的申请，会在24小时内处理，请耐心等待
        </div>
      </div>
      <div class="complaint-result" v-if="complaintInfo.handleMessage">
        <div class="label">处理结果</div>
        <div class="value">{{ complaintInfo.handleMessage }}</div>
      </div>
      <div class="complaint-detail">
        <div class="complaint-detail-item" v-if="complaintInfo.account&&complaintInfo.account.name">
          <div class="complaint-label">投诉对象</div>
          <div class="complaint-val">{{ complaintInfo.account.name }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.orderId">
          <div class="complaint-label">投诉订单</div>
          <div class="complaint-val">{{ complaintInfo.orderId }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.reason&&complaintInfo.reason.text">
          <div class="complaint-label">投诉原因</div>
          <div class="complaint-val">{{ complaintInfo.reason.text }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.applyMessage">
          <div class="complaint-label">投诉描述</div>
          <div class="complaint-val">
            <div class="complaint-message">
              {{ complaintInfo.applyMessage }}
            </div>
            <div class="complaint-images" v-if="complaintInfo.images&&complaintInfo.images.length">
              <img alt="" class="image" @click="previewImage(index)" style="object-fit: contain;" :src="item" v-for="(item,index) in complaintInfo.images">
            </div>
          </div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.orderPrice">
          <div class="complaint-label">订单金额</div>
          <div class="complaint-val">{{ complaintInfo.orderPrice }}元</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.mobile">
          <div class="complaint-label">联系电话</div>
          <div class="complaint-val">{{ complaintInfo.mobile }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.applyAt">
          <div class="complaint-label">投诉时间</div>
          <div class="complaint-val">{{ complaintInfo.applyAt }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.handleAt">
          <div class="complaint-label">处理时间</div>
          <div class="complaint-val">{{ complaintInfo.handleAt }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.completeAt">
          <div class="complaint-label">完成时间</div>
          <div class="complaint-val">{{ complaintInfo.completeAt }}</div>
        </div>
        <div class="complaint-detail-item" v-if="complaintInfo.cancelAt">
          <div class="complaint-label">撤诉时间</div>
          <div class="complaint-val">{{ complaintInfo.cancelAt }}</div>
        </div>
      </div>
      <div class="complaint-next-btn normal" @click="toComplaint">
        <span>全部投诉记录</span>
        <i class="iconfont next_icon"></i>
      </div>
      <div class="complaint-tips">
        <span>如对投诉有任何问题，可拨打平台热线 </span>
        <a href="tel:4008-950-110">4008-950-110</a>
      </div>
    </div>
    <div class="complaint-operate-wrapper">
      <div class="complaint-operate-view" v-if="complaintInfo.process==='applied'">
        <div class="complaint-operate-btn normal" @click="cancelComplaint">撤销投诉</div>
      </div>
      <div class="complaint-operate-view center" v-else-if="complaintInfo.process==='handled'">
        <div class="complaint-satisfied-btn normal" @click="handleSatisfied">
          <i class="iconfont smile_icon"></i>
          <span>满意处理结果</span>
        </div>
        <div class="complaint-dissatisfied-btn normal" @click="handleDissatisfied">
          <i class="iconfont upset_icon"></i>
          <span>不满处理结果</span>
        </div>
      </div>
      <div class="complaint-operate-view" v-else>
        <div class="complaint-operate-btn normal" @click="reComplaint">重新投诉商家</div>
      </div>
    </div>
    <van-action-sheet v-model="showDissatisfiedWay">
      <div class="action-title">
        <div class="title-left">
          <i class="iconfont upset_icon"></i>
          <span>不满处理结果，处理办法如下</span>
        </div>
        <i class="iconfont cancel_icon" @click="()=>this.showDissatisfiedWay=false"></i>
      </div>
      <a class="action-content normal" href="tel:4008-950-110" @click="()=>this.showDissatisfiedWay=false">
        拨打平台客服&nbsp;4008-950-110
      </a>
      <div class="action-content normal" @click="reComplaint">重新提交证据，投诉商家</div>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uDie from '~/app/@biz/uDie'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import { dayjs } from 'coa-nuxt'
import { ImagePreview } from 'vant'
import 'vant/lib/image-preview/style'

async function fetchComplaintInfo (complaintId: string) {
  const { body: complaintInfo = {} } = await uCgi.complaintGet({ complaintId })

  const complaintImages = complaintInfo.images || []

  complaintInfo.images = complaintImages.map((item: string) => uHelper.oss2image(item, 'c6'))

  uHelper.attach(complaintInfo, ['applyAt', 'handleAt', 'completeAt', 'cancelAt'], (ms: number) => ms ? dayjs(ms).format('YYYY-MM-DD HH:ss') : '', '')
  uHelper.attach(complaintInfo, ['orderPrice'], uHelper.cent, '')

  return complaintInfo
}

export default Vue.extend({
  layout: 'auth',

  head: {
    title: '投诉详情'
  },

  async asyncData ({ params }) {
    const complaintId = params.id as string || uDie.error('缺少投诉编号')
    const complaintInfo = await fetchComplaintInfo(complaintId)

    return {
      complaintId,
      complaintInfo
    }
  },

  data () {
    return {
      complaintId: '',
      complaintInfo: '' as any as Dic<any>,
      showDissatisfiedWay: false
    }
  },

  methods: {
    toComplaint () {
      this.$router.push('/complaint')
    },

    async cancelComplaint () {
      const confirmResult = await this.$dialog.confirm({ message: '请确认已不需要对商家进行投诉后，再点击撤销撤诉？', confirmButtonText: '撤销投诉' }).catch(e => console.log(e))
      if (!confirmResult)
        return

      const { body } = await uCgi.complaintCancel({ complaintId: this.complaintId })

      if (!body || !body.complaintId)
        return

      this.$toast.success('撤销投诉成功')

      this.complaintInfo = await fetchComplaintInfo(this.complaintId)
    },

    reComplaint () {
      this.$router.replace('/complaint/create')
    },

    async handleSatisfied () {
      const confirmResult = await this.$dialog.confirm({ message: ' 确认满意处理结果吗？若满意将结束本次投诉受理', confirmButtonText: '满意' }).catch(e => console.log(e))
      if (!confirmResult)
        return

      const { body } = await uCgi.complaintComplete({ complaintId: this.complaintId })

      if (!body || !body.complaintId)
        return

      this.$toast.success('满意处理结果')

      this.complaintInfo = await fetchComplaintInfo(this.complaintId)
    },

    handleDissatisfied () {
      this.showDissatisfiedWay = true
    },
    previewImage (index: number) {
      const complaintInfo = this.complaintInfo || {}
      const images = complaintInfo.images.map((item: string) => uHelper.oss2image(uHelper.revertFromOss(item), 'c15'))
      ImagePreview({
        images,
        startPosition: index
      })
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

@supports (bottom: env(safe-area-inset-bottom)) {
  .complaint-detail-wrapper {
    .complaint-operate-view {
      padding: 0 24/@vw env(safe-area-inset-bottom) !important;
    }
  }
}

.complaint-detail-wrapper {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: @gray-color;

  .complaint-detail-view {
    width: 100%;
    box-sizing: border-box;
    padding: 30/@vw 24/@vw;
    flex: none;

    .complaint-process {
      width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      padding: 30/@vw;
      border-radius: 6/@vw;

      .complaint-process-detail {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .complaint-status {
          font-size: 30/@vw;
          color: rgba(51, 51, 51, 1);
          line-height: 42/@vw;
        }

        i {
          margin-right: 20/@vw;
          font-size: 60/@vw;

          &.applied {
            color: #F3BB45;
          }

          &.completed {
            color: #48C429;
          }

          &.canceled {
            color: #5A90FF;
          }
        }
      }

      .complaint-detail-tips {
        margin-top: 20/@vw;
        font-size: 24/@vw;
        color: rgba(51, 51, 51, 1);
        line-height: 32/@vw;
      }
    }

    .complaint-result {
      width: 100%;
      box-sizing: border-box;
      margin-top: 30/@vw;
      padding: 30/@vw;
      display: flex;
      font-size: 28/@vw;
      color: rgba(51, 51, 51, 1);
      line-height: 40/@vw;
      border-radius: 6/@vw;
      background-color: #ffffff;

      .label {
        min-width: 140/@vw;
        color: rgba(153, 153, 153, 1);
        flex: none;
      }
    }

    .complaint-detail {
      width: 100%;
      box-sizing: border-box;
      padding: 30/@vw;
      margin-top: 30/@vw;
      background-color: #ffffff;
      border-radius: 6/@vw;

      .complaint-detail-item {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        margin-top: 30/@vw;

        .complaint-label {
          flex: none;
          font-size: 28/@vw;
          color: #999999;
          line-height: 40/@vw;
          min-width: 140/@vw;
        }

        .complaint-val {
          font-size: 28/@vw;
          color: #333333;
          line-height: 40/@vw;
          flex: 1;

          .complaint-images {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            box-sizing: border-box;
            padding: 10/@vw 0 30/@vw;
            margin-right: -10/@vw;

            .image {
              width: 150/@vw;
              height: 150/@vw;
              flex: none;
              margin-right: 10/@vw;
              margin-top: 10/@vw;
              border: 1px solid #EEEEEE;
              overflow: hidden;
              border-radius: 6/@vw;
            }
          }
        }

        &:first-child {
          margin-top: 0;
        }
      }
    }

    .complaint-next-btn {
      width: 100%;
      box-sizing: border-box;
      padding: 30/@vw;
      margin-top: 30/@vw;
      background-color: #ffffff;
      border-radius: 6/@vw;
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: 28/@vw;
      color: rgba(51, 51, 51, 1);
      line-height: 40/@vw;

      i {
        font-size: 28/@vw;
        color: #CCCCCC;
        line-height: 40/@vw;
      }
    }

    .complaint-tips {
      margin-top: 20/@vw;
      font-size: 24/@vw;
      color: rgba(102, 102, 102, 1);
      line-height: 32/@vw;

      a {
        color: #5A90FF;

        &:active {
          color: #4d85f8;
        }
      }
    }
  }

  .complaint-operate-wrapper {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .complaint-operate-view {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      justify-content: flex-end;
      padding: 0 24/@vw;

      .complaint-operate-btn {
        margin: 9/@vw 0;
        padding: 0 30/@vw;
        height: 80/@vw;
        line-height: 80/@vw;
        border: 1px solid #5A90FF;
        font-size: 28/@vw;
        color: rgba(90, 144, 255, 1);
        border-radius: 6/@vw;
      }

      &.center {
        justify-content: center;

        .complaint-satisfied-btn {
          border-radius: 6/@vw;
          border: 1px solid #5A90FF;
          padding: 0 42/@vw;
          height: 80/@vw;
          line-height: 80/@vw;
          font-size: 28/@vw;
          color: #5A90FF;
          display: flex;
          align-items: center;
          margin: 9/@vw 30/@vw 9/@vw 0;

          i {
            margin-right: 20/@vw;
          }
        }

        .complaint-dissatisfied-btn {
          border-radius: 6/@vw;
          border: 1px solid #999999;
          padding: 0 42/@vw;
          height: 80/@vw;
          line-height: 80/@vw;
          font-size: 28/@vw;
          color: #999999;
          display: flex;
          align-items: center;
          margin: 9/@vw 0;

          i {
            margin-right: 20/@vw;
          }
        }
      }
    }
  }

  .van-action-sheet__content {
    width: 100%;
    box-sizing: border-box;

    .action-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 40/@vw 24/@vw;
      box-sizing: border-box;
      font-size: 28/@vw;
      color: rgba(51, 51, 51, 1);

      .title-left {
        display: flex;
        align-items: center;

        i.upset_icon {
          font-size: 36/@vw;
          color: #CCCCCC;
          margin-right: 20/@vw;
        }
      }

      i.cancel_icon {
        font-size: 44/@vw;
        color: #666666;
      }
    }

    .action-content {
      padding: 40/@vw 24/@vw;
      border-top: 1px solid #faf9f9;
      width: 100%;
      display: block;
      box-sizing: border-box;
      text-decoration: none;
      font-size: 28/@vw;
      color: rgba(51, 51, 51, 1);
      line-height: 40/@vw;
    }
  }
}
</style>
