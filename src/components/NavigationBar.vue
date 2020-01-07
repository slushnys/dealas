<template>
  <div>
    <no-ssr>
      <div><v-text-field box label="label"></v-text-field>hello</div>
      <div v-show="$vuetify.breakpoint.mdAndDown">
        <v-toolbar-items>
          <v-btn v-for="item in menu" :key="item.id" text>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>
      </div>
      <div v-show="$vuetify.breakpoint.mdAndUp">
        <v-toolbar-items>
          <v-btn v-for="item in menu" :key="item.id" text>
            <div @click="item.click">
              {{ item.title }}
            </div>
          </v-btn>
        </v-toolbar-items>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import { auth } from 'firebase'
import { isNil } from 'lodash'

export default {
  data: () => ({
    navItems: [
      {
        icon: null,
        title: 'Prisijungti',
        to: '/prisijungti',
        showWhenLoggedIn: false,
        showWhenAnonymous: true,
        click: () => {
          // this.$router.push('/prisijungti')
        }
      },
      {
        icon: null,
        title: 'Įkelti',
        to: '/ikelti',
        showWhenLoggedIn: true,
        showWhenAnonymous: false,
        click: () => {
          // this.$router.push('/ikelti')
        }
      },
      {
        icon: null,
        title: 'Atsijungti',
        showWhenLoggedIn: true,
        showWhenAnonymous: false,
        click: async () => {
          await auth().signOut()
          // this.$router.push('/')
        }
      }
    ]
  }),
  computed: {
    menu() {
      if (isNil(this.navItems)) return

      if (!this.currentUser.loggedIn) {
        return this.navItems.filter((itm) => itm.showWhenAnonymous === true)
      } else {
        return this.navItems.filter((itm) => itm.showWhenLoggedIn === true)
      }
    },
    currentUser() {
      return this.$store.getters['auth/getUser']
    }
  }
}
</script>

<style lang="scss" scoped></style>
