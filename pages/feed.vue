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
      if (val === 'Где поесть') {
        this.organizations = [
          {
            img: '/bk.png',
            title: 'Burger King',
            moveTime: '2 мин',
            remainingTime: '44 минуты на посещение',
          },
          {
            img: '/kartoshka.png',
            title: 'Крошка картошка',
            moveTime: '25 мин',
            remainingTime: '21 минута на посещение',
          },
          {
            img: '/mcd.jpg',
            title: 'Макдональдс',
            moveTime: '5 мин',
            remainingTime: '41 минута на посещение',
          },
        ]
      }
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
