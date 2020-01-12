<template>
  <v-hover>
    <template v-slot="{ hover }">
      <v-card
        height="100%"
        :elevation="hover ? 12 : 3"
        class="deal-card d-flex flex-column"
        @click="navigateToDeal(deal.id)"
      >
        <v-card-title primary-title>
          <div class="subtitle-2 text-break">
            {{ deal.title }}
          </div>
        </v-card-title>
        <v-card-text class="d-flex flex-column flex-grow-1">
          <v-row>
            <v-col
              v-if="deal.image"
              :cols="imageCol"
              lg="12"
              xs12
              class="d-flex flex-column text--center"
              ><div class="flex-grow-1 align-self-center">
                <img :src="deal.image" :width="imageWidth" class="deal-image" />
              </div>
            </v-col>
            <v-col
              :cols="descriptionCol"
              lg="12"
              xs12
              class="d-flex flex-column"
              ><div class="caption" style="">
                {{ deal.description | truncate(100) }}
              </div>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between">
            <div><DisplayNameComponent :user="deal.user" /></div>
            <div>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span class="caption" v-on="on">
                    -{{ discountPercent }}%
                  </span>
                </template>
                <span>Sena kaina: € {{ deal.oldPrice }}</span>
              </v-tooltip>

              <span class="body-1  green--text darken-2 font-weight-medium">
                €{{ deal.newPrice }}
              </span>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div></div>
            <div>
              <span class="font-weight-medium pl-1 pr-1">
                <v-btn text icon @click.stop="addVote(deal.id, 'downvote')"
                  ><v-icon color="blue">mdi-minus</v-icon></v-btn
                >
              </span>
              {{ deal.score }}
              <span class="font-weight-medium pl-1 pr-1"
                ><v-btn text icon @click.stop="addVote(deal.id, 'upvote')">
                  <v-icon color="red">mdi-plus</v-icon>
                </v-btn></span
              >
            </div>
          </div>
        </v-card-text>
        <v-card-actions
          v-if="deal.endsAt !== ''"
          class="text-center justify-center overline font-weight-thin grey--text"
        >
          <div class="">Galioja iki {{ deal.endsAt }}</div>
        </v-card-actions>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
import votesMixin from '@/mixins/votesMixin'
import DisplayNameComponent from '@/components/DisplayNameComponent'
export default {
  components: { DisplayNameComponent },
  mixins: [votesMixin],
  props: {
    deal: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    discountPercent() {
      return Math.abs(
        Math.round((this.deal.newPrice * 100) / this.deal.oldPrice - 100, 2)
      )
    },
    imageCol() {
      return this.deal.image ? 3 : 0
    },
    descriptionCol() {
      return this.deal.image ? 9 : 12
    },
    imageWidth() {
      return this.$vuetify.breakpoint.mdAndDown ? '100%' : 'auto'
    }
  },
  methods: {
    navigateToDeal(id) {
      this.$router.push({ path: `/details/${id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.deal-card {
  max-width: auto;
}
.deal-image {
  max-height: 200px;
}
</style>
