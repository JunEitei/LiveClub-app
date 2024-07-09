<template>
  <v-card class="top-fixed-card">
    <v-row align="center">
      <v-col cols="3" class="avatar-container">
        <!-- 可點擊的頭像圖片 -->
        <v-avatar size="64" class="avatar" @click="openFileInput">
          <v-img :src="avatarSrc" alt="Avatar"></v-img>
        </v-avatar>
        <!-- 隱藏的檔案輸入 -->
        <input ref="fileInput" type="file" accept="image/*"
          style="position: absolute; opacity: 0; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer;"
          @change="handleAvatarChange">
      </v-col>
      <v-col cols="9" class="centered-column">
        <v-combobox v-model="selectedInstrument" :items="instruments" label="弾かんといてんの？" style="margin-right: 13px;">
          <template v-slot:selection="data">
            <v-chip v-if="data.item.title && selectedInstrument !== ''" :key="JSON.stringify(data.item)" size="small">
              <template v-slot:prepend>
                <v-avatar class="bg-accent text-uppercase instrument-avatar" start>
                  <v-img :src="getInstrumentIcon(data.item.title)" class="instrument-icon" alt="Icon"></v-img>
                </v-avatar>
              </template>
              <span class="chip-title">{{ data.item.title }}</span>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
  </v-card>
  <!-- Existing live event cards -->
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(item) in lives" :key="item.id">
        <v-card class="live-card">
          <v-row align="center">
            <v-col cols="12">
              <v-img :src="getLiveImage(item.liveImage)" alt="Live Image" class="live-image"></v-img>
              <v-card-title class="text-center" style="font-size: p2rem;">{{ item.liveTitle }}</v-card-title>
              <div class="wave-divider"></div>
            </v-col>
            <v-col cols="12" md="8">
              <v-card-text class="live-card-text">
                <div class="live-card-description mb-2"><strong>説明:</strong> {{ item.liveDescription }}</div>
                <div class="live-card-meta mb-2"><strong>開始時間:</strong> {{ formatDate(item.startTime) }}</div>
                <div class="live-card-meta mb-2"><strong>終了時間:</strong> {{ formatDate(item.endTime) }}</div>
                <div class="live-card-meta mb-2"><strong>場所:</strong> {{ item.liveLocationName }} - {{
                  item.liveLocationAddress }}</div>
              </v-card-text>
            </v-col>
            <v-col cols="12" md="4" class="text-right">
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
// Import the icons
import relaxIcon from '@/assets/relax.svg';
import drumIcon from '@/assets/drum.svg';
import keyboardIcon from '@/assets/keyboard.svg';
import guitarIcon from '@/assets/guitar.svg';
import percussionIcon from '@/assets/percussion.svg';
import bassIcon from '@/assets/bass.svg';
import vocalIcon from '@/assets/vocal.svg';

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
    const selectedInstrument = ref<string>(''); // 定义为 ref 类型，并初始化为空字符串
    const instruments = ref<string[]>(['ギター', 'キーボード', 'ベース', 'ドラム', 'パーカッション', 'ボーカル']);
    const fileInput = ref<HTMLInputElement | null>(null);

    watch(selectedInstrument, (newValue, oldValue) => {
      console.log('selectedInstrument changed:', newValue);
      // Check if newValue is not in instruments array
      if (!instruments.value.includes(newValue)) {
        selectedInstrument.value = ''; // Clear selectedInstrument
      } else{

              // ...

      }
    });

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

    const getInstrumentIcon = (instrument: string) => {
      const instrumentIcons: { [key: string]: string } = {
        'ドラム': drumIcon,
        'キーボード': keyboardIcon,
        'ギター': guitarIcon,
        'パーカッション': percussionIcon,
        'ベース': bassIcon,
        'ボーカル': vocalIcon,
      };
      return instrumentIcons[instrument] || '';
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
      if (fileInput.value) {
        fileInput.value.click(); // Accessing the file input using .value
      }
    };


    onMounted(() => {
      // Load cached avatar and selected instrument on component mount
      const cachedAvatar = localStorage.getItem('avatar');
      if (cachedAvatar) {
        avatarSrc.value = cachedAvatar;
      }
    });

    return {
      lives,
      avatarSrc,
      instruments,
      selectedInstrument,
      getInstrumentIcon,
      formatDate,
      getLiveImage,
      openFileInput,
      handleAvatarChange
    };
  },
});
</script>

<style scoped lang="scss">

.chip-title {
  font-size: 18px;
  font-weight: lighter;
}
.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  margin-left: 13px;
  cursor: pointer;
  position: relative;
}

.top-fixed-card {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(to right, var(--gradient-start), var(--gradient-end));
}

.centered-column {
  display: flex;
  margin-top: 19px;
}

.instrument-avatar {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 设置高度以便垂直居中 */
}

.instrument-icon {
  width: auto;
  /* 自动调整宽度 */
  height: auto;
  /* 自动调整高度 */
  max-width: 100%;
  /* 最大宽度100%保持比例 */
  max-height: 100%;
  /* 最大高度100%保持比例 */
  object-fit: contain;
  /* 保持图标比例 */
  margin-top: -3px;
}

/* 覆盖 Vuetify 的样式，使得 v-combobox 在垂直居中和保持在行的中间 */
.v-combobox {
  margin-top: auto;
  margin-bottom: auto;
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

.wave-divider {
  height: 1px;
  background: linear-gradient(to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%);
  margin: 16px 0;
}</style>