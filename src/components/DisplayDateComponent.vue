<template>
  <span>
    {{ localeDate }}
  </span>
</template>

<script>
export default {
  name: 'DisplayDateComponent',
  props: {
    date: {
      type: Object,
      default: null
    }
  },
  computed: {
    localeDate() {
      if (this.date) {
        return this.date.toDate().toUTCString()
      } else {
        return null
      }
    }
  }
}
</script>

<style></style>
