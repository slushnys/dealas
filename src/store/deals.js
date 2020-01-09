import { isFunction, isNil, find, clone } from 'lodash'
import { db, storage } from '@/plugins/firebase'

export const state = () => ({
  deals: {},
  deal: null,
  comments: null
})

let unsubscribeComments = null

export const getters = {
  getDeals: (state) => (searchText) => {
    if (searchText !== '' && !isNil(searchText)) {
      const lowerSearchText = searchText.toLowerCase()
      return state.deals.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearchText) ||
          item.description.toLowerCase().includes(lowerSearchText)
      )
    } else {
      return state.deals
    }
  },
  getComments: (state) => state.comments,
  getDeal: (state) => state.deal
}

const slugify = (string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return (
    string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      // eslint-disable-next-line no-useless-escape
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      // eslint-disable-next-line no-useless-escape
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')
  ) // Trim - from end of text
}

const randomString = (stringCount = 5) => {
  return Math.random()
    .toString(36)
    .substr(2, stringCount)
}

export const actions = {
  async GET_DEALS({ commit }) {
    const deals = await db.collection('deals').get()
    commit(
      'SET_DEALS',
      deals.docs.map((deal) => ({ id: deal.id, ...deal.data() }))
    )
  },
  async CREATE_DEAL({ commit }, { data: deal, imageType, image }) {
    if (deal === null) {
      console.error('no deal was provided')
    }
    const dealId = `${slugify(deal.title)}-${randomString()}`
    let imageURL = image
    if (imageType === 'uploaded' && image) {
      const storageRef = await storage.ref()
      try {
        const uploadTask = await storageRef
          .child(`images/${dealId}.jpeg`)
          .put(image)
        imageURL = await uploadTask.ref.getDownloadURL()
      } catch (error) {
        switch (error.code) {
          case 'storage/unauthorized':
            console.log('storage/unauthorized')
            // User doesn't have permission to access the object
            break

          case 'storage/canceled':
            console.log('storage/canceled')
            // User canceled the upload
            break

          case 'storage/unknown':
            console.log('storage/unknown')
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      }
    }

    const dealData = { ...deal, id: dealId, image: imageURL }
    try {
      await db
        .collection('deals')
        .doc(dealId)
        .set(dealData)

      commit('ADD_DEAL', { id: dealId, dealData })
      return dealId
    } catch (error) {
      console.error('error creating a document', error)
      throw error
    }
  },
  async POST_COMMENT(data) {
    try {
      await db
        .collection('deals')
        .doc(data.dealId)
        .collection('comments')
        .add(data)
      console.log('Successfully added a comment')
    } catch (e) {
      console.error(e)
    }
  },
  async VIEW_DEAL({ commit }, dealId) {
    const dealRef = db.collection('deals').doc(dealId)

    // LISTENING TO COMMENT COLLECTION CHANGE WONT WORK HERE
    // THIS IS CALLED BY SERVER SIDE RENDERING

    const deal = await dealRef.get()
    commit('SET_DEAL', deal.data())
  },
  INITIATE_LISTENING_TO_COMMENTS({ commit }, dealId) {
    const dealRef = db.collection('deals').doc(dealId)
    // THIS WILL NOT WORK AS ITS BEING RENDERED IN SERVER SIDE
    unsubscribeComments = dealRef
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const comments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        commit('SET_COMMENTS', comments)
      })
  },
  LEAVE_DEAL({ commit }) {
    console.log('Leave initiated in deal')
    if (isFunction(unsubscribeComments)) unsubscribeComments()
    commit('SET_DEAL', null)
  },
  UPDATE_SCORE({ commit }, score) {
    commit('SET_SCORE', score)
  },
  UPDATE_DEAL_SCORE({ commit, state }, { dealId, score }) {
    const newDeal = clone(find(state.deals, (d) => d.id === dealId))
    newDeal.score = score
    const deals = [...state.deals.filter((item) => item.id !== dealId), newDeal]
    commit('SET_DEALS', deals)
  }
}

export const mutations = {
  SET_DEALS(state, data) {
    state.deals = data
  },
  ADD_DEAL(state, data) {
    const { id, deal } = data
    state.deals[id] = deal
  },
  SET_DEAL(state, data) {
    state.deal = data
  },
  SET_COMMENTS(state, data) {
    state.comments = data
  },
  ADD_COMMENTS(state, data) {
    state.comments = [...state.comments, ...data]
  },
  SET_SCORE(state, score) {
    state.deal = { ...state.deal, score }
  }
}
