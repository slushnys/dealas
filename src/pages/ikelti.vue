<template>
  <v-row class="pt-5">
    <v-col
      cols="12"
      offset-md="2"
      md="3"
      class="d-flex align-center justify-center"
    >
      <div>
        <v-snackbar
          v-model="error.active"
          color="error"
          :timeout="6000"
          :top="true"
        >
          {{ error.message }}
          <v-btn dark text @click="snackbar = false">
            Close
          </v-btn>
        </v-snackbar>
        <v-card :elevation="3">
          <v-card-title primary-title>
            <div class="subtitle-2" style="word-break: break-word;">
              {{ title }}
            </div>
          </v-card-title>
          <v-card-text>
            <div class="d-flex wrap caption">
              {{ description }}
            </div>
            <div>
              <img :src="image" width="100%" height="100%" />
            </div>
            <div class="d-flex justify-space-between">
              <div>{{ distributor }}</div>
              <div>
                <span class="caption darken-3"> €{{ oldPrice }} </span>
                <span class="body-1 green--text darken-2 font-weight-medium">
                  €{{ newPrice }}
                </span>
              </div>
            </div>
            <div>
              <DisplayNameComponent
                :user="currentUser.data"
              ></DisplayNameComponent>
            </div>
            <div class="d-flex align-center justify-space-between">
              <div><v-icon>mdi-comment</v-icon> 0 komentarai</div>
              <div>
                <span class="font-weight-medium pl-1 pr-1">
                  <v-btn text icon
                    ><v-icon color="blue">mdi-minus</v-icon></v-btn
                  >
                </span>
                0
                <span class="font-weight-medium pl-1 pr-1"
                  ><v-btn text icon>
                    <v-icon color="red">mdi-plus</v-icon>
                  </v-btn></span
                >
              </div>
            </div>
            <div
              v-if="endsAt"
              class="d-flex pt-2 justify-center align-end overline font-weight-thin"
            >
              {{ endsAt }}
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>
          Pridėti nuolaidą
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="link"
            label="Nuoroda (nebūtina)"
            hint="Nuoroda į jūsų nuolaidą (nebūtina)"
            @change="metaParams"
          ></v-text-field>
          <v-divider></v-divider>
          <v-text-field
            id="id"
            v-model="title"
            name="title"
            label="Pavadinimas"
          ></v-text-field>

          <v-file-input accept="image/*" prepend-icon="" @change="previewImage">
            <template v-slot:label>
              <div>Įkelti nuotrauką (nebūtina)</div>
            </template>
          </v-file-input>
          <div v-if="linkImage && uploadedImage">
            Kokią nuotrauką norite naudoti?
            <a @click="useImage('url')">Nuoroda</a>
            <a @click="useImage('uploaded')">Įkelta</a>
          </div>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="oldPrice"
                label="Sena kaina (nebūtina)"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newPrice"
                color="green darken-2"
                label="Nauja kaina (nebūtina)"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-textarea
            v-model="description"
            name="input-7-1"
            label="Aprašymas"
            hint="Pridėkite aprayšma nuolaidai apibūdinti."
            clearable
            clear-icon="mdi-close"
          ></v-textarea>
          <v-text-field
            v-model="distributor"
            label="Parduotuvės pavadinimas (nebūtina)"
          ></v-text-field>
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            :value="startsAt"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startsAt"
                label="Nuolaidos galiojimo pradžia (nebūtina)"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startsAt"
              @input="menu1 = false"
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            :value="endsAt"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endsAt"
                label="Nuolaidos galiojimo pabaiga (nebūtina)"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endsAt"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
          <div class="d-flex justify-end">
            <v-btn color="primary" class="" @click="submit">pridėti</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { firestore } from 'firebase'
import { mapGetters } from 'vuex'
import DisplayNameComponent from '@/components/DisplayNameComponent'

export default {
  components: { DisplayNameComponent },
  data: () => ({
    fileReader: null,
    menu1: false,
    menu2: false,
    endsAt: null,
    startsAt: null,
    newPrice: 0,
    oldPrice: 0,
    title: null,
    description: null,
    link: null,
    image: null,
    linkImage: null,
    uploadedImage: null,
    chosenImage: 'url', // 'url' | 'uploaded'
    distributor: null,

    error: { active: false, message: '' }
  }),
  computed: {
    ...mapGetters('auth', { currentUser: 'getUser' }),
    imageForDisplay() {
      return this.uploadedImage ? this.uploadedImage : this.image
    }
  },
  mounted() {
    window.v = this
  },
  methods: {
    metaParams(value) {
      const apiURL = `https://europe-west1-organic-nation-192309.cloudfunctions.net/scrapeMetaEurope?message=${this.link}`

      this.$axios.get(apiURL).then(({ data }) => {
        this.title = data.title
        this.image = data.ogImage
        this.linkImage = data.ogImage
        this.description = data.description || data.ogDescription
      })
    },
    async submit() {
      const user = this.$store.state.auth.user.data
      let image = this.uploadedImage ? this.uploadedImage : this.image
      const imageType = this.chosenImage
      if (imageType === 'url') {
        image = this.linkImage
      } else {
        image = this.uploadedImage
      }
      const data = {
        endsAt: this.endsAt,
        startsAt: this.startsAt,
        newPrice: this.newPrice,
        oldPrice: this.oldPrice,
        title: this.title,
        description: this.description,
        link: this.link,
        // image,
        distributor: this.distributor,
        score: 0,
        user,
        timestamp: firestore.FieldValue.serverTimestamp()
      }
      try {
        const dealId = await this.$store.dispatch('deals/CREATE_DEAL', {
          data,
          imageType,
          image
        })
        this.$router.push(`/details/${dealId}`)
      } catch (err) {
        this.error.active = true
        this.error.message = err
        console.error('error')
      }
    },
    previewImage(file) {
      this.fileReader = new FileReader()
      this.uploadedImage = file
      this.chosenImage = 'uploaded'
      this.fileReader.addEventListener('load', () => {
        this.image = this.fileReader.result
      })
      if (file) {
        this.fileReader.readAsDataURL(file)
      }
    },
    useImage(type) {
      this.chosenImage = type
      if (type === 'url') {
        this.image = this.linkImage
      } else {
        this.image = this.fileReader.result
      }
    }
  }
}
</script>

<style scoped></style>
