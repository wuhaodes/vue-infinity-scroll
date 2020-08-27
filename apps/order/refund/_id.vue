<template>
  <div class="order-refund-detail-wrapper">
    <div class="order-refund-detail-view">
      <div class="order-refund-process">
        <div class="order-refund-process-detail">
          <van-icon name="clock-o" color="#333333" v-if="orderRefundInfo.process === 'applied'"/>
          <van-icon name="clock-o" color="#333333" v-else-if="orderRefundInfo.process === 'approved'"/>
          <van-icon name="passed" color="#333333" v-else-if="orderRefundInfo.process === 'completed'"/>
          <i class="iconfont order_refund_cancel" v-else-if="orderRefundInfo.process === 'canceled'"></i>
          <van-icon name="close" color="#333333" v-else-if="orderRefundInfo.process === 'rejected'"/>
          <div class="order-refund-status" v-if="orderRefundInfo.process === 'applied'">
            <div class="val">商家审核中</div>
            <div class="tips">如商家长期未退款，可申请平台介入</div>
          </div>
          <div class="order-refund-status" v-if="orderRefundInfo.process === 'approved'">
            <div class="val">商家已同意退款，订单退款中</div>
            <div class="tips" v-if="orderRefundInfo.approveAt">{{ orderRefundInfo.approveAt }}</div>
          </div>
          <div class="order-refund-status" v-if="orderRefundInfo.process === 'completed'">
            <div class="val">退款成功</div>
            <div class="tips" v-if="orderRefundInfo.completeAt">{{ orderRefundInfo.completeAt }}</div>
          </div>
          <div class="order-refund-status" v-if="orderRefundInfo.process === 'canceled'">
            <div class="val">买家已撤销申请</div>
            <div class="tips" v-if="orderRefundInfo.cancelAt">{{ orderRefundInfo.cancelAt }}</div>
          </div>
          <div class="order-refund-status" v-if="orderRefundInfo.process === 'rejected'">
            <div class="val">商家拒绝退款</div>
            <div class="tips" v-if="orderRefundInfo.rejectAt">{{ orderRefundInfo.rejectAt }}</div>
          </div>
        </div>
      </div>
      <div class="order-refund-result" v-if="orderRefundInfo.process === 'rejected'&&orderRefundInfo.rejectMessage">
        <div class="label">商家拒绝原因</div>
        <div class="val">{{ orderRefundInfo.rejectMessage }}</div>
      </div>
      <div class="order-refund-price" v-if="orderRefundInfo.order&&orderRefundInfo.order.realPrice">
        <div class="label">退款金额</div>
        <div class="val">¥{{ orderRefundInfo.order.realPrice }}</div>
      </div>
      <div class="order-refund-detail">
        <div class="order-refund-detail-title">
          退款信息
        </div>
        <div class="order-info-wrapper" v-if="orderRefundInfo.order&&orderRefundInfo.order.skuStores">
          <div class="order-info" v-if="orderRefundInfo.order.skuStores.length>1">
            <div class="order-spu-item-wrapper" v-for="item in orderRefundInfo.order.skuStores" :key="item.skuStoreId">
              <div class="order-spu-item">
                <img alt="" :src="item.sku.cover" v-if="item.sku.cover"/>
                <div class="spu-price">¥{{ item.sku.price }}</div>
              </div>
            </div>
          </div>
          <template v-else>
            <div class="order-sku-detail" v-for="item in orderRefundInfo.order.skuStores" :key="item.skuStoreId">
              <div class="sku-content">
                <img alt="" class="sku-cover" :src="item.sku.cover" style="object-fit: cover;"/>
                <div class="sku-right">
                  <div class="sku-name">
                    {{ item.spu.name }}
                  </div>
                  <div class="sku-result">
                    {{ item.sku.name }}
                  </div>
                </div>
              </div>
              <div class="price-count">
                <div class="sku-price">￥{{ item.sku.price }}</div>
                <div class="sku-count">x{{ item.count }}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.orderRefundId">
          <div class="order-refund-label">退款编号</div>
          <div class="order-refund-val">{{ orderRefundInfo.orderRefundId }}</div>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.reason&&orderRefundInfo.orderRefund.reason.text">
          <div class="order-refund-label">退款原因</div>
          <div class="order-refund-val">{{ orderRefundInfo.reason.text }}</div>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.applyMessage">
          <div class="order-refund-label">退款说明</div>
          <div class="order-refund-val">
            <div class="order-refund-message">
              {{ orderRefundInfo.applyMessage }}
            </div>
            <div class="order-refund-images" v-if="orderRefundInfo.applyImages&&orderRefundInfo.applyImages.length">
              <img alt="" class="image" @click="previewImage(index)" style="object-fit: contain;" :src="item" v-for="(item,index) in orderRefundInfo.applyImages">
            </div>
          </div>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.orderPrice">
          <div class="order-refund-label">订单金额</div>
          <div class="order-refund-val">{{ orderRefundInfo.orderPrice }}元</div>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.mobile">
          <div class="order-refund-label">联系电话</div>
          <div class="order-refund-val">{{ orderRefundInfo.mobile }}</div>
        </div>
        <div class="order-refund-detail-item" v-if="orderRefundInfo.applyAt">
          <div class="order-refund-label">申请时间</div>
          <div class="order-refund-val">{{ orderRefundInfo.applyAt }}</div>
        </div>
      </div>
    </div>
    <div class="order-refund-operate-wrapper">
      <div class="order-refund-operate-view">
        <div class="order-refund-operate-btn normal" @click="()=>this.showDissatisfiedWay=true" v-if="orderRefundInfo.process === 'applied'||orderRefundInfo.process === 'rejected'">申请平台介入</div>
        <div class="order-refund-operate-btn normal" @click="reviseRefund(orderRefundInfo.orderRefundId)" v-if="orderRefundInfo.process === 'applied'">修改申请</div>
        <div class="order-refund-operate-btn normal" @click="cancelRefund(orderRefundInfo.orderId,orderRefundInfo.orderRefundId)" v-if="orderRefundInfo.process === 'applied'">撤销申请</div>
        <div class="order-refund-operate-btn normal" @click="reRefund(orderRefundInfo.orderId)" v-if="orderRefundInfo.process === 'rejected'||orderRefundInfo.process === 'canceled'">重新申请</div>
      </div>
    </div>
    <van-action-sheet v-model="showDissatisfiedWay">
      <div class="action-title">
        <div class="title-left">
          申请平台介入方法如下
        </div>
        <i class="iconfont cancel_icon" @click="()=>this.showDissatisfiedWay=false"></i>
      </div>
      <a class="action-content normal" href="tel:4008-950-110" @click="()=>this.showDissatisfiedWay=false">
        拨打平台客服&nbsp;4008-950-110
      </a>
      <div class="action-content normal" @click="toComplaint(orderRefundInfo.orderId)">投诉商家</div>
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

