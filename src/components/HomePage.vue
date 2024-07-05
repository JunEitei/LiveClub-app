<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(item, index) in lives" :key="item.id">
        <v-card class="live-card">
          <v-row align="center">
            <v-col cols="12" md="4">
              <v-img :src="item.image" alt="Live Image" class="live-image"></v-img>
              <div class="wave-divider"></div> <!-- 加入這一行 -->
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title class="text-center">{{ item.liveTitle }}</v-card-title>
              <v-card-text>
                <div><strong>Description:</strong> {{ item.liveDescription }}</div>
                <div><strong>Start Time:</strong> {{ formatDate(item.startTime) }}</div>
                <div><strong>End Time:</strong> {{ formatDate(item.endTime) }}</div>
                <div><strong>Location:</strong> {{ item.liveLocationName }} - {{ item.liveLocationAddress }}</div>
                <div><strong>Link:</strong> <a :href="item.liveLink" target="_blank">{{ item.liveLink }}</a></div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface LiveEvent {
  id: number;
  liveTitle: string;
  liveDescription: string;
  startTime: string;
  endTime: string;
  liveLocationName: string;
  liveLocationAddress: string;
  liveLink: string;
  image: string;
}

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const lives = ref<LiveEvent[]>([]);
    const loading = ref(true);
    const router = useRouter();

    // Fetch live events from backend
    const fetchLiveEvents = async () => {
      try {
        const response = await fetch(`${apiUrl}/live/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch live events');
        }
        const data = await response.json();
        lives.value = data.data.map((item: any) => ({
          id: item.id,
          liveTitle: item.liveTitle,
          liveDescription: item.liveDescription,
          startTime: item.startTime,
          endTime: item.endTime,
          liveLocationName: item.liveLocationName,
          liveLocationAddress: item.liveLocationAddress,
          liveLink: item.liveLink,
          image: item.image ? item.image : 'https://via.placeholder.com/200x200.png?text=Sample+Image'
        }));
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

    // Navigate to create live event page
    const navigateToCreate = () => {
      router.push({ name: 'Creator' });
    };

    // Lifecycle hook: fetch live events on component mount
    onMounted(() => {
      fetchLiveEvents();
    });

    return {
      lives,
      loading,
      formatDate,
      navigateToCreate,
    };
  },
});
</script>

<style scoped lang="scss">
.live-card {
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 33px;
  transition: transform 0.3s ease-in-out;
  min-height: 100px;
  margin-bottom: 16px;
}

.v-img.live-image {
  position: relative;
  width: 100%;
  border-top-left-radius: 33px;
  border-bottom-left-radius: 33px;
}

.wave-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateY(50%);
}
</style>