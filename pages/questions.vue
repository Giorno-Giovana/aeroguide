<template>
  <div>
    <div v-if="currentStep !== 4" class="mt-10">
      <img
        src="~/assets/icons/back.svg"
        class="absolute left-5 top-12 h-4 w-4"
        alt=""
        @click="prevStep"
      />
      <h2 class="text-2xl font-bold text-center">{{ currentStep }}/3</h2>
    </div>
    <!--    1    -->
    <div v-if="currentStep === 1" class="question">
      <img src="~/assets/baggage.png" class="image" alt="" />
      <h1 class="header">Вы налегке или с багажем?</h1>
      <div class="container flex justify-around">
        <button class="button secondary" @click="setBaggage(false)">
          Налегке
        </button>
        <button class="button primary" @click="setBaggage(true)">
          Есть багаж
        </button>
      </div>
    </div>
    <!--    2    -->
    <div v-if="currentStep === 2" class="question">
      <img
        src="~/assets/wheelchair.png"
        class="image"
        style="width: 140px"
        alt=""
      />
      <h1 class="header">У вас есть грудные дети?</h1>
      <div class="container flex justify-around">
        <button class="button secondary" @click="setWheelchair(true)">
          Есть
        </button>
        <button class="button primary" @click="setWheelchair(false)">
          Нет
        </button>
      </div>
    </div>
    <!--    3    -->
    <div v-if="currentStep === 3" class="question">
      <img
        src="~/assets/briefcase.png"
        class="image"
        alt=""
        style="width: 120px"
      />
      <h1 class="header">Собираетесь в бизнес зал?</h1>
      <div class="container flex justify-around">
        <button class="button secondary" @click="setBriefcase(true)">Да</button>
        <button class="button primary" @click="setBriefcase(false)">Нет</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Questions',
  data() {
    return {
      currentStep: 1,
      questions: {
        baggage: null,
        wheelchair: null,
        briefcase: null,
      },
    }
  },
  methods: {
    setBaggage(ans) {
      this.questions.baggage = ans
      this.nextQuestion()
    },
    setWheelchair(ans) {
      this.questions.wheelchair = ans
      this.nextQuestion()
    },
    setBriefcase(ans) {
      this.questions.briefcase = ans
      this.nextQuestion()
    },
    nextQuestion() {
      const finalStep = 3
      if (this.currentStep === finalStep) this.endQuestion()
      this.currentStep++
    },
    endQuestion() {
      this.$store.commit('user/setQuestions', this.questions)
      this.$router.push('/floors')
    },
    prevStep() {
      if (this.currentStep === 1) {
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
.image {
  @apply h-32 m-auto mt-28;
}
.header {
  @apply text-center text-2xl mt-12 mb-8 font-medium;
}
.button {
  @apply p-2 w-32 text-lg font-medium rounded-lg;
}
.primary {
  @apply bg-blue-600 text-white;
}
.secondary {
  @apply text-blue-400 border border-blue-400;
}
</style>
