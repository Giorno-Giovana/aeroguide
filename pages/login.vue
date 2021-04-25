<template>
  <div class="mt-10 p-4">
    <h1 class="text-5xl font-bold">АэроГид</h1>
    <ul class="mt-8 text-gray-500 text-lg">
      <li class="flex">
        <img src="~/assets/icons/plane.png" class="list-icon" alt="" />
        Мы не дадим вам пропустить рейс
      </li>
      <li class="flex">
        <img src="~/assets/icons/shop.svg" class="list-icon" alt="" />
        Покажем ближайшие магазины
      </li>
      <li class="flex">
        <img src="~/assets/icons/exit.svg" class="list-icon" alt="" />
        Укажем на выход к самолёту
      </li>
      <li class="flex">
        <img src="~/assets/icons/dosug.svg" class="list-icon" alt="" />
        Скрасим досуг перед вылетом
      </li>
      <li class="flex">
        <img src="~/assets/icons/more.svg" class="list-icon" alt="" />
        И многое, многое другое
      </li>
    </ul>

    <!--  Способ входа  -->
    <!--  Дефоолт  -->
    <div v-if="loginOption === null" class="container">
      <h2 class="text-2xl font-semibold">Выберите способ входа</h2>
      <button class="button" @click="loginOption = 'race'">
        По номеру рейса
      </button>
      <button class="button" @click="loginOption = 'city'">
        По городу прилёта
      </button>
      <button class="button" @click="loginOption = 'time'">
        По времени отправления
      </button>
    </div>

    <!--  Номер рейса  -->
    <div v-if="loginOption === 'race'" class="container">
      <h2 class="text-2xl font-semibold">Введите номер рейса</h2>
      <input
        v-model="loginValue"
        type="text"
        class="rect pl-6 border text-lg"
        placeholder="Номер рейса"
      />
      <button class="button" @click="enter('race')">Войти</button>
      <button class="rect border border-blue-600 text-blue-500" @click="back">
        Назад
      </button>
    </div>
    <!--  Город  -->
    <div v-if="loginOption === 'city'" class="container">
      <h2 class="text-2xl font-semibold">Введите город прилёта</h2>
      <input
        v-model="loginValue"
        type="text"
        class="rect pl-6 border text-lg"
        placeholder="Город прилёта"
      />
      <button class="button" @click="enter('city')">Войти</button>
      <button class="rect border border-blue-600 text-blue-500" @click="back">
        Назад
      </button>
    </div>
    <!--  Время  -->
    <div v-if="loginOption === 'time'" class="container">
      <h2 class="text-2xl font-semibold">Введите время вылета</h2>
      <input
        v-model="loginValue"
        type="text"
        class="rect pl-6 border text-lg"
        placeholder="Время вылета"
      />
      <button class="button" @click="enter('time')">Войти</button>
      <button class="rect border border-blue-600 text-blue-500" @click="back">
        Назад
      </button>
    </div>
    <nuxt-link to="/howitworks" class="text-lg m-auto block mt-8 text-center">
      Как это работает?
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginOption: null,
      loginValue: '',
    }
  },
  methods: {
    enter(type) {
      switch (type) {
        case 'race':
          this.$store.commit('user/setRace', this.loginValue)
          break
        case 'city':
          this.$store.commit('user/setCity', this.loginValue)
          break
        case 'time':
          this.$store.commit('user/setDepartureTime', this.loginValue)
          break
      }
      this.$router.push('/choose-race')
    },
    back() {
      this.loginOption = null
    },
  },
}
</script>

<style scoped>
.list-icon {
  @apply w-6 h-6 mr-3;
}
/*.input-field {*/
/*  @apply h-14 border placeholder-black text-center rounded-xl;*/
/*}*/
/*.list-item {*/
/*  @apply self-center flex;*/
/*}*/
.button {
  @apply w-full h-12 rounded-lg bg-blue-600 text-white text-lg mt-4;
}
.rect {
  @apply w-full h-12 rounded-lg text-lg mt-4;
}
</style>
