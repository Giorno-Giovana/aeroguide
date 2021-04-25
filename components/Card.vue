<template>
  <div class="mt-6" @click="choose">
    <img :src="organization.img" class="h-40 object-cover rounded-xl" alt="" />
    <div class="flex justify-between mt-2" style="max-width: 380px">
      <h3 class="block font-bold text-xl">{{ organization.title }}</h3>
      <div class="flex align-middle pt-1">
        <img src="~/assets/icons/man.svg" class="w-4 h-4" alt="" />
        <div class="w-14 text-sm">{{ organization.moveTime }}</div>
      </div>
    </div>
    <div class="text-gray-400" style="margin-top: -10px">
      {{ organization.remainingTime }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    organization: {
      type: Object,
      required: true,
    },
  },
  methods: {
    choose() {
      this.$emit('choose', this.organization)
    },
  },
}
</script>
