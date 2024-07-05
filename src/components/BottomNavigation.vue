<!-- BottomNavigation.vue -->
<template>
    <v-bottom-navigation color="primary">
      <v-btn icon block :to="{ name: 'Home' }" :class="{ 'active': isCurrentRoute('Home') }">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon block :to="{ name: 'Creator' }" :class="{ 'active': isCurrentRoute('Creator') }">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
  
      // Function to check if the current route matches the given route name
      const isCurrentRoute = (routeName: string) => {
        return route.name === routeName;
      };
  
      return {
        isCurrentRoute,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Add scoped styles if needed */
  
  /* Ensure active color */
  .v-btn.active .v-icon,
  .v-btn.active span {
    color: orange !important; /* Important to override other styles */
  }
  
  /* Adjust the width of the buttons */
  .v-btn {
    width: 50%; /* Ensure both buttons take up half the width */
  }
  
  /* Increase icon size */
  .v-btn .v-icon {
    font-size: 3rem;
  }
  
  </style>