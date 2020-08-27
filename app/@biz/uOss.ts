import uHelper from '~/app/@biz/uHelper'
import { Toast } from 'vant'

export default new class {
  async uploadImage (item: any, count = 0, uploadSign: Dic<any>) {
    const { host, ...params } = uploadSign.token || {}
    const fileType = item.file.name.split('.').pop()?.toLowerCase()
    const key = params['dir'] + count + '.' + fileType

    const param = {
      key,
      OSSAccessKeyId: params['accessid'],
      policy: params['policy'],
      Signature: params['signature'],
      success_action_status: 200
    }

    const result = await uHelper.uploadFile(uHelper.dataURItoBlob(item.content) as Blob, host, param)

    if (!result)
      return Toast.fail('图片上传失败')

    return this.getFileName(key, item.content)

  }

  private async getFileName (key: string, src: string) {
    return await new Promise(resolve => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(key + ';' + Math.round((img.height / img.width) * 100) / 100)
    })
  }

}