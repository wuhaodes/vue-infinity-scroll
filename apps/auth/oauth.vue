<template>
  <div>{{ code }}</div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData ({ query }) {
    const code = query.code as string || ''
    return { code }
  },
  data () {
    return {
      code: ''
    }
  }
})
</script>

<style lang="less">
@import "app/assets/style/global";
</style>
