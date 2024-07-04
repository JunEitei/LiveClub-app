<template>
  <v-container>
    <v-card class="card-container">
      <v-form @submit.prevent="createLiveEvent" class="form-container">
        <v-file-input
          v-model="userPhoto"
          label="Upload One Photo"
          accept="image/*"
          @change="previewPhoto"
          required
          class="dark-grey-text"
        ></v-file-input>
        <v-row justify="center">
          <v-col cols="12">
            <v-img
              v-if="photoPreview"
              :src="photoPreview"
              alt="Photo Preview"
              max-width="300"
              class="my-4"
            ></v-img>
          </v-col>
        </v-row>
        <v-btn
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

    // Preview photo
    const previewPhoto = () => {
      if (userPhoto.value) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          photoPreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(userPhoto.value);
      }
    };

    return {
      userPhoto,
      photoPreview,
      createLiveEvent,
      previewPhoto,
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
}

.form-container {
  margin-left: 16px; /* 左边外边距 */
  margin-right: 16px; /* 右边外边距 */
}

.v-file-input {
  margin-bottom: 16px;
}

.dark-grey-text .v-label,
.dark-grey-text input,
.dark-grey-text .v-file-input__text {
  color: #333333 !important; /* 深灰色文字 */
}

.gradient-button {
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
}

.gradient-button:hover {
  background: linear-gradient(90deg, #FF4500, #FF8C00);
}

.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
  border: 2px solid #FF8C00;
  border-radius: 5px;
}

@media (max-width: 600px) {
  .v-container {
    padding: 20px 10px; /* 手机浏览时的左右内边距 */
  }
}

/* 垂直居中图片预览 */
.v-img.my-4 {
  display: block;
  margin: 0 auto;
}
</style>