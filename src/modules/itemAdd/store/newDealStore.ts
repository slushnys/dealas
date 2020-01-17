import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { isNil, clone, find, isFunction } from 'lodash'
import { IDealStore, IDeal, IComment } from './types'
import { db, storage } from '~/plugins/firebase'

// interface QueryDocumentSnapshot<T

const slugify = (textString: string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return (
    textString
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

const randomString = (stringCount: number = 5) => {
  return Math.random()
    .toString(36)
    .substr(2, stringCount)
}

let unsubscribeComments: null | Function = null

@Module({
  name: 'deal',
  namespaced: true,
  stateFactory: true
})
export default class extends VuexModule implements IDealStore {
  deals: IDeal[] = []
  deal: IDeal | null = null
  comments: IComment[] = []

  get getDeals(searchText: string): IDeal[] {
    if (searchText !== '' && !isNil(searchText)) {
      const lowerSearchText: string = searchText.toLowerCase()
      return this.deals.filter(
        (item: IDeal) =>
          item.title.toLowerCase().includes(lowerSearchText) ||
          item.description.toLowerCase().includes(lowerSearchText)
      )
    } else {
      return this.deals
    }
  }

  @Action
  async GET_DEALS() {
    const deals: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> = await db
      .collection('deals')
      .get()

    this.SET_DEALS(
      deals.docs.map((deal: firebase.firestore.QueryDocumentSnapshot) => ({
        id: deal.id,
        ...(deal.data() as IDeal)
      }))
    )
  }

  async CREATE_DEAL({
    data: deal,
    imageType,
    image
  }: {
    data: IDeal
    imageType: string
    image: Blob | Uint8Array | ArrayBuffer
  }) {
    if (deal === null) {
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
            // User doesn't have permission to access the object
            break

          case 'storage/canceled':
            // User canceled the upload
            break

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      }
    }

    const dealData: IDeal = { ...deal, id: dealId, image: imageURL }

    await db
      .collection('deals')
      .doc(dealId)
      .set(dealData)

    this.ADD_DEAL(dealData as IDeal)
    return dealId
  }

  @Action
  async POST_COMMENT(data: any) {
    try {
      await db
        .collection('deals')
        .doc(data.dealId)
        .collection('comments')
        .add(data)
    } catch (e) {}
  }

  @Action
  async VIEW_DEAL(dealId: string) {
    const dealRef = db.collection('deals').doc(dealId)

    // LISTENING TO COMMENT COLLECTION CHANGE WONT WORK HERE
    // THIS IS CALLED BY SERVER SIDE RENDERING

    const deal = await dealRef.get()
    this.SET_DEAL(deal.data() as IDeal)
  }

  @Action
  LEAVE_DEAL() {
    if (isFunction(unsubscribeComments)) unsubscribeComments()

    this.SET_DEAL(null)
  }

  @Action
  UPDATE_SCORE(score: number) {
    this.SET_SCORE(score)
  }

  @Action
  UPDATE_DEAL_SCORE({ dealId, score }: { dealId: string; score: number }) {
    const newDeal = clone(find(this.deals, (d) => d.id === dealId))
    if (!isNil(newDeal)) {
      newDeal.score = score
      const deals = [
        ...this.deals.filter((item) => item.id !== dealId),
        newDeal
      ]
      this.SET_DEALS(deals)
    }
  }

  @Action
  INITIATE_LISTENING_TO_COMMENTS(dealId: string) {
    const dealRef = db.collection('deals').doc(dealId)
    // THIS WILL NOT WORK AS ITS BEING RENDERED IN SERVER SIDE
    unsubscribeComments = dealRef
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const comments: IComment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as IComment)
        }))
        this.SET_COMMENTS(comments)
      })
  }

  @Mutation
  SET_DEALS(deals: IDeal[]) {
    this.deals = deals
  }

  @Mutation
  ADD_DEAL(data: IDeal) {
    // const { id, data } = deal
    this.deals = [...this.deals, data]
  }

  @Mutation
  SET_DEAL(data: IDeal | null) {
    this.deal = data
  }

  @Mutation
  SET_SCORE(score: number) {
    this.deal = { ...(this.deal as IDeal), score }
  }

  @Mutation
  SET_COMMENTS(data: IComment[]) {
    this.comments = data
  }
}
