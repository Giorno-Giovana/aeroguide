<template>
  <div class="flex flex-col mt-20">
    <div class="flex justify-center">
      <h1 class="text-3xl">Ваш Аэрогид</h1>
    </div>
    <ul class="m-auto mt-12 list-disc">
      <li>Мы не дадим вавм пропустить рейс</li>
      <li>Покажем ближайшие магазины</li>
      <li>Укажем на ваш выход к самолёту</li>
      <li>Скрасим досуг перед вылетом</li>
      <li>И многое, многое другое</li>
    </ul>
    <div class="w-60 m-auto mt-32 flex flex-col">
      <input
        v-model="trackNumber"
        type="text"
        placeholder="Введитие номер рейса"
        class="h-14 border placeholder-black text-center rounded-xl"
      />
      <button class="h-14 mt-3 border rounded-xl bg-gray-300">Войти</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trackNumber: '',
    }
  },
}
</script>

<style scoped></style>
