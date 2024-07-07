<template>
  <div>
    <!-- Top fixed card -->
    <v-container class="top-fixed-card" @click="navigateToCreatePage">
      <v-row align="center">
        <v-col cols="2">
          <v-avatar size="64">
            <v-img src="/assets/avatar.png" alt="Avatar"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="10">
          <v-card class="top-card" tile>
            <v-card-text>
              <h2>Welcome back, 大毛!</h2>
              <p>楽しんで、なくなるまで～</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Existing live event cards -->
    <v-container>
      <v-row>
        <v-col cols="12" v-for="(item) in lives" :key="item.id">
          <v-card class="live-card">
            <v-row align="center">
              <v-col cols="12">
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
  </div>
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
  liveImage: string;
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
        liveImage: 'live1.png',
      },
      {
        id: 2,
        liveTitle: 'Sample Live Event 2',
        liveDescription: 'Sample description for event 2',
        startTime: '2024-07-08T18:30:00Z',
        endTime: '2024-07-08T20:30:00Z',
        liveLocationName: 'Sample Venue 2',
        liveLocationAddress: 'Sample Address 2',
        liveImage: 'live2.png',
      },
      {
        id: 3,
        liveTitle: 'Sample Live Event 3',
        liveDescription: 'Sample description for event 3',
        startTime: '2024-07-09T18:00:00Z',
        endTime: '2024-07-09T20:00:00Z',
        liveLocationName: 'Sample Venue 3',
        liveLocationAddress: 'Sample Address 3',
        liveImage: 'live3.png',
      },
    ]);
    const router = useRouter();

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

    const getLiveImage = (imageName: string) => `/assets/${imageName}`;

    const navigateToCreatePage = () => {
      router.push('/create');
    };

    onMounted(() => {
      // Fetch live events if needed
    });

    return {
      lives,
      formatDate,
      getLiveImage,
      navigateToCreatePage,
    };
  },
});
</script>

<style scoped lang="scss">
.top-fixed-card {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(to right, #ff9966, #ff5e62); /* 添加渐变背景 */
  padding: 8px 16px; /* 调整padding来降低卡片高度 */
  margin-bottom: 8px; /* 添加一些底部间距 */
}

.top-card {
  background-color: inherit;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.top-card v-avatar {
  border: 3px solid white;
}

.live-card {
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  margin-bottom: 8px; /* 调整卡片间距 */
  border-radius: 0; /* 取消卡片的圆角 */
}

.live-image {
  width: 100%;
  border-bottom-left-radius: 16px; /* 保留卡片底部的圆角 */
  border-bottom-right-radius: 16px; /* 保留卡片底部的圆角 */
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