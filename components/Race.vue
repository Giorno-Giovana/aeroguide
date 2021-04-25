<template>
  <div class="w-full m-auto border-b race mb-5 pb-5" @click="choose">
    <div class="flex justify-center">
      <img src="~/assets/icons/plane.png" class="mr-2 mt-1 h-5 w-5" alt="" />
      <h2 class="text-2xl">
        {{ race.race }} {{ race.from.city }} - {{ race.to.city }}
      </h2>
    </div>
    <div class="flex justify-between pr-3 pl-3">
      <div class="city">
        <div class="time">{{ race.from.time }}</div>
        <div class="airport" style="margin-top: -8px">
          {{ race.from.airport }}
        </div>
      </div>
      <div class="city">
        <div class="time">{{ race.to.time }}</div>
        <div class="airport" style="margin-top: -8px">
          {{ race.to.airport }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Race',
  props: {
    race: {
      required: true,
      type: Object,
    },
  },
  methods: {
    choose() {
      this.$emit('choose', this.race)
    },
  },
}
</script>

<style scoped>
.time {
  @apply font-bold text-lg;
}
.airport {
  @apply text-lg;
}
.race:last-child {
  border-bottom: none;
}
</style>
