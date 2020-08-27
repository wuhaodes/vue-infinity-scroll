<template>
  <infinity-scroll class="order-refund-wrapper" :fetch="fetchRefundInfo">
    <template #list="{list}">
      <div class="order-list-wrapper">
        <div class="order-item normal" v-for="item in list" :key="item.orderId" @click="handleOrderRefundTap(item.orderRefundId)">
          <div class="status-pay">
            <div class="status-label">
              <i class="iconfont service_icon"></i>
              <span class="status-label-val">仅退款</span>
            </div>
            <div class="pay-wrapper">
              <span>退款金额：</span>
              <span class="pay-val">￥{{ item.realPriceShow }}</span>
            </div>
          </div>
          <div class="sku-detail" v-for="v in item.skuStores" :key="v.skuStoreId">
            <div class="sku-content">
              <img alt="" class="sku-cover" :src="v.sku.cover || v.spu.cover" style="object-fit: cover;"/>
              <div class="sku-right">
                <div class="sku-name">
                  {{ v.spu.name }}
                </div>
                <div class="sku-result">
                  {{ v.sku.name }}
                </div>
              </div>
            </div>
            <div class="price-count">
              <div class="sku-price">￥{{ v.sku.priceShow }}</div>
              <div class="sku-count">x{{ v.count }}</div>
            </div>
          </div>
          <div :class="['order-refund-process',item.orderRefund.process]" v-if="item.orderRefund">
            <span v-if="item.orderRefund.process === 'applied'">
              商家审核中
            </span>
            <span v-else-if="item.orderRefund.process === 'approved'">
              商家同意退款
            </span>
            <span v-else-if="item.orderRefund.process === 'completed'">
              退款成功¥{{ item.realPriceShow }}元
            </span>
            <span v-else-if="item.orderRefund.process === 'rejected'">
              退款失败
            </span>
            <span v-else-if="item.orderRefund.process === 'canceled'">
              买家已撤销
            </span>
          </div>
          <div class="operate-wrapper">
            <div class="operate-btn normal" @click="handleOrderRefundTap(item.orderRefundId)">查看详情</div>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="no-order-refund">
        <img alt="" src="~/app/assets/images/order_service_empty.png" class="no-order-refund-default" style="object-fit: cover;"/>
        <div class="no-order-refund-title">暂无退款/售后</div>
        <div class="no-order-refund-title">您对购买商品很满意</div>
      </div>
    </template>
  </infinity-scroll>
</template>

<script lang="ts">
import Vue from 'vue'
import InfinityScroll from '~/app/components/InfinityScroll.vue'
import uHelper from '~/app/@biz/uHelper'
import uCgi from '~/app/@biz/uCgi'

export default Vue.extend({
  layout: 'auth',

  components: {
    InfinityScroll
  },

  head: { title: '退款' },

  methods: {
    async fetchRefundInfo (pager: Dic<any>) {
      const params = { ...pager }
      const { body: refundInfo } = await uCgi.tradeOrderListMineRefund(params)
      refundInfo.list && refundInfo.list.forEach((item: Dic<any>) => {
        uHelper.attach(item, ['skuPrice', 'realPrice', 'totalPrice'], uHelper.cent, 'show')
        item.skuStores && item.skuStores.forEach((v: Dic<any>) => {
          v.spu && (v.spu.cover = uHelper.oss2image(v.spu.cover, 'c8'))
          const sku = v.sku || {}
          sku.cover = uHelper.oss2image(sku.cover, 'c8')
          sku.priceShow = uHelper.cent(sku.price)
        })
      })
      return refundInfo
    },
    handleOrderRefundTap (orderRefundId: string) {
      this.$router.push(`/order/refund/${orderRefundId}`)
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

.order-refund-wrapper {
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: @gray-color;

  .no-order-refund {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    padding-bottom: 100/@vw;

    .no-order-refund-title {
      margin-top: 30/@vw;
      font-size: 28/@vw;
      color: rgba(153, 153, 153, 1);
      line-height: 40/@vw;
      &:last-child{
        margin-top: 0;
      }
    }

    .no-order-refund-default {
      width: 478/@vw;
      height: 230/@vw;
    }
  }

  .order-list-wrapper {
    width: 100%;
    background-color: #f8f8f8;
    padding: 30/@vw 24/@vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .order-item {
      background: rgba(255, 255, 255, 1);
      border-radius: 6/@vw;
      margin-top: 30/@vw;
      padding: 0 30/@vw;

      .status-pay {
        padding: 30/@vw 0;
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: relative;

        .status-label {
          display: flex;
          align-items: center;

          .status-label-val {
            font-size: 28/@vw;
            color: #333333;
            line-height: 40/@vw;
          }

          .service_icon {
            font-size: 56/@vw;
            color: #F84F51;
            margin-right: 10/@vw;
          }
        }

        .pay-wrapper {
          text-align: right;
          font-size: 28/@vw;
          color: rgba(51, 51, 51, 1);
          line-height: 40/@vw;
          max-width: 300/@vw;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .pay-val {
          color: #f84f51;
        }

        &:after {
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          background-color: #eee;
          content: " ";
          display: block;
          transform: scaleY(0.5);
          transform-origin: left center;
        }

      }

      .sku-detail {
        width: 100%;
        box-sizing: border-box;
        padding: 30/@vw 0;
        display: flex;
        position: relative;

        .sku-content {
          display: flex;
          flex: 1;

          .sku-cover {
            width: 150/@vw;
            height: 150/@vw;
            background: rgba(216, 216, 216, 1);
            border-radius: 4/@vw;
            flex: none;
            margin-right: 20/@vw;
          }

          .sku-right {
            flex: 1;

            .sku-name {
              font-size: 28/@vw;
              color: rgba(51, 51, 51, 1);
              line-height: 40/@vw;
              max-height: 80/@vw;
              text-align: left;
              max-width: 50vw;
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
          }

        }

        .price-count {
          box-sizing: border-box;
          flex: none;

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

        &:last-child:after {
          display: none;
        }
      }

      .operate-wrapper {
        width: 100%;
        box-sizing: border-box;
        padding: 30/@vw 0;
        display: flex;
        justify-content: flex-end;
        position: relative;

        .operate-btn {
          width: 150/@vw;
          height: 50/@vw;
          border-radius: 26/@vw;
          border: 1px solid #5A90FF;
          text-align: center;
          font-size: 28/@vw;
          color: #5A90FF;
          line-height: 50/@vw;
        }
      }

      .order-refund-process {
        font-size: 24/@vw;
        color: #333333;
        line-height: 32/@vw;
        box-sizing: border-box;
        padding: 10/@vw;
        background: rgba(248, 248, 248, 1);
        border-radius: 4/@vw;

        &.completed {
          color: #48C429;
        }

        &.rejected {
          color: #F84F51;
        }

        &.approved {
          color: #F3BB45;
        }

        &.canceled {
          color: #999999;
        }
      }

      &:first-child {
        margin-top: 0;
      }
    }

  }
}
</style>
