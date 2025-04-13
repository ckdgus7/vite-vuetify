<script setup lang="ts">
import { RouterView } from 'vue-router';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
</script>

<template>
  <v-locale-provider>
    <v-app theme="PurpleTheme" :class="['Roboto', 'mini-sidebar', 'inputWithbg']">
      <VerticalSidebarVue />
      <VerticalHeaderVue />

      <v-main>
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
          </div>
        </v-container>
        <!-- <v-container fluid class="pt-0">
          <div>
            <FooterPanel />
          </div>
        </v-container> -->
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
