import { Dialog } from 'vant'

export default new class {
  hint (message: string): never {
    Dialog.alert({ title: '错误', message }).then(() => {})
    throw new Error(message)
  }

  error (message: string): never {
    Dialog.alert({ title: '错误', message }).then(() => this.error(message))
    throw new Error(message)
  }
}