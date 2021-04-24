<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  mounted() {
    const DG = require('2gis-maps')
    const map = DG.map('map', {
      center: [54.98, 82.89],
      zoom: 13,
    })
  },
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
