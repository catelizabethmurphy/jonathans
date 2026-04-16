<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { DataRow } from './components'

const dataArray = ref([])

onMounted(async () => {
  const parseDate = d3.timeParse('%-m/%-d/%Y %I:%M:%S %p')

  const lines = await d3.csv('./balt_311.csv')
  const processed = lines.map(d => ({
    // ...d,
    Agency: d.Agency.trim(),
    CreatedDate: parseDate(d.CreatedDate),
    CloseDate: parseDate(d.CloseDate),
    DueDate: parseDate(d.DueDate),
    StatusDate: parseDate(d.StatusDate),
    Latitude: +d.Latitude,
    Longitude: +d.Longitude,
    PoliceDistrict: d.PoliceDistrict.trim(),
    PolicePost: d.PolicePost.trim(),
    Neighborhood: d.Neighborhood.trim(),
    ZipCode: d.ZipCode.trim()
  }))

  // setTimeout(() => {
    dataArray.value = processed
  //   console.log('Processed data:', processed)
  // }, 2000)
  
})
</script>

<template>
  <div class="container">
    <h1>311 Calls in Baltimore city</h1>
    <p>Explore calls made in 2025</p>
    <div v-if="dataArray.length > 0">
      <p>Data loaded: {{ dataArray.length }} records</p>
    </div>
    <DataRow 
      v-for="(data, index) in dataArray.slice(0, 5)" 
      :key="index" 
      :data="data"
    />
  </div>
</template>

<style scoped>
.container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
  max-width: 90rem;
  margin: 0 auto;
}

h1 {
  color: #000000;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #000000;
}
</style>
