<template>
  <div class="p-4">
    <ThePopup />
    <TheCategories v-model="currentCategory" />
    <Card
      v-for="(organization, index) in organizations"
      :key="index"
      :organization="organization"
      @choose="chooseOrganization"
    />
  </div>
</template>

<script>
import ThePopup from '../components/ThePopup'
import Card from '../components/Card'
import TheCategories from '../components/TheCategories'
import { FeedManager } from '../utils/shared/FeedManager'

export default {
  name: 'Feed',
  components: {
    TheCategories,
    ThePopup,
    Card,
  },
  data() {
    return {
      feedManager: null,
      currentCategory: '',
      organizations: null,
    }
  },
  watch: {
    currentCategory(val) {
      // TODO для дебага
      console.log(val)
    },
  },
  mounted() {
    this.feedManager = new FeedManager()
    this.feedManager.subscribe((organizations) => {
      this.organizations = organizations
    })
  },
  beforeDestroy() {
    this.feedManager.unSubscribe()
  },
  methods: {
    chooseOrganization(organization) {
      // TODO: Тут тоже что-то нужно намутить
      // тут тоже обсервер, это норм
      console.log(organization)
    },
  },
}
</script>

<style scoped></style>
