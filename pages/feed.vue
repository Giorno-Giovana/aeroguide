<template>
  <div class="p-4">
    <ThePopup />
    <Map :indx="indx" />
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
import Map from './map'

export default {
  name: 'Feed',
  components: {
    Map,
    TheCategories,
    ThePopup,
    Card,
  },
  data() {
    return {
      feedManager: null,
      currentCategory: '',
      organizations: null,
      indx: 2,
    }
  },
  watch: {
    currentCategory(val) {
      if (val === 'Туалет') {
        this.indx = 0
      }
      if (val === 'Где поесть') {
        this.organizations = [
          {
            img: '/mcd.jpg',
            title: 'Макдональдс',
            moveTime: '5 мин',
            remainingTime: '41 минута на посещение',
          },
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
      if (organization.title === 'Макдональдс') {
        this.indx = 1
      }
      // TODO: Тут тоже что-то нужно намутить
      // тут тоже обсервер, это норм
      console.log(organization)
    },
  },
}
</script>

<style scoped></style>
