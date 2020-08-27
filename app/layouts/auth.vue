<template>
  <div class="body">
    <nuxt/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import mixins from '~/app/minxins/mixins'

export default Vue.extend({
  name: 'default',
  middleware: ['auth'],
  data () {return {}},
  mixins: [
    mixins.bottom
  ]
})
</script>

<style></style>

