<template>
  <v-container>
    <div class="pull-to-refresh-container" :class="{ active: refreshing }">
      <div class="pull-to-refresh">
        <svg class="fire-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path class="flame" d="M32 2C23.4 10.1 20 16.5 20 26c0 6.9 4.4 12.9 11 15.1V58h2V41.1c6.6-2.2 11-8.2 11-15.1 0-9.5-3.4-15.9-12-24z"/>
        </svg>
      </div>
    </div>

    <v-row class="justify-center mb-4">
      <v-col cols="12">
        <v-btn
          color="primary"
          :style="{ background: buttonBackground }"
          @click="navigateToCreate"
          block
          v-bind:class="{ 'button-transition': buttonTransition }"
        >
        <span class="artistic-font">ライブ</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading && !refreshing" class="justify-center">
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const lives = ref([]);
    const loading = ref(true);
    const refreshing = ref(false);
    const router = useRouter();
    const buttonTransition = ref(false);
    const buttonBackground = ref('linear-gradient(90deg, #3f51b5, #f44336)');

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
        refreshing.value = false;
        buttonTransition.value = true;
        buttonBackground.value = 'linear-gradient(90deg, #f44336, #3f51b5)';
        setTimeout(() => {
          buttonTransition.value = false;
          buttonBackground.value = 'linear-gradient(90deg, #3f51b5, #f44336)';
        }, 500);
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

    // Handle touch event for pull-to-refresh
    const handleTouchStart = (event: TouchEvent) => {
      startY.value = event.touches[0].pageY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (window.scrollY === 0 && event.touches[0].pageY > startY.value) {
        refreshing.value = true;
      }
    };

    const handleTouchEnd = () => {
      if (refreshing.value) {
        refreshLives();
      }
    };

    const startY = ref(0);

    // Lifecycle hook: fetch live events on component mount
    onMounted(() => {
      fetchLiveEvents();
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    });

    // Remove touch event listener on unmount
    onUnmounted(() => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    });

    return {
      lives,
      loading,
      refreshing,
      formatDate,
      navigateToCreate,
      refreshLives,
      buttonTransition,
      buttonBackground,
    };
  },
});
</script>

<style scoped lang="scss">
/* 添加对Google Fonts的引用 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

/* 艺术字体样式 */
.artistic-font {
  font-family: 'Hannari Mincho', sans-serif; /* 使用Google Fonts中的Roboto字体 */
  font-weight: 500; /* 可根据需要调整字体粗细 */
  font-size: 1.5rem; /* 可根据需要调整字体大小 */
  /* 可以继续添加其他样式，如颜色、字间距等 */
}
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

.v-container {
  max-width: 600px;
}

.v-col {
  display: flex;
  justify-content: center;
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
  margin-bottom: 16px;
}

.v-btn {
  width: 100%;
}

.button-transition {
  transition: background 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>