import Vue from 'vue'
import { ActionSheet, Dialog, Empty, Field, Icon, Toast, Uploader, Loading } from 'vant'
import 'vant/lib/action-sheet/style'
import 'vant/lib/dialog/style'
import 'vant/lib/empty/style'
import 'vant/lib/icon/style'
import 'vant/lib/toast/style'
import 'vant/lib/uploader/style'
import 'vant/lib/field/style'
import 'vant/lib/loading/style'

export default () => {
  Vue.use(ActionSheet)
  Vue.use(Dialog)
  Vue.use(Icon)
  Vue.use(Toast)
  Vue.use(Empty)
  Vue.use(Uploader)
  Vue.use(Field)
  Vue.use(Loading)
}