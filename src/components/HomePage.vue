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
                <v-card-title class="text-center" style="font-size: 2rem;">{{ item.liveTitle }}</v-card-title>                <div class="wave-divider"></div>
              </v-col>
              <v-col cols="12" md="8">
                <v-card-text class="live-card-text" style="margin-top: -53px;">
                  <div class="live-card-description mb-2"><strong>説明:</strong> {{ item.liveDescription }}</div>
                  <div class="live-card-meta mb-2"><strong>開始時間:</strong> {{ formatDate(item.startTime) }}</div>
                  <div class="live-card-meta mb-2"><strong>終了時間:</strong> {{ formatDate(item.endTime) }}</div>
                  <div class="live-card-meta mb-2"><strong>場所:</strong> {{ item.liveLocationName }} - {{ item.liveLocationAddress }}</div>
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
        liveTitle: 'The Singer-songwriter',
        liveDescription: 'Rui calls friends 5',
        startTime: '2024-06-01T12:00:00Z',
        endTime: '2024-06-01T16:00:00Z',
        liveLocationName: '梅田 ALWAYS',
        liveLocationAddress: '大阪市北区野崎町6-8トレック梅田ビルビルB1F',
        liveImage: 'live1.png',
      },
      {
        id: 2,
        liveTitle: 'Booking Live',
        liveDescription: 'ふみかず、YUKANIN、ほたる与作、スーキャン',
        startTime: '2024-07-08T18:30:00Z',
        endTime: '2024-07-08T20:30:00Z',
        liveLocationName: 'MUSIC 1',
        liveLocationAddress: '豊中市庄内西町3-3-1第一サンライズビル2F',
        liveImage: 'live2.png',
      },
      {
        id: 3,
        liveTitle: 'Conecting LIVE',
        liveDescription: 'Sound Peace、YUKANIN、スーキョン、若',
        startTime: '2024-07-06T16:00:00Z',
        endTime: '2024-07-06T20:00:00Z',
        liveLocationName: 'MUSIC 1',
        liveLocationAddress: '豊中市庄内西町3-3-1第一サンライズビル2F',
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
// 其他部分保持不變...
.top-fixed-card {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #303030;
  padding: 8px 16px;
  margin-bottom: 8px;
}
.top-card {
  background-color: #222222;
  margin-right: -13px;
}
.live-card {
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  margin-bottom: 8px; /* 調整卡片間距 */
  border-radius: 0; /* 取消卡片的圓角 */
}

.live-image {
  width: 100%;
  border-bottom-left-radius: 16px; /* 保留卡片底部的圓角 */
  border-bottom-right-radius: 16px; /* 保留卡片底部的圓角 */
}

.live-card-text {
  padding: 16px;
}

.live-card-title {
  font-size: 2rem; /* 加大標題字體 */
  font-weight: bold;
  margin-bottom: 4px; /* 減少標題與內容之間的距離 */
  font-family: 'Pacifico', cursive; /* 使用藝術字體 */
}

.live-card-description {
  margin-bottom: 12px; /* 調整描述和其他元信息之間的距離 */
}

.live-card-meta {
  font-size: 0.875rem;
  color: #666;
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