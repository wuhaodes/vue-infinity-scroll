<template>
  <div class="complaint-create-wrapper">
    <div class="order-info-wrapper" v-if="orderInfo&&orderInfo.skuStores">
      <div class="order-info" v-if="orderInfo.skuStores.length>1">
        <div class="order-spu-item-wrapper" v-for="item in orderInfo.skuStores" :key="item.skuStoreId">
          <div class="order-spu-item">
            <img alt="" :src="item.sku.cover" v-if="item.sku.cover"/>
            <div class="spu-price">¥{{ item.sku.price }}</div>
          </div>
        </div>
      </div>
      <template v-else>
        <div class="order-sku-detail" v-for="item in orderInfo.skuStores" :key="item.skuStoreId">
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
    <div class="order-reason">
      <div class="reason-label item-required">投诉原因</div>
      <div class="reason-select" @click="()=>this.showSelectReason = !showSelectReason">
        <div v-if="reason" class="reason">{{ reason }}</div>
        <div v-else>请选择</div>
        <i class="iconfont next_icon"></i>
      </div>
    </div>
    <div class="apply-message-wrapper">
      <van-field
        v-model="applyMessage"
        rows="3"
        label-class="apply-label"
        :required="true"
        maxlength="200"
        autosize
        label="投诉描述："
        type="textarea"
        placeholder="请具体描述情况，以便我们快速核实处理"
      />
      <div class="apply-message-tips" v-if="applyMessage.length>=200">描述最多可输入200字</div>
      <div class="apply-message-tips" v-else>你还可以输入{{ 200 - applyMessage.length }}字</div>
      <van-uploader multiple :upload-text="`上传图片${base64Images.length?`(${base64Images.length}/6)`:'(最多6张)'}`" v-model="base64Images" :after-read="afterRead" :before-delete="beforeDelete" :max-count="6"/>
    </div>
    <div class="mobile-wrapper">
      <van-field
        v-model="mobile"
        label-class="mobile-label"
        :required="true"
        maxlength="11"
        label="联系电话："
        type="tel"
        placeholder="请输入您的电话，以便与你核实原因"
      />
    </div>
    <div class="complaint-tips">
      <div class="complaint-tips-title">提交投诉后会如何</div>
      <div class="complaint-tips-detail">
        <span>我们将审核您提交的投诉，并开展进一步的调查后与您跟进。如有需要，我们会与您联系了解更多信息。如对投诉有任何问题，可拨打平台热线</span>
        <a class="complaint-contact" href="tel:4008-950-110">4008-950-110</a>
      </div>
    </div>
    <div class="complaint-submit normal" :data-disabled="!mobile||!applyMessage||!reasonId" @click="createPlaint">提交</div>
    <van-action-sheet
      v-model="showSelectReason"
      title="投诉原因"
      :actions="reasonList"
      cancel-text="取消"
      close-on-click-action
      @cancel="onReasonCancel"
      @select="onReasonSelect"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uCgi from '~/app/@biz/uCgi'
import uCached from '~/app/@biz/uCached'
import uHelper from '~/app/@biz/uHelper'
import uDie from '~/app/@biz/uDie'
import uOss from '~/app/@biz/uOss'

