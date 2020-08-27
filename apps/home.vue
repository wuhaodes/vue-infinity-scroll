<template>
  <div class="home-wrapper">
    <van-empty description="智能校服平台移动侧用户企业模版"/>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({ layout: 'auth' })
</script>

<style lang="less">
@import "app/assets/style/global";

.home-wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
  padding-bottom: 100/@vw;
}
</style>
