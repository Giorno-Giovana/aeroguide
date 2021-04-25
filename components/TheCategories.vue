<template>
  <div style="margin-bottom: -10px">
    <horizontal-scroll class="mt-2 mb-2 flex rofl">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="first:ml-0 ml-3 border rounded-lg p-1 pl-2 pr-2 bg-gray-200"
        @click="setCategory(category)"
      >
        {{ category }}
      </div>
    </horizontal-scroll>
    <div class="flex relative">
      <input
        :value="value"
        type="text"
        placeholder='Например "duty free"'
        class="border w-full p-4 h-9 rounded-xl pl-12 text-lg font-light"
        @input="emitInput"
      />
      <div class="absolute left-3 top-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'

export default {
  name: 'TheCategories',
  components: {
    HorizontalScroll,
  },
  props: {
    value: { type: String, default: '' },
  },
  data() {
    return {
      categories: null,
    }
  },
  mounted() {
    // TODO их нужно получать динамически
    this.categories = [
      'Поблизости',
      'Туалет',
      'Где поесть',
      'Кофе',
      'Burger King',
    ]
  },
  methods: {
    setCategory(category) {
      this.$emit('input', category)
    },
    emitInput(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style scoped>
.first\:ml\-0:first-child {
  margin-left: 0;
}
::-webkit-scrollbar {
  display: none;
}
</style>
