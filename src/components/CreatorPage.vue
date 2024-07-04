<template>
  <v-container>
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
        <v-btn
          v-if="userPhoto"
          type="submit"
          :style="{ background: buttonBackground, color: 'white' }"
          class="gradient-button"
          block
        >
          Create Live Event
        </v-btn>
      </v-form>
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

    const buttonBackground = ref('linear-gradient(90deg, #FF8C00, #FF4500)');

    // Create live event
    const createLiveEvent = async () => {
      if (!userPhoto.value) {
        console.error('Photo is required');
        return;
      }

      const formData = new FormData();
      formData.append('userPhoto', userPhoto.value);

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

    return {
      userPhoto,
      photoPreview,
      createLiveEvent,
      openFilePicker,
      onFileSelected,
      buttonBackground,
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
  transform: translate(-50%, -50%);
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

@media (max-width: 600px) {
  .v-container {
    padding: 20px 10px; /* 手機瀏覽時的左右內邊距 */
  }
}
</style>