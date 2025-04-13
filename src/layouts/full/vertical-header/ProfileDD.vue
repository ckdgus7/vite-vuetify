<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
// import { ref } from 'vue';
import { LogoutIcon, SettingsIcon } from 'vue-tabler-icons';

const authStore = useAuthStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 class="mb-n1">
      Good Morning, <span class="font-weight-regular">John Doe</span>
    </h4>
    <span class="text-subtitle-2 text-medium-emphasis">Project admin</span>

    <v-text-field
      persistent-placeholder
      placeholder="Search"
      class="my-3"
      color="primary"
      variant="outlined"
      hide-details
    >
      <template v-slot:prepend-inner>
        <SearchIcon
          stroke-width="1.5"
          size="20"
          class="text-lightText SearchIcon"
        />
      </template>
    </v-text-field>

    <v-divider></v-divider>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 515px">
      <v-list class="mt-3">
        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2">
            Account Settings</v-list-item-title
          >
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="md">
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
