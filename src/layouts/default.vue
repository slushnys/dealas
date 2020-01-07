<template>
  <v-app dark>
    <v-app-bar
      color="rgba(56, 189, 207, 1)"
      flat
      dark
      elevation-0
      :clipped-left="clipped"
      fixed
      app
    >
      <nuxt-link to="/" class="link-decoration">
        <v-toolbar-title class="display-1 pa-5 white--text" v-text="title" />
      </nuxt-link>
      <v-spacer />

      <div class="flex-grow-1 mt-5"></div>
      <v-spacer />

      <client-only>
        <div v-show="$vuetify.breakpoint.mdAndUp">
          <v-toolbar-items>
            <v-btn v-for="item in menu" :key="item.id" text class="white--text">
              <div @click="item.click">
                {{ item.title }}
              </div>
            </v-btn>
          </v-toolbar-items>
        </div>
      </client-only>
      <div v-show="$vuetify.breakpoint.smAndDown">
        <v-app-bar-nav-icon @click.stop="rightDrawer = !rightDrawer" />
      </div>
    </v-app-bar>

    <v-content>
      <v-container>
        <div class="triangle"></div>

        <nuxt />
      </v-container>
    </v-content>
    <client-only>
      <v-navigation-drawer v-model="rightDrawer" right temporary fixed>
        <v-list>
          <v-list-item
            v-for="item in menu"
            :key="item.id"
            @click.native="item.click"
          >
            <v-list-item-action>
              <v-icon light>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </client-only>
  </v-app>
</template>

<script>
import { auth } from 'firebase'
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      navItems: [
        {
          icon: 'mdi-login',
          title: 'Prisijungti',
          to: '/prisijungti',
          showWhenLoggedIn: false,
          showWhenAnonymous: true,
          click: () => {
            this.$router.push('/prisijungti')
          }
        },
        {
          icon: 'mdi-file-plus',
          title: 'Įkelti',
          to: '/ikelti',
          showWhenLoggedIn: true,
          showWhenAnonymous: false,
          click: () => {
            this.$router.push('/ikelti')
          }
        },
        {
          icon: 'mdi-logout',
          title: 'Atsijungti',
          showWhenLoggedIn: true,
          showWhenAnonymous: false,
          click: async () => {
            await auth().signOut()
            this.$router.push('/')
          }
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'DEALAS'
    }
  },
  computed: {
    menu() {
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
<style>
body {
  background-color: #fff;
}
.link-decoration {
  text-decoration: none;
  color: #fff;
  text-underline-position: unset;
}
.top-nav {
  color: #38bdcf;
}
.triangle-background {
  position: fixed;
  top: 0;
}
/* .v-toolbar {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
} */

/* .triangle {
  width: 200px;
  height: 200px;
  background: linear-gradient(
    to bottom right,
    #fff 0%,
    #fff 50%,
    #a48d01 50%,
    #a48d01 100%
  );
} */

/* .container
	position: relative
	width: 100%
	min-height: 100vh
	margin: 0 auto
	overflow: hidden
	&::after */
/* body::after {
  content: '';
  position: absolute;
  background-color: blue;
  padding-bottom: 141.42136%;
  width: 100%;
  bottom: 0;
  left: 0;
  transform: rotate(65.5deg);
  transform-origin: left bottom;
} */
/* Rectangle 4 */
@media (min-width: 960px) and (max-width: 1264px) {
  .triangle {
    content: '';
    position: fixed;
    width: 220%;
    height: 700px;
    left: -100px;
    top: -200px;
    background: #38bdcf;
    -webkit-transform: rotate(18deg);
    transform: rotate(10deg);
    z-index: 0;
  }
}
@media (min-width: 1264px) {
  .triangle {
    content: '';
    position: fixed;
    width: 130%;
    height: 700px;
    left: -100px;
    top: -200px;
    background: #38bdcf;
    -webkit-transform: rotate(18deg);
    transform: rotate(10deg);
    z-index: 0;
  }
}

@media (min-width: 200px) and (max-width: 960px) {
  .triangle {
    content: '';
    position: fixed;
    width: 134%;
    height: 253px;
    left: -31px;
    top: -32px;
    background: #38bdcf;
    -webkit-transform: rotate(18deg);
    transform: rotate(10deg);
    z-index: 0;
  }
}
/*
@media (min-width: 768px) {
  .triangle {
    content: '';
    position: absolute;
    width: 220%;
    height: 700px;
    left: -100px;
    top: -200px;
    background: #38bdcf;
    -webkit-transform: rotate(18deg);
    transform: rotate(10deg);
    z-index: 0;
  }
} */
</style>
