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

export default {
  name: 'Feed',
  components: {
    TheCategories,
    ThePopup,
    Card,
  },
  data() {
    return {
      currentCategory: '',
      organizations: [
        {
          img: '/bk.png',
          title: 'Burger King',
          moveTime: '2 мин',
          remainingTime: '44 минуты на посещение',
        },
        {
          img: '/kartoshka.png',
          title: 'Крошка картошка',
          moveTime: '2 мин',
          remainingTime: '44 минуты на посещение',
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
          moveTime: '2 мин',
          remainingTime: '44 минуты на посещение',
        },
      ],
    }
  },
  watch: {
    currentCategory(val) {
      // TODO для дебага
      console.log(val)
    },
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
