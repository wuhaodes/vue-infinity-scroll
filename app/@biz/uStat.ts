import { Dic, Stat } from 'coa-nuxt'

const hosts = {
  't': 'log.t1.isus.vip',
  'v': 'log.isus.vip',
} as Dic<string>

export default new class extends Stat {

  private runEnv = ''

  setEnv (env: string) {
    // 如果已经设置了同样的环境，则不处理
    if (this.runEnv === env)
      return
    // 根据不同的环境设置host
    const host = hosts[env.substr(0, 1)] || ''
    if (host) {
      this.set({ host })
      this.runEnv = env
    }
  }

  page_visit (data: { refer: string }) {
    this.track('page-visit', data)
  }

  user_login (data: { path: string, type: string }) {
    this.track('user-login', data)
  }

  user_sign_up (data: { path: string, type: string }) {
    this.track('user-sign-up', data)
  }

  protected onUpload (raw: Dic<string>) {
    // const passPortInfo = uPassport.getPassPortData() || {}
    // const account = passPortInfo.account || {}
    // const manager = passPortInfo.manager || {}
    //
    // Object.assign(raw, { accountId: account.accountId || '', managerId: manager.managerId || '' })
  }

  protected onTrack (raw: Dic<string>) {
    const from = 'spa'
    const host = location.host
    const query = location.search || ''
    const hash = location.hash || ''
    const path = location.pathname || ''
    Object.assign(raw, { from, host, query, hash, path })
  }
}