export default Vue.extend({
  layout: 'auth',

  head: {
    title: '交易投诉'
  },

  async asyncData () {
    const orderId = uCached.getOrderId()
    const { body: orderInfo = {} } = await uCgi.tradeOrderGet({ orderId })
    const { body: uploadSign } = await uCgi.ossToken({ path: 'complaint' }).catch((e: any) => {
      this.$toast.fail(e || e.message || e.toString())
      return { body: undefined }
    })

    orderInfo.skuStores && orderInfo.skuStores.forEach((item: Dic<any>) => {
      const sku = item.sku || {}
      const spu = item.spu || {}
      sku.cover = uHelper.oss2image(sku.cover || spu.cover || '', 'c8')
      sku.price = uHelper.cent(sku.price)
      item.sku = sku
    })

    const { body: reasonList = [] } = await uCgi.serviceReasonList({ serviceType: 'order-complaint', orderType: orderInfo.orderType })

    if (!reasonList || !Array.isArray(reasonList) || !reasonList.length)
      return uDie.hint('获取投诉服务缘由失败')
    reasonList.forEach(item => item.name = item.text)

    return {
      orderInfo,
      reasonList,
      uploadSign
    }
  },

  data () {
    return {
      orderInfo: {} as Dic<any>,
      uploadSign: {} as Dic<any>,
      reason: '',
      reasonId: '',
      reasonList: '' as any as Dic<any>[],
      showSelectReason: false,
      applyMessage: '',
      mobile: '',
      images: [] as any[],
      base64Images: [] as any[]
    }
  },

  methods: {
    onReasonCancel () {
      console.log('cancel')
    },

    onReasonSelect ({ reasonId, text, name }: Dic<any>) {
      this.reasonId = reasonId
      this.reason = text || name
    },

    async afterRead (files: any) {
      const uploadSign = this.uploadSign || {}
      if (Array.isArray(files)) {
        for (const file of files) {
          const srcPath = await uOss.uploadImage(file, this.images.length, uploadSign)
          this.images.push(srcPath)
        }
      } else {
        const srcPath = await uOss.uploadImage(files, this.images.length, uploadSign)
        this.images.push(srcPath)
      }
    },

    beforeDelete (item: any, { name, index }: Dic<any>) {
      this.images.splice(index, 1)
      return true
    },

    async createPlaint () {

      const mobile = this.mobile

      if (!/^[1][0-9]{10}$/.test(mobile))
        return this.$toast.fail('手机号格式不正确')

      const confirmResult = await this.$dialog.confirm({ message: '确认提交本次投诉吗？' }).catch(e => console.log(e))

      if (!confirmResult)
        return

      const orderId = uCached.getOrderId() || ''
      const applyMessage = this.applyMessage
      const images = this.images
      const reasonId = this.reasonId
      const type = 'order'

      const { body: postResult = {} } = await uCgi.complaintPost({ orderId, reasonId, mobile, applyMessage, type, images })

      const complaintId = postResult.complaintId || ''

      if (!complaintId)
        return this.$toast.fail('投诉提交失败')

      await this.$toast.success('投诉提交成功')
      this.$router.replace(`/complaint/${complaintId}`)
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

@supports (bottom: env(safe-area-inset-bottom)) {
  .complaint-create-wrapper {
    padding-bottom: calc(24vw / 7.5 + env(safe-area-inset-bottom));
  }
}

.complaint-create-wrapper {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30/@vw 24/@vw;
  background-color: @gray-color;

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
      padding: 30/@vw 20/@vw;

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

        &:last-child {
          padding-right: 30/@vw;
        }
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .order-sku-detail {
      padding: 30/@vw;
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

  .order-reason {
    margin-top: 30/@vw;
    padding: 30/@vw;
    box-sizing: border-box;
    width: 100%;
    background-color: #ffffff;
    border-radius: 6/@vw;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .reason-label {
      font-size: 32/@vw;
      color: #666666;
      line-height: 44/@vw;
      flex: none;
    }

    .reason-select {
      font-size: 32/@vw;
      color: rgba(153, 153, 153, 1);
      line-height: 44/@vw;
      flex: 1;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      div {
        max-width: 50vw;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .reason {
        color: #666666;
      }

      i {
        flex: none;
      }
    }
  }

  .apply-message-wrapper {
    width: 100%;
    background-color: #ffffff;
    margin-top: 30/@vw;
    padding: 30/@vw;
    box-sizing: border-box;
    border-radius: 6/@vw;
    position: relative;

    .apply-label {
      font-size: 32/@vw;
      color: #666666;
      line-height: 44/@vw;
    }

    .van-cell {
      padding: 0 !important;
      flex-direction: column;

      .van-field__value {
        margin-top: 20/@vw;

        .van-field__control {
          font-size: 28/@vw;
          line-height: 40/@vw;
          color: #333333;

          &::-webkit-input-placeholder {
            color: rgba(153, 153, 153, 1);
          }
        }
      }

      &.van-cell--required::before {
        display: inline-block;
        content: "*";
        align-self: flex-start;
        font-size: 32/@vw;
        color: rgba(248, 73, 76, 1);
        line-height: 44/@vw;
        left: 0;
      }

      .van-cell__title.van-field__label {
        margin-left: 14/@vw;
      }

      &:after {
        display: none;
      }
    }

    .van-uploader {
      margin-top: 20/@vw;
      margin-right: -8/@vw;

      .van-image, .van-uploader__upload {
        width: 200/@vw;
        height: 200/@vw;
      }

      .van-uploader__upload-text {
        text-align: center;
        padding: 0 36/@vw;
        line-height: 1.5;
      }
    }

    .apply-message-tips {
      position: absolute;
      right: 30/@vw;
      top: 38/@vw;
      font-size: 24/@vw;
      color: rgba(153, 153, 153, 1);
      line-height: 32/@vw;
    }
  }

  .mobile-wrapper {
    width: 100%;
    box-sizing: border-box;
    margin-top: 30/@vw;
    border-radius: 6/@vw;
    background: #ffffff;
    padding: 30/@vw 10/@vw 30/@vw 30/@vw;

    .mobile-label {
      font-size: 32/@vw;
      color: #666666;
      line-height: 44/@vw;
    }

    .van-cell {
      padding: 0;

      .van-cell__title {
        width: 170/@vw;
        margin-right: 0;
      }

      .van-field__control {
        &::-webkit-input-placeholder {
          font-size: 28/@vw;
          color: rgba(153, 153, 153, 1);
          line-height: 40/@vw;
        }
      }

      &.van-cell--required::before {
        display: inline-block;
        content: "*";
        align-self: flex-start;
        font-size: 32/@vw;
        color: rgba(248, 73, 76, 1);
        line-height: 44/@vw;
        left: 0;
        position: relative;
      }

      &:after {
        display: none;
      }
    }
  }

  .complaint-tips {
    margin-top: 20/@vw;
    width: 100%;
    box-sizing: border-box;

    .complaint-tips-title {
      font-size: 28/@vw;
      color: rgba(51, 51, 51, 1);
      line-height: 40/@vw;
    }

    .complaint-tips-detail {
      margin-top: 10/@vw;
      font-size: 24/@vw;
      color: rgba(102, 102, 102, 1);
      line-height: 33/@vw;

      .complaint-contact {
        user-select: none;
        color: #5A90FF;

        &:active {
          color: #4d85f8;
        }
      }
    }
  }

  .complaint-submit {
    margin-top: 40/@vw;
    width: 100%;
    box-sizing: border-box;
    height: 80/@vw;
    background: rgba(90, 144, 255, 1);
    border-radius: 6/@vw;
    font-size: 28/@vw;
    color: rgba(255, 255, 255, 1);
    line-height: 80/@vw;
    text-align: center;
  }

  .item-required {
    &:before {
      display: inline-block;
      content: "*";
      align-self: flex-start;
      font-size: 32/@vw;
      color: rgba(248, 73, 76, 1);
      line-height: 44/@vw;
    }
  }
}
</style>
