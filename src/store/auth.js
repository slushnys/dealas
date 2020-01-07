import { db } from '~/plugins/firebase'

export const state = () => ({
  user: {
    loggedIn: false,
    data: null
  }
})

export const getters = {
  getUser: (state) => state.user
}

export const actions = {
  fetchUser({ commit }, user) {
    commit('SET_LOGGED_IN', user !== null)
    if (user) {
      commit('SET_USER_DATA', {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid
      })
    } else {
      commit('SET_USER_DATA', null)
    }
  },
  UPDATE_LOCAL_NAME({ commit, state }, name) {
    if (
      name !== null ||
      name !== undefined ||
      name !== '' ||
      state.user.data !== null
    )
      commit('SET_LOCAL_NAME', name)
  },
  async CREATE_USER_INSTANCE({ commit, state }, userData) {
    await db
      .collection('users')
      .doc(userData.uid)
      .set(userData)
  }
}

export const mutations = {
  SET_LOGGED_IN(state, value) {
    state.user.loggedIn = value
  },
  SET_USER_DATA(state, data) {
    state.user.data = data
  },
  SET_LOCAL_NAME(state, name) {
    state.user.data.displayName = name
  }
}
