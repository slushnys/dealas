<template>
  <div>
    <v-row>
      <v-col xs="12" lg="12" xs12 class="d-flex flex-column">
        <div>
          <v-text-field
            label="Paieska"
            placeholder="Pradėkite paiešką..."
            single-line
            clearable
            solo
            persistent-hint
            light
            hide-details
            @input="debounceSearch"
          ></v-text-field>
        </div>
        <!-- <div
          class="white--text overline font-weight-bold pt-3"
          style="z-index:111"
        >
          Dažniausiai ieškomi:
          <span> žaislai, pica, akropolis, kuponai , </span>
        </div> -->
      </v-col>
    </v-row>
    <v-row class="pt-5">
      <v-col
        v-for="deal in searchedDeals"
        :key="deal.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <DealCard :deal="deal"></DealCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DealCard from '@/components/DealCard'
export default {
  components: { DealCard },
  async fetch(ctx) {
    await ctx.store.dispatch('deals/GET_DEALS')
  },
  data: () => ({
    searchInput: null,
    debounce: null
  }),
  computed: {
    ...mapGetters('deals', { searchDeals: 'getDeals' }),
    searchedDeals() {
      return this.searchDeals(this.searchInput)
    }
  },
  methods: {
    debounceSearch(event) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.searchInput = event
      }, 600)
    }
  },
  head() {
    return {
      title: 'Dealas - puslapis kuriame rasite nuolaida sau!',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Puslapis kuriame rasite aktualių nuolaidų kuriomis dalinasi platformoje besilankantys lankytojai.'
        }
      ],
      noscript: [{ innerHTML: 'Body No Scripts', body: true }],
      script: []
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
a,
a:active {
  text-decoration: none;
}
</style>