async function fetchOrderRefundInfo (orderRefundId: string) {
  const { body: orderRefundInfo = {} } = await uCgi.tradeOrderRefundGet({ orderRefundId })

  const complaintImages = orderRefundInfo.applyImages || []
  orderRefundInfo.applyImages = complaintImages.map((item: string) => uHelper.oss2image(item, 'c6'))

  const order = orderRefundInfo.order || {}

  order.skuStores && order.skuStores.forEach((item: Dic<any>) => {
    const sku = item.sku || {}
    const spu = item.spu || {}
    sku.cover = uHelper.oss2image(sku.cover || spu.cover || '', 'c8')
    sku.price = uHelper.cent(sku.price)
    item.sku = sku
  })

  uHelper.attach(orderRefundInfo, ['applyAt', 'handleAt', 'completeAt', 'cancelAt', 'approveAt', 'rejectAt'], (ms: number) => ms ? dayjs(ms).format('YYYY-MM-DD HH:ss') : '', '')
  uHelper.attach(order, ['realPrice', 'totalPrice', 'skuPrice'], uHelper.cent, '')

  return orderRefundInfo
}

export default Vue.extend({
  layout: 'auth',

  head: { title: '退款信息详情' },

  async asyncData ({ params }) {
    const orderRefundId = params.id as string || uDie.hint('缺少订单退款编号')
    const orderRefundInfo = await fetchOrderRefundInfo(orderRefundId)
    return {
      orderRefundId,
      orderRefundInfo
    }
  },

  data () {
    return {
      orderRefundId: '',
      orderRefundInfo: '' as any as Dic<any>,
      showDissatisfiedWay: false
    }
  },
  methods: {
    // 重新申请
    reRefund (orderId: string) {
      this.$router.replace(`/order/refund/create?orderId=${orderId}`)
    },
    // 修改申请
    reviseRefund (orderRefundId: string) {
      this.$router.push(`/order/refund/revise?orderRefundId=${orderRefundId}`)
    },
    // 撤销申请
    async cancelRefund (orderId: string, orderRefundId: string) {
      const { body: cancelResult, message = '' } = await uCgi.tradeOrderRefundCancel({ orderId, orderRefundId })

      if (message && !cancelResult)
        return this.$toast.fail(message || '撤销退款申请提交失败')

      await this.$toast.success('撤销退款申请提交成功')
      this.orderRefundInfo = await fetchOrderRefundInfo(orderRefundId)
    },
    previewImage (index: number) {
      const orderRefundInfo = this.orderRefundInfo || {}
      const images = orderRefundInfo.applyImages.map((item: string) => uHelper.oss2image(uHelper.revertFromOss(item), 'c15'))

      ImagePreview({
        images,
        startPosition: index
      })
    },
    // 投诉商家
    toComplaint () {
      const orderRefundInfo = this.orderRefundInfo || {}
      const orderId = orderRefundInfo.orderId || ''
      this.$router.push(`/complaint?orderId=${orderId}&check=complaintId`)
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

@supports (bottom: env(safe-area-inset-bottom)) {
  .order-refund-detail-wrapper {
    .order-refund-operate-view {
      padding: 0 24/@vw env(safe-area-inset-bottom) !important;
    }
  }
}

.order-refund-detail-wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
  background-color: #F8F8F8;

  .order-refund-detail-view {
    width: 100%;
    box-sizing: border-box;
    padding: 30/@vw 24/@vw;
    flex: none;

    .order-refund-process {
      width: 100%;
      box-sizing: border-box;

      .order-refund-process-detail {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        i {
          font-size: 60/@vw;
          margin-right: 20/@vw;
        }

        .order-refund-status {
          width: 100%;
          box-sizing: border-box;

          .val {
            font-size: 30/@vw;
            color: rgba(51, 51, 51, 1);
            line-height: 42/@vw;
          }

          .tips {
            margin-top: 10/@vw;
            font-size: 24/@vw;
            color: rgba(51, 51, 51, 1);
            line-height: 32/@vw;
          }
        }
      }

      .order-refund-detail-tips {
        margin-top: 20/@vw;
        font-size: 24/@vw;
        color: rgba(51, 51, 51, 1);
        line-height: 32/@vw;
      }
    }

    .order-refund-result {
      width: 100%;
      box-sizing: border-box;
      margin-top: 30/@vw;
      padding: 30/@vw;
      border-radius: 6/@vw;
      background-color: #ffffff;

      .label {
        min-width: 140/@vw;
        font-size: 32/@vw;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 44/@vw;
      }

      .val {
        margin-top: 20/@vw;
        font-size: 28/@vw;
        color: rgba(51, 51, 51, 1);
        line-height: 44/@vw;
      }
    }

    .order-refund-price {
      margin-top: 30/@vw;
      font-size: 32/@vw;
      line-height: 44/@vw;
      color: rgba(51, 51, 51, 1);
      width: 100%;
      background-color: #ffffff;
      padding: 30/@vw;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .label {
        min-width: 140/@vw;
        flex: none;
      }

      .val {
        color: rgba(248, 79, 81, 1);
      }
    }

    .order-refund-detail {
      width: 100%;
      box-sizing: border-box;
      padding: 30/@vw;
      margin-top: 30/@vw;
      background-color: #ffffff;
      border-radius: 6/@vw;

      .order-refund-detail-title {
        font-size: 32/@vw;
        color: #333333;
        line-height: 44/@vw;
      }

      .order-info-wrapper {
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 6/@vw;

        .order-info {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          overflow-x: scroll;
          padding: 30/@vw 0;

          .order-spu-item-wrapper {
            padding: 0 10/@vw;

            .order-spu-item {
              width: 146/@vw;
              height: 146/@vw;
              box-sizing: border-box;
              background-color: @gray-color;
              position: relative;
              border-radius: 4/@vw;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4/@vw;
                overflow: hidden;
              }

              .spu-price {
                position: absolute;
                width: 100%;
                box-sizing: border-box;
                left: 0;
                bottom: 0;
                padding: 0 10/@vw;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 50/@vw;
                background: rgba(51, 51, 51, 0.49);
                border-radius: 0 0 4/@vw 4/@vw;
                text-align: center;
                line-height: 50/@vw;
                font-size: 24/@vw;
                color: rgba(255, 255, 255, 1);
              }
            }
          }

          &::-webkit-scrollbar {
            display: none;
          }
        }

        .order-sku-detail {
          margin-top: 30/@vw;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-content: center;

          .sku-cover {
            width: 150/@vw;
            height: 150/@vw;
            background: rgba(216, 216, 216, 1);
            border-radius: 4/@vw;
            flex: none;
            margin-right: 20/@vw;
          }

          .sku-content {
            display: flex;
            flex: 1;
          }

          .sku-right {
            overflow: hidden;
            flex: 1;
          }

          .sku-name {
            font-size: 28/@vw;
            color: rgba(51, 51, 51, 1);
            line-height: 40/@vw;
            max-height: 80/@vw;
            text-align: left;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .sku-result {
            margin-top: 20/@vw;
            background: rgba(248, 248, 248, 1);
            border-radius: 4/@vw;
            padding: 8/@vw 12/@vw;
            display: inline-flex;
            font-size: 24/@vw;
            color: rgba(153, 153, 153, 1);
            line-height: 32/@vw;
            justify-content: center;
          }

          .price-count {
            box-sizing: border-box;
          }

          .sku-price {
            font-size: 28/@vw;
            color: rgba(51, 51, 51, 1);
            line-height: 40/@vw;
            white-space: nowrap;
            overflow: hidden;
            text-align: right;
            width: 100%;
            box-sizing: border-box;
            text-overflow: ellipsis;
          }

          .sku-count {
            font-size: 28/@vw;
            color: rgba(204, 204, 204, 1);
            line-height: 40/@vw;
            width: 100%;
            text-align: right;
          }
        }
      }

      .order-refund-detail-item {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        margin-top: 30/@vw;

        .order-refund-label {
          flex: none;
          font-size: 28/@vw;
          color: #999999;
          line-height: 40/@vw;
          min-width: 140/@vw;
        }

        .order-refund-val {
          font-size: 28/@vw;
          color: #333333;
          line-height: 40/@vw;
          flex: 1;

          .order-refund-images {
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

    .order-refund-next-btn {
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

    .order-refund-tips {
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

  .order-refund-operate-wrapper {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .order-refund-operate-view {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      justify-content: flex-end;
      padding: 0 24/@vw;

      .order-refund-operate-btn {
        margin: 9/@vw 20/@vw 9/@vw 0;
        padding: 0 30/@vw;
        height: 50/@vw;
        line-height: 50/@vw;
        border: 1px solid #333333;
        font-size: 24/@vw;
        color: #333333;
        border-radius: 26/@vw;
        white-space: nowrap;
      }

      &.center {
        justify-content: center;

        .order-refund-satisfied-btn {
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

        .order-refund-dissatisfied-btn {
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

      & > .order-refund-operate-btn:last-of-type {
        margin-right: 0;
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
        font-size: 28/@vw;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 40/@vw;
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
      text-align: center;
    }
  }
}
</style>
