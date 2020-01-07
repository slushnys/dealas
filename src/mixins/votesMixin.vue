<script>
import { firestore } from 'firebase'
import { get } from 'lodash'
import { db } from '@/plugins/firebase'

export default {
  computed: {
    currentUser() {
      return this.$store.getters['auth/getUser']
    }
  },
  methods: {
    async addVote(id, type) {
      // if user not logged in redirect him to login page.
      if (!this.currentUser.loggedIn) {
        this.$router.push('/prisijungti')
        return
      }
      const dealId = id
      const userId = this.currentUser.data.email
      // Check if the user already made an upvote

      // Vote reference
      const voteId = `${dealId}_${userId}`
      const voteRef = await db.collection('votes').doc(voteId)
      const voteDoc = await voteRef.get()

      // Deal refrerence
      const dealRef = await db.collection('deals').doc(id)
      const deal = await dealRef.get()
      const dealData = deal.data()

      let score = 0
      if (dealData.score !== undefined) {
        score = dealData.score
      }
      // If exists check the type and act accordingly
      if (voteDoc.exists) {
        const data = voteDoc.data()
        // data.id == `${dealId}_${userId}` &&
        if (data.type !== type) {
          // if upvote == upvote { do nothing } otherwise perform the opposite
          // exec vote
          voteRef.update({
            type
          })
          score = score + (type === 'upvote' ? 2 : -2)
          dealRef.update({
            score
          })
        }
        this.setScore(dealId, score)
      } else {
        // add the vote
        voteRef.set({ userId, dealId, type })
        // Add vote to the deal and set the score
        score = score + (type === 'upvote' ? 1 : -1)
        dealRef.update({
          votes: firestore.FieldValue.arrayUnion(voteRef.id),
          // if upvote add 1 otherwise add -1
          score
        })
        this.setScore(dealId, score)
      }
    },
    setScore(dealId, score) {
      if (get(this.$store.state.deals, 'deal')) {
        this.$store.dispatch('deals/UPDATE_SCORE', score)
      } else {
        this.$store.dispatch('deals/UPDATE_DEAL_SCORE', { dealId, score })
      }
    }
  }
}
</script>
