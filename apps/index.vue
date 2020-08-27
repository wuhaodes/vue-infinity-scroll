<template>
  <nuxt/>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth',
  asyncData ({ redirect }) {
    redirect('/home')
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";
</style>
