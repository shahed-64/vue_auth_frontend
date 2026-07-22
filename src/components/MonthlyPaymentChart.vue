<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
})

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const chartData = computed(() => {
  const values = new Array(12).fill(0)

  props.payments.forEach((item) => {
    values[item.month - 1] = item.total
  })

  return {
    labels,
    datasets: [
      {
        label: 'Monthly Collection',
        data: values,
        backgroundColor: '#0d6efd',
        borderRadius: 8,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
