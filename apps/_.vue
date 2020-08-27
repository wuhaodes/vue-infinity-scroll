<template>
  <div class="error-page-wrapper">
    <van-empty image="error" description="错误页面"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="less">
@import "app/assets/style/global";

.error-page-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100/@vw;
}
</style>
