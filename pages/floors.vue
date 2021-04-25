<template>
  <div>
    <h1 class="text-center text-xl font-semibold mt-20">На каком вы этаже?</h1>
    <div class="floor" @click="handleFloorClick(1)">1</div>
    <div class="floor" @click="handleFloorClick(2)">2</div>
    <div class="floor" @click="handleFloorClick(3)">3</div>
  </div>
</template>

<script>
export default {
  name: 'Floors',
  methods: {
    handleFloorClick(floor) {
      this.$store.commit('user/setFloor', floor)
      this.$router.push('/feed')
    },
  },
}
</script>

<style scoped>
.floor {
  @apply m-auto mt-10 rounded-full text-5xl text-black h-24 w-24 flex items-center justify-center border border-4 border-black;
}
</style>
