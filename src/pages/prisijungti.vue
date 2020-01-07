<template>
  <v-row class="pt-5">
    <v-col offset-md="2" lg="8" class="">
      <v-card>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" md="5">
              <div class="">
                <RegistrationComponent></RegistrationComponent>
              </div>
            </v-col>
            <v-col md="2"></v-col>
            <v-col cols="12" md="5">
              <LoginComponent></LoginComponent>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs="12">
              <v-card flat>
                <v-card-title class="grey--text">
                  Prisijungti su
                </v-card-title>
                <v-card-text class="d-flex align-center justify-center">
                  <v-row>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        class="white--text"
                        color="#4267b2"
                        @click="signIn('facebook')"
                      >
                        <v-icon>mdi-facebook</v-icon>Facebook</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import firebase from 'firebase'
import RegistrationComponent from '@/components/RegistrationComponent'
import LoginComponent from '@/components/LoginComponent'
import { auth } from '@/plugins/firebase'
export default {
  components: {
    RegistrationComponent,
    LoginComponent
  },
  methods: {
    async signIn(socialType) {
      let provider = null
      switch (socialType) {
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider()
          break
        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider()
          break
      }
      try {
        await auth.signInWithPopup(provider)
        this.$router.push('/')
      } catch (error) {
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        console.log(errorCode, errorMessage, email, credential)
      }
    }
  }
}
</script>

<style scoped>
.google-signin:focus {
  background-image: url('/social/google/btn_google_signin_light_focus_web.png');
}
.google-signin {
  background-image: url('/social/google/btn_google_signin_light_normal_web.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 191px;
  height: 46px;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.google-signin:active {
  background-image: url('/social/google/btn_google_signin_light_focus_web.png');
}
</style>
