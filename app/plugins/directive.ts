import Vue from 'vue'
import vInfinityScroll from '../directives/vInfinityScroll'

export default () => {
  Vue.directive(vInfinityScroll.id, vInfinityScroll.options)
}