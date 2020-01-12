<template>
  <v-card flat>
    <v-snackbar
      v-model="error.active"
      color="error"
      :timeout="6000"
      :top="true"
    >
      {{ error.message }}
      <v-btn dark text @click="error.active = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-card-title primary-title>Prisijungti</v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="El. paštas"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Slaptažodis"
          type="password"
          required
        ></v-text-field>

        <v-btn color="primary" class="mr-4" @click="login">Prisijungti</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { auth } from 'firebase'
export default {
  data: () => ({
    error: {
      active: false,
      message: ''
    },
    email: '',
    emailRules: [(v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    password: ''
  }),
  methods: {
    async login() {
      try {
        await auth().signInWithEmailAndPassword(this.email, this.password)
        this.$router.push('/')
      } catch (e) {
        this.error.active = true
        this.error.message = e.message
        // throw e
      }

      // TODO: add a login method from firebase
    }
  }
}
</script>
