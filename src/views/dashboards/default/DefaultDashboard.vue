<script setup lang="ts">
// imported components
import TotalEarning from './components/TotalEarning.vue';
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <!-- <TotalEarning /> --><TotalEarning />
    </v-col>
    <v-col cols="12" md="4">
      <!-- <TotalOrder /> --><TotalEarning />
    </v-col>
    <v-col cols="12" md="4">
      <!-- <TotalIncome /> --><TotalEarning />
    </v-col>

    <v-col cols="12" lg="8">
      <!-- <TotalGrowth /> --><TotalEarning />
    </v-col>

    <v-col cols="12" lg="4">
      <!-- <PopularStocks /> --><TotalEarning />
    </v-col>
  </v-row>
</template>
