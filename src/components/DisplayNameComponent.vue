<template>
  <div><v-icon>mdi-account</v-icon> {{ displayName }}</div>
</template>

<script>
import { get, isNil } from 'lodash'
export default {
  props: {
    user: { type: Object, default: () => {} }
  },
  computed: {
    displayName() {
      return isNil(get(this.user, 'displayName')) ? '' : this.user.displayName
    }
  }
}
</script>

<style lang="scss" scoped></style>
