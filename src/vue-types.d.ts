import Vue from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    firebase?: object | ((this: V) => object)
  }
}
