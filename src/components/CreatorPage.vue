<template>
  <v-container>
    <!-- Cached Data Card -->
    <v-card v-if="showCachedData" class="cached-data-card mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="2">
            <v-img :src="cachedData.photoPreview" alt="Cached Photo" max-width="80"></v-img>
          </v-col>
          <v-col cols="10">
            <div>{{ cachedData.selectedPosition }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- First Card: Upload Photo -->
    <v-card class="card-container" @click="openFilePicker">
      <v-form @submit.prevent="createLiveEvent" class="form-container">
        <div class="upload-container">
          <v-img v-if="!userPhoto && photoPreview" :src="photoPreview" alt="Photo Preview" class="my-4"
            @click.stop="openFilePicker"></v-img>
          <input ref="fileInput" id="fileInput" type="file" accept="image/*"
            style="position: absolute; top: 0; left: 0; opacity: 0; width: 100%; height: 100%;"
            @change="onFileSelected" />
          <div class="upload-overlay" v-if="!userPhoto">
            <v-icon class="upload-icon">mdi-camera</v-icon>
            <div class="upload-text">Click to Upload Your Photo</div>
          </div>
          <button type="button" class="invisible-button" @click.stop="openFilePicker"></button>
        </div>
        <v-img v-if="userPhoto && photoPreview" :src="photoPreview" alt="Photo Preview" class="my-4"></v-img>
      </v-form>
    </v-card>

    <!-- Second Card: Select Musician Position -->
    <v-card class="position-card">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ translations[selectedLanguage].title }}
        <v-select v-model="selectedLanguage" :items="languages" label="" class="language-select" max-width="120"
          @change="translate"></v-select>
      </v-card-title>
      <v-card-text>
        <v-radio-group v-model="selectedPosition">
          <v-radio :value="translations[selectedLanguage].options.vocal"
            :label="translations[selectedLanguage].options.vocal" class="custom-radio"></v-radio>
          <v-radio :value="translations[selectedLanguage].options.piano"
            :label="translations[selectedLanguage].options.piano" class="custom-radio"></v-radio>
          <v-radio :value="translations[selectedLanguage].options.drums"
            :label="translations[selectedLanguage].options.drums" class="custom-radio"></v-radio>
          <v-radio :value="translations[selectedLanguage].options.bass"
            :label="translations[selectedLanguage].options.bass" class="custom-radio"></v-radio>
          <v-radio :value="translations[selectedLanguage].options.guitar"
            :label="translations[selectedLanguage].options.guitar" class="custom-radio"></v-radio>
          <v-radio :value="translations[selectedLanguage].options.others"
            :label="translations[selectedLanguage].options.others" class="custom-radio"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>

    <!-- Third Card: Submit Button -->
    <v-card class="submit-card">
      <v-card-text>
        <v-btn type="submit" :style="{ background: buttonBackground, color: 'white' }" class="gradient-button" block
          @click="cacheData">
          JOIN
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const router = useRouter();

    const userPhoto = ref<File | null>(null);
    const photoPreview = ref<string | null>(null);
    const selectedPosition = ref<string>(''); // Initially empty, change as per default selection
    const selectedLanguage = ref<string>('日本語'); // Default language is Japanese
    const showCachedData = ref<boolean>(false);
    const cachedData = ref<{ photoPreview: string | null; selectedPosition: string }>({
      photoPreview: null,
      selectedPosition: '',
    });

    const languages = ['English', '中文', '日本語'];

    const translations = {
      'English': {
        title: 'Select Position',
        options: {
          vocal: 'Vocal',
          piano: 'Piano',
          drums: 'Drum/Percussion',
          bass: 'Bass',
          guitar: 'Guitar',
          others: 'Others',
        },
      },
      '中文': {
        title: '选择音乐家位置',
        options: {
          vocal: '主唱',
          piano: '鋼琴',
          drums: '鼓/打擊樂',
          bass: '貝斯',
          guitar: '吉他',
          others: '其他',
        },
      },
      '日本語': {
        title: 'ポジション選択',
        options: {
          vocal: 'ボーカル',
          piano: 'ピアノ',
          drums: 'ドラム/パーカッション',
          bass: 'ベース',
          guitar: 'ギター',
          others: 'その他',
        },
      },
    };

    const buttonBackground = ref('linear-gradient(90deg, #FF8C00, #FF4500)');

    // On mounted, check if there is cached data
    onMounted(() => {
      const cached = localStorage.getItem('cachedData');
      if (cached) {
        const parsedData = JSON.parse(cached);
        cachedData.value = parsedData;
        showCachedData.value = true;
      }
    });

    // Create live event
    const createLiveEvent = async () => {
      if (!userPhoto.value) {
        console.error('Photo is required');
        return;
      }

      if (!selectedPosition.value) {
        console.error('Musician position is required');
        return;
      }

      const formData = new FormData();
      formData.append('userPhoto', userPhoto.value);
      formData.append('selectedPosition', selectedPosition.value);

      try {
        const response = await fetch(`${apiUrl}/live/create`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create live event');
        }

        const data = await response.json();
        console.log('Live event created:', data);

        // Reset form after successful submission
        resetForm();

        router.push('/');
      } catch (error) {
        console.error('Error creating live event:', error);
      }
    };

    // Cache data when "JOIN" button is clicked
    const cacheData = () => {
      if (!photoPreview.value || !selectedPosition.value) {
        console.warn('Photo or position is missing. Cache operation aborted.');
        return;
      }

      cachedData.value.photoPreview = photoPreview.value;
      cachedData.value.selectedPosition = selectedPosition.value;
      localStorage.setItem('cachedData', JSON.stringify(cachedData.value));
      showCachedData.value = true;
      createLiveEvent();
    };

    // Reset form after submission
    const resetForm = () => {
      userPhoto.value = null;
      photoPreview.value = null;
      selectedPosition.value = '';
    };

    // Open file picker when button is clicked
    const openFilePicker = () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    };

    // Handle file selected event
    const onFileSelected = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const selectedFile = target.files[0];
        userPhoto.value = selectedFile;
        previewPhoto(selectedFile);
        const uploadContainer = document.querySelector('.upload-container');
        if (uploadContainer) {
          uploadContainer.style.display = 'none';
        }
      }
    };

    // Preview photo
    const previewPhoto = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        photoPreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    // Translate content based on selected language
    const translate = () => {
      console.log('Language changed to:', selectedLanguage.value);
    };

    return {
      userPhoto,
      photoPreview,
      selectedPosition,
      selectedLanguage,
      languages,
      translations,
      createLiveEvent,
      openFilePicker,
      onFileSelected,
      buttonBackground,
      translate,
      showCachedData,
      cachedData,
      cacheData,
    };
  },
});
</script>
<style scoped>
body {
  background-color: #222222;
  color: #ffffff;
  font-family: 'Noto Sans JP', sans-serif;
}

.v-application {
  background-color: #222222;
  color: #ffffff;
}

.v-card {
  background-color: #333333;
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-container {
  background-color: #333333;
  color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #444444;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
}

.upload-overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
  color: #ffffff;
}

.upload-text {
  font-size: 16px;
  color: #ffffff;
}

.invisible-button {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.v-img {
  border-radius: 10px;
}

.position-card {
  background-color: #333333;
  color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-card {
  background-color: #333333;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cached-data-card {
  margin-bottom: 20px;
  /* 设置卡片与下方卡片之间的间距 */
}

.language-select {
  width: auto;
}

.gradient-button {
  background: linear-gradient(90deg, #FF8C00, #FF4500);
  color: white;
  text-transform: none;
  width: 100%;
}

.custom-radio .v-input--selection-controls__ripple {
  width: 30px;
  height: 30px;
}

.custom-radio .v-input--selection-controls__input {
  width: 30px;
  height: 30px;
}
</style>
