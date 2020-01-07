<template>
  <div>
    <v-row class="pt-5">
      <v-col offset-sm="2" cols="12" sm="8">
        <v-card>
          <v-row>
            <v-col cols="12" md="7">
              <div v-if="deal">
                <v-card-title primary-title>
                  <div class="subtitle-2">
                    {{ deal.title }}
                  </div>
                </v-card-title>
                <v-card-text class="d-flex flex-column flex-grow-1">
                  <div class="caption" style="">
                    {{ deal.description }}
                  </div>
                  <div class="flex-grow-1">
                    <img :src="deal.image" width="100%" height="100%" />
                  </div>
                  <!-- <DisplayNameComponent :user="deal.user" /> -->
                </v-card-text>
                <!-- <v-spacer></v-spacer> -->
                <v-card-actions
                  class="text-center justify-center overline font-weight-thin grey--text"
                >
                  <div v-if="deal.endsAt !== null" class="">
                    Galioja iki {{ deal.endsAt }}
                  </div>
                </v-card-actions>
              </div>
            </v-col>
            <v-col v-if="deal" cols="12" md="5" class="text-center">
              <div>
                <v-btn color="primary" target="_blank" :href="deal.link"
                  >Atidaryti nuoroda</v-btn
                >
              </div>
              <div class="pt-5">
                <div>{{ deal.distributor }}</div>
                <div>
                  <span class="caption"> €{{ deal.oldPrice }} </span>
                  <span class="title green--text font-weight-bold">
                    €{{ deal.newPrice }}
                  </span>
                </div>
              </div>
              <div class="pt-1">
                <span class="font-weight-medium pl-1 pr-1">
                  <v-btn
                    text
                    icon
                    @click.stop.prevent="addVote(deal.id, 'downvote')"
                    ><v-icon color="blue">mdi-minus</v-icon></v-btn
                  >
                </span>
                {{ deal.score }}
                <span class="font-weight-medium pl-1 pr-1"
                  ><v-btn
                    text
                    icon
                    @click.stop.prevent="addVote(deal.id, 'upvote')"
                  >
                    <v-icon color="red">mdi-plus</v-icon>
                  </v-btn></span
                >
              </div>
              <div>
                <a class="comment-link" href="#comments">
                  <v-icon>mdi-comment</v-icon> komentarai
                </a>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row id="comments">
      <v-col offset-sm="2" cols="12" sm="8">
        <v-card>
          <v-card-title primary-title>
            Komentarai
          </v-card-title>
          <v-card-text>
            <div class="comments">
              <div>
                <v-text-field
                  v-model="commentContent"
                  name="comments"
                  label="Jūsų komentaras"
                  clear-icon="mdi-close-circle"
                  type="text"
                  clearable
                  append-outer-icon="mdi-send"
                  @click:append-outer="postComment"
                >
                </v-text-field>
              </div>
              <div>
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="comment-container pa-3 mt-3 mb-3"
                >
                  <div class="caption">
                    <span class="font-weight-bold">
                      {{ comment.userName ? comment.userName : 'user' }}
                    </span>
                    <DisplayDateComponent :date="comment.timestamp" />
                  </div>
                  <div class="commentContent">
                    {{ comment.content }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col offset="2"></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { firestore } from 'firebase'
import { isNil, get } from 'lodash'
import DisplayDateComponent from '@/components/DisplayDateComponent'
import votesMixin from '@/mixins/votesMixin'

export default {
  components: { DisplayDateComponent },
  mixins: [votesMixin],
  async asyncData(ctx) {
    const dealId = ctx.params.id
    await ctx.store.dispatch('deals/VIEW_DEAL', dealId)
    return {
      dealId
    }
  },
  data: () => ({
    commentContent: null
  }),
  computed: {
    ...mapGetters('auth', { user: 'getUser' }),
    ...mapGetters('deals', { deal: 'getDeal', comments: 'getComments' })
  },

  mounted() {
    this.$store.dispatch('deals/INITIATE_LISTENING_TO_COMMENTS', this.dealId)
  },
  beforeDestroy() {
    this.$store.dispatch('deals/LEAVE_DEAL')
  },
  methods: {
    postComment() {
      const userName = get(this.user.data, 'displayName')
      const commentData = {
        dealId: this.dealId,
        userId: this.user.data.uid,
        content: this.commentContent,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userName: isNil(userName) ? 'Not disclosed' : userName
      }
      this.$store.dispatch('deals/POST_COMMENT', commentData)
    }
  },
  head() {
    return {
      title: `Dealas - ${this.deal.title}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.deal.description}`
        }
      ]
    }
  }
}
</script>
<style scoped>
* {
  font-family: 'Montserrat', sans-serif;
}
.offer-card {
  min-width: 220px;
}
.comment-container {
  background: rgba(56, 189, 207, 0.05);
  border-radius: 5px;
}
a.comment-link {
  text-decoration: none;
  color: gray;
}
</style>
