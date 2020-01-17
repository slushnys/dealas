import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import { getModule } from 'vuex-module-decorators'
import newDealStore from '../newDealStore'

const Vue = createLocalVue()
Vue.use(Vuex)

/**
 * Factory function returns a new store instance
 */
const factory = () => {
  const store = new Vuex.Store({
    modules: {
      deal: newDealStore
    }
  })
  return getModule(newDealStore, store)
}

/**
 * The test case
 */
describe('newDealStore', () => {
  it('has to get a store instance', (done) => {
    const service = factory()
    expect(service).toBeInstanceOf(Object)
    done()
  })
})
