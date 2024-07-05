<template>
  <v-container>
    <!-- First Card: Upload Photo -->
    <v-card class="card-container" @click="openFilePicker">
      <v-form @submit.prevent="createLiveEvent" class="form-container">
        <div class="upload-container">
          <v-img
            v-if="!userPhoto && photoPreview"
            :src="photoPreview"
            alt="Photo Preview"
            max-width="300"
            class="my-4"
            @click.stop="openFilePicker"
          ></v-img>
          <input
            ref="fileInput"
            id="fileInput"
            type="file"
            accept="image/*"
            style="position: absolute; top: 0; left: 0; opacity: 0; width: 100%; height: 100%;"
            @change="onFileSelected"
          />
          <div class="upload-overlay" v-if="!userPhoto">
            <v-icon class="upload-icon">mdi-camera</v-icon>
            <div class="upload-text">Click to Upload Your Photo</div>
          </div>
          <button
            type="button"
            class="invisible-button"
            @click.stop="openFilePicker"
          ></button>
        </div>
        <v-img
          v-if="userPhoto && photoPreview"
          :src="photoPreview"
          alt="Photo Preview"
          max-width="300"
          class="my-4"
        ></v-img>
      </v-form>
    </v-card>

    <!-- Second Card: Select Musician Position -->
    <v-card class="position-card">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ translations[selectedLanguage].title }}
        <v-select
          v-model="selectedLanguage"
          :items="languages"
          label=""
          @change="translate"
          class="language-select"
        ></v-select>
      </v-card-title>
      <v-card-text>
        <v-radio-group v-model="selectedPosition">
          <v-radio
            :value="translations[selectedLanguage].options.vocal"
            :label="translations[selectedLanguage].options.vocal"
            class="custom-radio"
          ></v-radio>
          <v-radio
            :value="translations[selectedLanguage].options.piano"
            :label="translations[selectedLanguage].options.piano"
            class="custom-radio"
          ></v-radio>
          <v-radio
            :value="translations[selectedLanguage].options.drums"
            :label="translations[selectedLanguage].options.drums"
            class="custom-radio"
          ></v-radio>
          <v-radio
            :value="translations[selectedLanguage].options.bass"
            :label="translations[selectedLanguage].options.bass"
            class="custom-radio"
          ></v-radio>
          <v-radio
            :value="translations[selectedLanguage].options.guitar"
            :label="translations[selectedLanguage].options.guitar"
            class="custom-radio"
          ></v-radio>
          <v-radio
            :value="translations[selectedLanguage].options.others"
            :label="translations[selectedLanguage].options.others"
            class="custom-radio"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>

    <!-- Third Card: Submit Button -->
    <v-card class="submit-card">
      <v-card-text>
        <v-btn
          type="submit"
          :style="{ background: buttonBackground, color: 'white' }"
          class="gradient-button"
          block
        >
          Create Live Event
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const router = useRouter();

    const userPhoto = ref<File | null>(null);
    const photoPreview = ref<string | null>(null);
    const selectedPosition = ref<string>(''); // Initially empty, change as per default selection
    const selectedLanguage = ref<string>('日本語'); // Default language is Japanese

    const languages = ['English', '中文', '日本語'];

    const translations = {
      'English': {
        title: 'Select Musician Position',
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
          vocal: '人声',
          piano: '钢琴',
          drums: '鼓/打击乐',
          bass: '贝斯',
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
        router.push('/');
      } catch (error) {
        console.error('Error creating live event:', error);
      }
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
    };
  },
});
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: auto;
  padding-top: 20px;
}

.card-container {
  background-color: #333333; /* 深灰色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer; /* 添加光標樣式 */
}

.form-container {
  margin-left: 16px; /* 左邊外邊距 */
  margin-right: 16px; /* 右邊外邊距 */
}

.upload-container {
  position: relative;
  width: 100%;
  height: 300px; /* 設置虛線框高度 */
  border: 2px dashed #ccc; /* 虛線框樣式 */
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform  :translate(-50%, -50%);
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #ccc;
}

.upload-text {
  color: #ccc;
  font-size: 16px;
  margin-top: 8px;
}

.v-img.my-4 {
  display: block;
  margin: 0 auto;
}

.gradient-button {
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
}

.gradient-button:hover {
  background: linear-gradient(90deg, #FF4500, #FF8C00);
}

.invisible-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.language-select {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px; /* 固定宽度 */
  z-index: 999; /* 提高层级 */
}

.position-card {
  margin-top: 20px;
  height: 306px;
  padding: 20px;
  background-color: #444444; /* 深灰色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-card {
  margin-top: 20px;
  padding: 20px;
  background-color: #555555; /* 深灰色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-radio input[type="radio"]:checked + .v-item--active .v-item__content {
  background-color: #FFA500; /* 设置选中时的背景色为橙色 */
}

.v-card-title {
  margin-top: -13px; /* 将标题往上移动 10px */
  font-weight: bold;
  font-size: 19px;
}


@media (max-width: 600px) {
  .v-container {
    padding: 20px 10px; /* 手機瀏覽時的左右內邊距 */
  }
}
</style>