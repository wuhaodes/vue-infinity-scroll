<template>
  <iframe :src="link"></iframe>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head () {
    return { title: '' }
  },
  async asyncData ({ query }) {
    const queryLink = query.link as any
    const link = decodeURIComponent(queryLink || '') || ''
    return { link }
  },
  data () {
    return { link: '' }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";

iframe {
  width: 100%;
  min-height: 100vh;
}
</style>