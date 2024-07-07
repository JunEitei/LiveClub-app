<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(item) in lives" :key="item.id">
        <v-card class="live-card">
          <v-row align="center">
            <v-col cols="12">
              <!-- Place v-img above v-card-title for vertical alignment -->
              <v-img :src="getLiveImage(item.liveImage)" alt="Live Image" class="live-image"></v-img>
              <v-card-title class="text-center">{{ item.liveTitle }}</v-card-title>
              <div class="wave-divider"></div>
            </v-col>
            <v-col cols="12" md="8">
              <v-card-text>
                <div class="mb-2"><strong>Description:</strong> {{ item.liveDescription }}</div>
                <div class="mb-2"><strong>Start Time:</strong> {{ formatDate(item.startTime) }}</div>
                <div class="mb-2"><strong>End Time:</strong> {{ formatDate(item.endTime) }}</div>
                <div class="mb-2"><strong>Location:</strong> {{ item.liveLocationName }} - {{ item.liveLocationAddress }}</div>
                <!-- Link removed -->
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
  liveImage: string; // 添加 liveImage 属性
}

export default defineComponent({
  setup() {
    const lives = ref<LiveEvent[]>([
      {
        id: 1,
        liveTitle: 'Sample Live Event 1',
        liveDescription: 'Sample description for event 1',
        startTime: '2024-07-07T19:00:00Z',
        endTime: '2024-07-07T21:00:00Z',
        liveLocationName: 'Sample Venue 1',
        liveLocationAddress: 'Sample Address 1',
        liveImage: 'live1.png', // 图片文件名
      },
      {
        id: 2,
        liveTitle: 'Sample Live Event 2',
        liveDescription: 'Sample description for event 2',
        startTime: '2024-07-08T18:30:00Z',
        endTime: '2024-07-08T20:30:00Z',
        liveLocationName: 'Sample Venue 2',
        liveLocationAddress: 'Sample Address 2',
        liveImage: 'live2.png', // 图片文件名
      },
      {
        id: 3,
        liveTitle: 'Sample Live Event 2',
        liveDescription: 'Sample description for event 2',
        startTime: '2024-07-08T18:30:00Z',
        endTime: '2024-07-08T20:30:00Z',
        liveLocationName: 'Sample Venue 2',
        liveLocationAddress: 'Sample Address 2',
        liveImage: 'live3.png', // 图片文件名
      },
    ]);
    const router = useRouter();

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

    // Function to get the correct path for live image
    const getLiveImage = (imageName: string) => `/assets/${imageName}`;

    // Lifecycle hook: fetch live events on component mount
    onMounted(() => {
      // Removed fetchLiveEvents(); as backend connection is removed
    });

    return {
      lives,
      formatDate,
      navigateToCreate,
      getLiveImage,
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

.text-center {
  margin-bottom: 12px;
  font-weight: bold;
}
</style>