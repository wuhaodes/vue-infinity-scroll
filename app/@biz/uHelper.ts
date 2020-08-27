import { _, storage } from 'coa-nuxt'
import config from '~/config'

export default new class {
//  数字四舍五入取整
  MathRound (num: number) {
    return Math.round(num)
  }

  // 遍历对象
  objForEach (obj: any, fn: (key: any, obj: any[]) => {}) {
    let key, result
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        result = fn.call(obj, key, obj[key])
        if (result === false) {
          break
        }
      }
    }
  }

  // 遍历类数组
  arrForEach (fakeArr: any[], fn: (item: any, i: number) => {}) {
    let i, item, result
    const length = fakeArr.length || 0
    for (i = 0; i < length; i++) {
      item = fakeArr[i]
      result = fn.call(fakeArr, item, i)
      if (result === false) {
        break
      }
    }
  }

  numFilter (value: number) {

    if (!value)
      return '--'

    const temp = parseFloat(value + '').toFixed(2)

    return temp.substring(0, temp.length)

  }

  obj_sum (arr: Dic<any>, ...param: any) {
    let temp = {} as Dic<any>
    arr.forEach((item: Dic<any>, index: number) => {
      for (let k in item) {
        if (param.indexOf(k) >= 0) {
          if ((typeof item[k]) == 'string') {
            item[k] = item[k] * 1
          }
          if (temp[k]) {
            temp[k] += item[k]
          } else {
            temp[k] = item[k]
          }
        }
      }
    })
    return temp
  }

  /**
   * 数字格式化转千分位显示并保留几位小数 如 100000 转为100,000.00
   */
  numberFormat (number: any, decimals: any, dec_point: any, thousands_sep: any) {
    /*
  　　 * 参数说明：
  　　 * number：要格式化的数字
  　　 * decimals：保留几位小数
  　　 * dec_point：小数点符号
  　　 * thousands_sep：千分位符号
  　　 * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    const n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point
    let s: any = ''
    const toFixedFix = function (n: any, prec: any) {
      const k = Math.pow(10, prec)
      return '' + Math.round(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    const re = /(-?\d+)(\d{3})/
    // console.log(s)
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  }

  /**
   * 日期格式化
   * @param date 时间戳
   * @param fmt
   * @returns {string}
   */
  dateFormat (date: string | number | Date, fmt = 'YYYY-MM-DD HH:mm:ss') {

    if (!date)
      return ''

    if (typeof date === 'string') {
      date = new Date(date.replace(/-/g, '/'))
    }
    if (typeof date === 'number') {
      date = new Date(date)
    }

    let o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    } as Dic<number>
    let week = {
      '0': '\u65e5',
      '1': '\u4e00',
      '2': '\u4e8c',
      '3': '\u4e09',
      '4': '\u56db',
      '5': '\u4e94',
      '6': '\u516d'
    } as Dic<string>
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) + '' : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }

  /**
   * 时间格式化2
   * @param time
   * @returns {string}
   */
  formatDiffTime (time: any) {

    let ago, curTime, diff, int
    time = this.unify(time)
    int = parseInt
    curTime = +new Date()
    diff = curTime - time
    ago = ''
    if (1000 * 60 > diff) {
      ago = '刚刚'
    } else if (1000 * 60 <= diff && 1000 * 60 * 60 > diff) {
      ago = int(diff / (1000 * 60) + '') + '分钟前'
    } else if (1000 * 60 * 60 <= diff && 1000 * 60 * 60 * 24 > diff) {
      ago = int(diff / (1000 * 60 * 60) + '') + '小时前'
    } else if (1000 * 60 * 60 * 24 <= diff && 1000 * 60 * 60 * 24 * 30 > diff) {
      ago = int(diff / (1000 * 60 * 60 * 24) + '') + '天前'
    } else if (1000 * 60 * 60 * 24 * 30 <= diff && 1000 * 60 * 60 * 24 * 30 * 12 > diff) {
      ago = int(diff / (1000 * 60 * 60 * 24 * 30) + '') + '月前'
    } else {
      ago = int(diff / (1000 * 60 * 60 * 24 * 30 * 12) + '') + '年前'
    }
    return ago
  }

  /**
   * 时间格式化3
   * @param time
   * @param fmt
   * @returns {string}
   */
  formatHybridTime (time: any, fmt = 'YYYY-MM-DD') {

    let ago, curTime, diff, int
    time = this.unify(time)
    int = parseInt
    curTime = +new Date()
    diff = curTime - time
    ago = ''
    if (1000 * 60 > diff) {
      ago = '刚刚'
    } else if (1000 * 60 <= diff && 1000 * 60 * 60 > diff) {
      ago = int(diff / (1000 * 60) + '') + '分钟前'
    } else if (1000 * 60 * 60 <= diff && 1000 * 60 * 60 * 24 > diff) {
      ago = int(diff / (1000 * 60 * 60) + '') + '小时前'
    } else {
      ago = this.dateFormat(time, fmt)
    }
    return ago
  }

  /**
   * 时间格式化-分割
   * @param time
   * @returns {string}
   */
  dataSegmentation (time: string) {
    if (!time)
      return ''
    return time.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  }

  /**
   * 应用运行环境标识
   * @returns {{isTablet: boolean, isChrome: boolean, isPhone: boolean, isAndroid: boolean, isPc: boolean, isWx: boolean, isDev: boolean, isApp: boolean}}
   */
  osEnv () {
    let ua = process.client ? navigator.userAgent : '',
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isPc = !isPhone && !isAndroid && !isSymbian,
      isWx = /(?:MicroMessenger)/.test(ua),
      isDev = /(?:Dev)/.test(ua),
      isApp = /(?:UmAPP)/.test(ua)
    return {
      isTablet,
      isChrome,
      isPhone,
      isAndroid,
      isPc,
      isWx,
      isDev,
      isApp
    }
  }

  /**
   * 数组平均分割
   * @param arr
   * @returns {Array}
   */
  arraySlice (arr: any[]) {
    let result = []
    for (let i = 0, len = arr.length; i < len; i += 3) {
      result.push(arr.slice(i, i + 3))
    }
    return result
  }

  /**
   * 文件上传
   * @param files
   * @param host
   * @param param
   * @param options
   */
  uploadFileSync (files: string[], host: string, param: Dic<any>, options: Dic<any>) {
    // 添加图片数据
    const formdata = new FormData()

    Object.keys(param).forEach(key => {
      formdata.append(key, param[key])
    })
    files.forEach(file => {
      formdata.append('file', file)
    })
    // 定义 xhr
    const xhr = new XMLHttpRequest()
    xhr.open('POST', host)
    // 设置超时
    xhr.ontimeout = (res) => {

      options.error && options.error(res)
    }
    // 返回数据
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          options.success && options.success('upload success')

        } else {
          options.error && options.error('upload error')

        }
      }
    }
    // 发送请求
    xhr.send(formdata)
  }

  uploadFile (file: string | Blob, host: string, param: Dic<any>) {

    // 添加图片数据
    const formdata = new FormData()

    Object.keys(param).forEach(key => formdata.append(key, param[key]))
    formdata.append('file', file)
    // 定义 xhr
    const xhr = new XMLHttpRequest()
    xhr.open('POST', host)

    const promise = new Promise((resolve, reject) => {
      // 设置超时
      xhr.ontimeout = (res) => reject(res)

      // 返回数据
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200)
            resolve(true)
          else
            reject(false)
        }
      }
    })

    // 发送请求
    xhr.send(formdata)

    return promise
  }

  /**
   * 字符串是否为json
   * @param str
   * @returns {boolean}
   */
  isJsonString (str: string) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true
      }
    } catch (e) {
    }
    return false
  }

  inArray (elem: any, array: any[], i: number) {
    let len
    if (array) {

      len = array.length
      /*
        i ? （i < 0 ? Math.max( 0, len + i ) : i ）: 0 如果 i 未定义 或者i为0 则 把0赋值给i
        i < 0 ? Math.max( 0, len + i ) : i
      */
      i = i ? i < 0 ? Math.max(0, len + i) : i : 0

      for (; i < len; i++) {
        // Skip accessing in sparse arrays
        if (i in array && array[i] === elem) {
          return i
        }
      }
    }

    return -1
  }

  contains (arr: any[], obj: any) {
    let i = arr.length
    while (i--) {
      if (arr[i] === obj) {
        return true
      }
    }
    return false
  }

  /**
   * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
   * @param dataURI
   * @returns {Blob}
   */
  dataURItoBlob (dataURI: string) {
    let byteString = atob(dataURI.split(',')[1])
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  async warpCache (id: string, callback: () => {}) {
    let data = storage.session.get(id)
    if (!data) {
      data = await callback()
      storage.session.set(id, data)
    }
    return data
  }

  /**
   * 图片处理
   */
  oss2image (str: string, width = 'c0') {
    if (!str || str.startsWith('http'))
      return str
    const filename = str.toString().split(';')[0]
    return config.imageBase + filename + '/' + width
  }

  oss2asset (str: string, width = 'c0') {
    if (!str || str.startsWith('http'))
      return str
    const filename = str.toString().split(';')[0]
    return config.assetBase + filename + '/' + width
  }

  oss2height (str: string, width = 0) {
    const rate = parseFloat(str.toString().split(';')[1])
    return rate * width
  }

  revertFromOss (ossStr: string) {
    const arr = ossStr.replace(config.imageBase, '').replace(config.assetBase, '').split('/')
    arr.pop()
    return arr.join('/')
  }

  /**
   * number转字符串
   */
  numToStr (num: number) {
    return num.toString()
  }

  /**
   * 字符串转number
   */
  strToNum (num: string) {
    return +num
  }

  /**
   * 整数转小数  100.00
   */
  getFloat2 (x: any) {
    if (x != '.') {
      let f = Math.round(x * 100) / 100
      let s = f.toString()
      let rs = s.indexOf('.')
      if (rs <= 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    } else {
      return '0.00'
    }
  }

  /**
   * 转化时分秒
   * @param seconds
   * @returns period
   */
  showTime (seconds: number) {
    let hour = 0
    let minute = 0
    let second = 0
    let period = null
    if (seconds >= 3600) {
      hour = _.toInteger(seconds / 3600)
      minute = _.toInteger((seconds % 3600) / 60)
      second = _.toInteger((seconds % 3600) % 60)
      period = hour + '时' + minute + '分' + second + '秒'
    } else if (seconds < 3600 && seconds >= 60) {
      minute = _.toInteger(seconds / 60)
      second = _.toInteger(seconds % 60)
      period = minute + '分' + second + '秒'
    } else if (seconds < 60 && seconds >= 0) {
      second = seconds
      period = second + '秒'
    } else {
      period = '0秒'
    }
    return period
  }

  clone (data: any) {
    return JSON.parse(JSON.stringify(data))
  }

  timeout (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // todo-fn内不能有this指针的调用
  attach (rawData: Dic<any>, keys: string[], fn: (val: any) => any, suffix: string) {

    for (const key of keys) {

      if (this.isUndefined(rawData[key]) || !rawData.hasOwnProperty(key))
        continue

      rawData[key + this.firstUpperCase(suffix)] = fn(rawData[key])

    }
  }

  tranNumberLimit (value: any, fixCount = 2) {
    if (isNaN(value) && !value)
      return value

    return parseInt(value) > 99999 ? this.tranNumber(value) : this.decimal(value, ',', fixCount)
  }

  /**
   * 数字转整数 如 100000 转为10万
   */
  tranNumber (value: any) {
    const newValue = ['', '', '']
    let fr = 1000
    let num = 3
    while (value / fr >= 1) {
      fr *= 10
      num += 1
    }
    if (num <= 4) { // 千
      newValue[0] = value
    } else if (num <= 8) { // 万
      const text1 = (num - 4) / 3 > 1 ? '千万' : '万'
      const fm = '万' === text1 ? 10000 : 10000000
      newValue[1] = text1
      newValue[0] = (value / fm).toFixed(0) + ''
    } else if (num <= 16) {// 亿
      let text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
      text1 = (num - 8) / 4 > 1 ? '万亿' : text1
      text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
      // tslint:disable-next-line:no-shadowed-variable
      let fm = 1
      if ('亿' === text1) {
        fm = 100000000
      } else if ('千亿' === text1) {
        fm = 100000000000
      } else if ('万亿' === text1) {
        fm = 1000000000000
      } else if ('千万亿' === text1) {
        fm = 1000000000000000
      }
      newValue[1] = text1
      newValue[0] = (value / fm).toFixed(0) + ''
    }
    if (value < 1000) {
      newValue[1] = ''
      newValue[0] = value + ''
    }
    return newValue.join('')
  }

  decimal (price: any, splitChar = ',', fixCount = 2) {
    if (isNaN(price) && !price)
      return price

    return Number(price).toFixed(fixCount).replace(/\B(?=(\d{3})+(?!\d))/g, splitChar)
  }

  cent (price: any, splitChar = ',', fixCount = 2) {
    if (isNaN(price) && !price)
      return price

    return Number(price / 100).toFixed(fixCount).replace(/\B(?=(\d{3})+(?!\d))/g, splitChar)
  }

  // todo to implement
  async download (url: string) {
    const a = document.createElement('a')
    a.href = url
    a.style.cssText = 'display:none;'
    document.body.append(a)
    a.click()
    a.remove()
  }

  loadJs (url: string) {

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.append(script)

    return new Promise(resolve => script.onload = resolve)
  }

  openDocument (url: string) {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.click()
  }

  isFunction (val: any): val is Function {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase() === 'function'
  }

  private unify (time: any) {
    time -= 0
    if (('' + time).length === 10) {
      time *= 1000
    }
    return time as number
  }

  private firstUpperCase (str?: string) {
    if (!str)
      return str
    return str.replace(/(^[a-z])/, ($1) => $1.toUpperCase())
  }

  private isUndefined (val: any) {
    return val === undefined
  }

}
