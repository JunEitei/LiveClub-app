<template>
  <v-container>
    <!-- Top fixed card -->
    <v-container class="top-fixed-card">
      <v-row align="center">
        <v-col cols="2" class="avatar-container">
          <!-- Clickable avatar image -->
          <v-avatar size="64" class="avatar" @click="openFileInput">
            <v-img :src="avatarSrc" alt="Avatar"></v-img>
          </v-avatar>
          <!-- Hidden file input -->
          <input ref="fileInput" type="file" accept="image/*" style="position: absolute; opacity: 0; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer;" @change="handleAvatarChange">
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
                <v-card-title class="text-center" style="font-size: 2rem;">{{ item.liveTitle }}</v-card-title>
                <div class="wave-divider"></div>
              </v-col>
              <v-col cols="12" md="8">
                <v-card-text class="live-card-text">
                  <div class="live-card-description mb-2"><strong>説明:</strong> {{ item.liveDescription }}</div>
                  <div class="live-card-meta mb-2"><strong>開始時間:</strong> {{ formatDate(item.startTime) }}</div>
                  <div class="live-card-meta mb-2"><strong>終了時間:</strong> {{ formatDate(item.endTime) }}</div>
                  <div class="live-card-meta mb-2"><strong>場所:</strong> {{ item.liveLocationName }} - {{ item.liveLocationAddress }}</div>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="4" class="text-right">
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
  liveImage: string;
}

interface Instrument {
  id: number;
  name: string;
  icon: string;
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
    const avatarSrc = ref<string>('/assets/avatar.png'); // 初始头像路径
    const instruments = ref<Instrument[]>([
      { id: 1, name: 'Drums', icon: '@/assets/drum.svg' },
      { id: 2, name: 'Guitar', icon: '@/assets/guitar.svg' },
      { id: 3, name: 'Bass', icon: '@/assets/bass.svg' },
      { id: 4, name: 'Keyboard', icon: '@/assets/keyboard.svg' },
    ]);
    const selectedInstrument = ref<number | null>(1); // 初始选中的乐器ID

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

    const handleAvatarChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            avatarSrc.value = e.target.result;
            // Save to localStorage or other caching mechanism
            localStorage.setItem('avatar', avatarSrc.value);
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    };

    const openFileInput = () => {
      const fileInput = (this.$refs.fileInput as HTMLInputElement);
      fileInput.click();
    };

    const selectInstrument = (instrumentId: number) => {
      selectedInstrument.value = instrumentId;
      // Save selected instrument to localStorage or other caching mechanism
      localStorage.setItem('selectedInstrument', JSON.stringify(instrumentId));
    };

    onMounted(() => {
      // Load cached avatar and selected instrument on component mount
      const cachedAvatar = localStorage.getItem('avatar');
      const cachedInstrument = localStorage.getItem('selectedInstrument');
      if (cachedAvatar) {
        avatarSrc.value = cachedAvatar;
      }
      if (cachedInstrument) {
        selectedInstrument.value = JSON.parse(cachedInstrument);
      }
    });

    return {
      lives,
      avatarSrc,
      instruments,
      selectedInstrument,
      formatDate,
      getLiveImage,
      navigateToCreatePage,
      openFileInput,
      handleAvatarChange,
      selectInstrument,
    };
  },
});
</script>

<style scoped lang="scss">
.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  cursor: pointer;
  position: relative;
}

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
  margin-bottom: 16px;
  background-color: #222222;
  }
  
  .live-image {
  width: 100%;
  height: auto;
  border-radius: 4px 4px 0 0;
  }
  
  .live-card-text {
  color: #ffffff;
  padding: 16px;
  }
  
  .live-card-description {
  font-size: 1rem;
  }
  
  .live-card-meta {
  font-size: 0.875rem;
  }
  
  .position-card {
  background-color: #222222;
  padding: 16px;
  border-radius: 8px;
  }
  
  .position-title {
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: 8px;
  }
  
  .instrument-button {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  }
  
  .instrument-button.selected {
  background-color: #33b5e5;
  border-radius: 50%;
  }
  
  .wave-divider {
  height: 1px;
  background: linear-gradient(
  to right,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 0.8) 50%,
  rgba(255, 255, 255, 0) 100%
  );
  margin: 16px 0;
  }
</style>