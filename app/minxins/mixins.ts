import uHelper from '~/app/@biz/uHelper'

let handleScroll: any

const reachBottom = (instance: any) => {
  handleScroll = () => {
    const scrollTop = window.scrollY
    const documentBodyHeight = document.body.offsetHeight
    const windowHeight = window.innerHeight

    if (scrollTop >= documentBodyHeight - windowHeight) {
      const reachBottomFn = instance?.onReachBottom
      if (reachBottomFn && uHelper.isFunction(reachBottomFn))
        reachBottomFn()
    }
  }

  window.addEventListener('scroll', handleScroll)
}

const bottom = {
  mounted () {
    reachBottom(this)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', handleScroll)
  }
}

export default {
  bottom
}