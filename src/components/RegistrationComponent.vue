<template>
  <v-card flat>
    <v-card-title primary-title>
      Registruotis
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field> -->

        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Vardas / slapyvardis"
          required
        />
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="El. paštas"
          required
        />
        <v-text-field
          v-model="password"
          type="password"
          :rules="passwordRules"
          label="Slaptažodis"
          required
        />
        <div>Perskaitykite <a @click.stop="dialog = true">salygas</a></div>
        <v-checkbox
          v-model="checkbox"
          label="Ar sutinkate su sąlygomis?"
          :rules="[(v) => !!v || 'Privalote sutikti, kad užsiregistruotumėte!']"
          required
        />

        <v-btn
          :disabled="!valid"
          color="primary"
          class="mr-4"
          @click="validate"
        >
          Registruotis
        </v-btn>
      </v-form>
      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            Bendros naudojimosi paslaugomis taisyklės?
          </v-card-title>
          <v-card-text>
            <ul>
              <li>
                Įkeldami nuorodas nesiekiate piktybiškai pakenkti portalui.
              </li>
              <li>
                Įkeliate tinkamai paruoštą informaciją nebandant pakenkti
                portalo vartotojams.
              </li>
              <li>
                Pažadate dalintis nuolaidomis k
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="conditionsDisagree"
              >Disagree</v-btn
            >
            <v-btn color="green darken-1" text @click="conditionsAgree"
              >Agree</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { auth } from 'firebase'
export default {
  data: () => ({
    checkbox: false,
    valid: true,
    name: '',
    dialog: false,
    user: auth().currentUser,
    nameRules: [
      (v) => !!v || 'Šis laukelis privalo būti užpildytas',
      (v) => (v && v.length <= 20) || 'Name must be less than 20 characters'
    ],
    password: '',
    passwordRules: [(v) => !!v || 'Šis laukelis privalo būti užpildytas'],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'Šis laukelis privalo būti užpildytas'
    ]
  }),
  methods: {
    conditionsAgree() {
      this.dialog = false
      this.checkbox = true
    },
    conditionsDisagree() {
      this.dialog = false
      this.checkbox = false
    },
    async validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
      try {
        const userData = await auth().createUserWithEmailAndPassword(
          this.email,
          this.password
        )
        await userData.user.updateProfile({
          displayName: this.name
        })
        this.$store.dispatch('auth/UPDATE_LOCAL_NAME', this.name)
        const userInstanceInfo = {
          email: userData.user.email,
          uid: userData.user.uid,
          displayName: userData.user.displayName
        }
        this.$store.dispatch('auth/CREATE_USER_INSTANCE', userInstanceInfo)

        this.$router.push('/')
      } catch (error) {
        this.snackbar = true
        // Handle Errors here.
        // const errorCode = error.code
        // const errorMessage = error.message
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
