// 提取自node_modules/@nuxt/vue-app/types 用于解决vetur下AutoCompletion/IntelliSense工作不正常的问题
import Vue from 'vue'
import { Store } from 'vuex'
import VueRouter, { Route } from 'vue-router'
import { MetaInfo } from 'vue-meta'

type Dictionary<T> = { [key: string]: T }
type NuxtState = Dictionary<any>

interface ErrorParams {
  statusCode?: number
  message?: string
}

interface Context {
  app: Vue
  /**
   * @deprecated Use process.client instead
   */
  isClient: boolean
  /**
   * @deprecated Use process.server instead
   */
  isServer: boolean
  /**
   * @deprecated Use process.static instead
   */
  isStatic: boolean
  isDev: boolean
  isHMR: boolean
  route: Route
  store: Store<any>
  env: Dictionary<any>
  query: Route['query']
  nuxtState: NuxtState
  req: Request
  res: Response
  params: Route['params']
  payload: any
  redirect(status: number, path: string, query?: Route['query']): void
  redirect(path: string, query?: Route['query']): void
  error(params: ErrorParams): void
  beforeNuxtRender(
    fn: (params: {
      Components: VueRouter['getMatchedComponents']
      nuxtState: NuxtState
    }) => void
  ): void
}

interface Transition {
  name?: string
  mode?: string
  css?: boolean
  duration?: number
  type?: string
  enterClass?: string
  enterToClass?: string
  enterActiveClass?: string
  leaveClass?: string
  leaveToClass?: string
  leaveActiveClass?: string
  beforeEnter?(el: HTMLElement): void
  enter?(el: HTMLElement, done: Function): void
  afterEnter?(el: HTMLElement): void
  enterCancelled?(el: HTMLElement): void
  beforeLeave?(el: HTMLElement): void
  leave?(el: HTMLElement, done: Function): void
  afterLeave?(el: HTMLElement): void
  leaveCancelled?(el: HTMLElement): void
}

type Middleware =
  | string
  | ((ctx: Context, cb: Function) => Promise<void> | void)

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    asyncData?(ctx: Context): object | undefined
    fetch?(ctx: Context): Promise<void> | void
    head?: MetaInfo | (() => MetaInfo)
    key?: string | ((to: Route) => string)
    layout?: string | ((ctx: Context) => string)
    loading?: boolean
    middleware?: Middleware | Middleware[]
    scrollToTop?: boolean
    transition?: string | Transition | ((to: Route, from: Route) => string)
    validate?(ctx: Context): Promise<boolean> | boolean
    watchQuery?: boolean | string[]
  }
}

interface NuxtLoading {
  fail?(): NuxtLoading
  finish(): NuxtLoading
  increase?(num: number): NuxtLoading
  pause?(): NuxtLoading
  start(): NuxtLoading
}

interface NuxtApp {
  $loading: NuxtLoading
  isOffline: boolean
  isOnline: boolean
}

declare module 'vue/types/vue' {
  interface Vue {
    $nuxt: NuxtApp
  }
}
