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

<script lang="ts">
import { firestore } from 'firebase'
import {
  createComponent,
  computed,
  ref,
  reactive,
  onMounted,
  toRefs
} from '@vue/composition-api'
import axios from 'axios'
import DisplayNameComponent from '@/components/DisplayNameComponent.vue'

interface MetaDataResponse {
  charset: string
  title: string
  themeColor: string
  twitterWidgetsLinkColor: string
  author: string
  description: string
  ogSiteName: string
  ogUrl: string
  twitterTitle: string
  twitterDescription: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  twitterWidgetsCsp: string
  twitterWidgetsDnt: string
  ogImage: string
  twitterImageSrc: string
  images: string
  ogDescription: string
}

export default createComponent({
  setup(_, { root: { $store, $router } }) {
    onMounted(() => {})
    const state = reactive({
      fileReader: ref<FileReader | null>(null),
      menu1: false,
      menu2: false,
      endsAt: '',
      startsAt: '',
      newPrice: 0,
      oldPrice: 0,
      title: '',
      description: '',
      link: '',
      image: ref<string | object | null>(null),
      linkImage: '',
      uploadedImage: ref<string | File>(''),
      chosenImage: 'url', // 'url' | 'uploaded'
      distributor: '',

      error: { active: false, message: '' }
    })
    const currentUser = computed(() => $store.getters['auth/getUser'])
    const imageForDisplay = computed(() => state.uploadedImage || state.image)
    const metaParams = async () => {
      const apiURL = `https://europe-west1-organic-nation-192309.cloudfunctions.net/scrapeMetaEurope?message=${state.link}`
      const response = await axios.get(apiURL)
      const data: MetaDataResponse = response.data
      state.title = data.title
      state.image = data.ogImage
      state.linkImage = data.ogImage
      state.description = data.description || data.ogDescription
    }
    const submit = async () => {
      const user = $store.state.auth.user.data
      let image = state.uploadedImage ? state.uploadedImage : state.image
      const imageType = state.chosenImage
      if (imageType === 'url') {
        image = state.linkImage
      } else {
        image = state.uploadedImage
      }
      const data = {
        endsAt: state.endsAt,
        startsAt: state.startsAt,
        newPrice: state.newPrice,
        oldPrice: state.oldPrice,
        title: state.title,
        description: state.description,
        link: state.link,
        // image,
        distributor: state.distributor,
        score: 0,
        user,
        timestamp: firestore.FieldValue.serverTimestamp()
      }
      try {
        const dealId = await $store.dispatch('deals/CREATE_DEAL', {
          data,
          imageType,
          image
        })
        $router.push(`/details/${dealId}`)
      } catch (err) {
        state.error.active = true
        state.error.message = err
      }
    }

    const previewImage = (file: File) => {
      state.fileReader = new FileReader()
      state.uploadedImage = file
      state.chosenImage = 'uploaded'
      state.fileReader.addEventListener('load', () => {
        state.image = state.fileReader ? state.fileReader.result : null
      })
      if (file) {
        state.fileReader.readAsDataURL(file)
      }
    }
    const useImage = (type: string) => {
      state.chosenImage = type
      if (type === 'url') {
        state.image = state.linkImage
      } else {
        state.image = state.fileReader ? state.fileReader.result : null
      }
    }
    return {
      ...toRefs(state),
      imageForDisplay,
      currentUser,
      useImage,
      previewImage,
      submit,
      metaParams
    }
  },
  components: { DisplayNameComponent }
})
</script>

<style scoped></style>
