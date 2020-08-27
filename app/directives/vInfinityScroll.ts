import { DirectiveOptions } from 'vue'
import uHelper from '~/app/@biz/uHelper'
import uDie from '~/app/@biz/uDie'

function debounce (fn: Function, delay: number) {
  let timer = null as any // 借助闭包
  ;(function () {
    // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(fn, delay)
  })()
}

export default new class {
  id = 'infinity'

  // v-infinity指令般的参数为scroll时传入绑定函数
  private bindFn: Function = () => {}

  // 滚动事件处理函数
  private scrollFunction = (event: any) => {
    const el = event.target
    const distance = parseInt(el.getAttribute('data-distance')) || 0
    const delay = parseInt(el.getAttribute('data-delay')) || 0
    const offsetHeight = el.offsetHeight
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight

    if (scrollTop + distance >= scrollHeight - offsetHeight)
      debounce(this.bindFn, delay)
  }

  options = {
    // v-infinity指令绑定时调用，只调用一次
    bind: (el, binding) => {

      //获取绑定参数
      const arg = binding.arg

      if (arg === 'scroll') {

        //获取绑定修饰符
        const modifiers = binding.modifiers

        // 当修饰符disabled存在时 则scroll相关操作不执行
        if (modifiers.disabled)
          return

        el.style.cssText = 'overflow-y:scroll;'

        // 获取指令绑定的值
        const reachBottomFn = binding.value

        reachBottomFn || uDie.hint('v-infinity:scroll指令必须有绑定值')
        uHelper.isFunction(reachBottomFn) || uDie.hint('v-infinity:scroll指令绑定值必须是函数')
        this.bindFn = reachBottomFn

        el.addEventListener('scroll', this.scrollFunction)
      }

    },
    // v-infinity指令解除绑定时调用，只调用一次
    unbind: (el, binding) => {
      const arg = binding.arg
      const modifiers = binding.modifiers
      if (arg === 'scroll' && !modifiers.disabled)
        el.removeEventListener('scroll', this.scrollFunction)
    }

  } as DirectiveOptions
}