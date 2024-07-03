<template>
  <v-container>
    <v-row v-if="loading" class="justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12" v-for="(item, index) in lives" :key="item.id">
        <v-card class="live-card">
          <v-card-title class="text-center">{{ item.liveTitle }}</v-card-title>
          <v-card-text>
            <div><strong>Description:</strong> {{ item.liveDescription }}</div>
            <div><strong>Start Time:</strong> {{ formatDate(item.startTime) }}</div>
            <div><strong>End Time:</strong> {{ formatDate(item.endTime) }}</div>
            <div><strong>Location:</strong> {{ item.liveLocationName }} - {{ item.liveLocationAddress }}</div>
            <div><strong>Link:</strong> <a :href="item.liveLink" target="_blank">{{ item.liveLink }}</a></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const lives = ref([]);
    const loading = ref(true);

    // Fetch live events from backend
    const fetchLiveEvents = async () => {
      try {
        const response = await fetch(`${apiUrl}/live/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch live events');
        }
        const data = await response.json();
        lives.value = data.data;
      } catch (error) {
        console.error('Error fetching live events:', error);
      } finally {
        loading.value = false;
      }
    };

    // Format date
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Lifecycle hook: fetch live events on component mount
    onMounted(fetchLiveEvents);

    return {
      lives,
      loading,
      formatDate,
    };
  },
});
</script>

<style scoped lang="scss">
.live-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 33px;
  transition: transform 0.3s ease-in-out;
  min-height: 100px;
  margin-bottom: 16px;

  &:hover {
    transform: scale(1.02);
  }
}

.bottom-spacing {
  height: 70px;
}

.v-col {
  display: flex;
  justify-content: center;
}

.v-card {
  width: 100%;
}
</style>