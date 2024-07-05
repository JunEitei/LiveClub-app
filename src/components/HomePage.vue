<template>
  <v-container>
    <div class="pull-to-refresh-container" :class="{ active: refreshing }">
      <div class="pull-to-refresh">
        <svg class="fire-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path class="flame" d="M32 2C23.4 10.1 20 16.5 20 26c0 6.9 4.4 12.9 11 15.1V58h2V41.1c6.6-2.2 11-8.2 11-15.1 0-9.5-3.4-15.9-12-24z"/>
        </svg>
      </div>
    </div>

    <v-row v-if="loading && !refreshing" class="justify-center mb-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12" v-for="(item, index) in lives" :key="item.id">
        <v-card class="live-card">
          <v-row align="center">
            <v-col cols="12" md="4">
              <v-img :src="item.image" alt="Live Image" class="live-image"></v-img>
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title class="text-center artistic-font">{{ item.liveTitle }}</v-card-title>
              <v-card-text class="artistic-font">
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
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
    const refreshing = ref(false);
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
        refreshing.value = false;
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

    // Refresh live events
    const refreshLives = async () => {
      refreshing.value = true;
      await fetchLiveEvents();
    };

    // Lifecycle hook: fetch live events on component mount
    onMounted(() => {
      fetchLiveEvents();
    });

    // Remove touch event listener on unmount
    onUnmounted(() => {
      // Remove any event listeners if needed
    });

    return {
      lives,
      loading,
      refreshing,
      formatDate,
      navigateToCreate,
      refreshLives,
    };
  },
});
</script>

<style scoped lang="scss">
/* 添加对Google Fonts的引用 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

/* 艺术字体样式 */
.artistic-font {
  font-family: 'Roboto', sans-serif; /* 使用Google Fonts中的Roboto字体 */
  font-weight: 500; /* 可根据需要调整字体粗细 */
  font-size: 1.5rem; /* 可根据需要调整字体大小 */
  /* 可以继续添加其他样式，如颜色、字间距等 */
}

.live-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 调整阴影效果 */
  border-radius: 20px; /* 调整圆角 */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* 添加阴影过渡效果 */
  min-height: 200px; /* 调整最小高度 */
  margin-bottom: 24px; /* 调整底部边距 */

  &:hover {
    transform: scale(1.03); /* 调整鼠标悬停时的缩放效果 */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); /* 调整鼠标悬停时的阴影效果 */
  }
}

.v-container {
  max-width: 800px; /* 调整容器的最大宽度 */
}

.v-img.live-image {
  width: 100%;
  height: 100%; /* 调整图片高度 */
  object-fit: cover; /* 图片填充方式 */
  border-top-left-radius: 20px; /* 调整左上角圆角 */
  border-bottom-left-radius: 20px; /* 调整左下角圆角 */
}

.v-card {
  width: 100%;
}

.pull-to-refresh-container {
  position: absolute;
  top: -120px; /* 调整火焰图标位置 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.pull-to-refresh-container.active {
  top: -100px; /* 调整活动状态下的位置 */
  opacity: 1;
}

.pull-to-refresh {
  width: 60px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.fire-icon {
  width: 30px;
  height: 30px;
}

.flame {
  fill: orange;
  animation: burn 1s infinite;
}

@keyframes burn {
  0% {
    transform: scaleY(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.8);
    opacity: 0.8;
  }
}

.mb-4 {
  margin-bottom: 24px; /* 调整底部边距 */
}

.v-btn {
  width: 100%;
}

.button-transition {
  transition: background 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>