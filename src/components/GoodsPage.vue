<template>
  <v-container>
    <v-row>
      <!-- 商品卡片 -->
      <v-col cols="12" v-for="(good, index) in goods" :key="index">
        <v-card
          class="good-card"
          :style="{ backgroundColor: good.color }"
          @dblclick="good.id ? deleteGood(good.id) : null"
          @click="index < 3 ? selectImage(index) : null"
        >
          <v-img
            v-if="good.image"
            :src="good.image"
            height="400"
            aspect-ratio="1"
            class="mb-3 good-image"
          ></v-img>
          <v-card-text v-else class="text-center">
            {{ index < 3 ? 'Click to add image' : '' }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Hidden file input for image upload -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
    <!-- 显示加载中状态 -->
    <v-row v-if="loading" class="justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <div class="bottom-spacing"></div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, watch } from 'vue';

export default defineComponent({
  setup() {
    const good = reactive({ image: null as File | null });
    const goods = ref<{ id?: number; image?: string; color: string }[]>([]);
    const loading = ref(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const averageColor = ref('#000000');
    const fileInput = ref<HTMLInputElement | null>(null);

    // 生成随机柔和颜色
    const getRandomSoftColor = () => {
      const randomChannel = () => Math.floor(Math.random() * 156 + 50); // 生成50-205之间的数值
      const red = randomChannel();
      const green = randomChannel();
      const blue = randomChannel();
      return `rgb(${red}, ${green}, ${blue})`;
    };

    // 计算颜色的平均值
    const calculateAverageColor = () => {
      if (goods.value.length === 0) return '#000000';

      let totalRed = 0;
      let totalGreen = 0;
      let totalBlue = 0;

      goods.value.forEach(good => {
        const color = good.color.match(/\d+/g).map(Number);
        const [red, green, blue] = color;

        totalRed += red;
        totalGreen += green;
        totalBlue += blue;
      });

      const avgRed = Math.floor(totalRed / goods.value.length);
      const avgGreen = Math.floor(totalGreen / goods.value.length);
      const avgBlue = Math.floor(totalBlue / goods.value.length);

      return `rgb(${avgRed}, ${avgGreen}, ${avgBlue})`;
    };

    // 获取商品列表
    const fetchGoods = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${apiUrl}/goods`);
        if (!response.ok) throw new Error('Network response was not ok');
        const goodsData = await response.json();

        goods.value = new Array(6).fill(null).map((_, index) => {
          const good = goodsData[index];
          const color = index < 3 ? getRandomSoftColor() : '#B0B0B0'; // 前三个商品为随机颜色，其余为灰色
          return good ? { ...good, color } : { color };
        });

        averageColor.value = calculateAverageColor();
      } catch (error) {
        console.error('Error fetching goods:', error);
      } finally {
        loading.value = false;
      }
    };

    const deleteGood = async (id: number) => {
      try {
        const response = await fetch(`${apiUrl}/good/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        goods.value = goods.value.filter(good => good.id !== id);
        averageColor.value = calculateAverageColor();
      } catch (error) {
        console.error('Error deleting good:', error);
      }
    };

    // 处理文件选择事件
    const handleFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        good.image = target.files[0];
        await uploadImage();
      }
    };

    // 选择图片文件
    const selectImage = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // 上传图片并新增商品
    const uploadImage = async () => {
      if (!good.image) return;

      const formData = new FormData();
      formData.append('image', good.image);

      try {
        const uploadResponse = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Image upload failed');
        const uploadData = await uploadResponse.json();

        const goodData = { image: uploadData.url };

        const goodResponse = await fetch(`${apiUrl}/good`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goodData),
        });
        if (!goodResponse.ok) throw new Error('Failed to add good');
        await fetchGoods();
        good.image = null;
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    onMounted(fetchGoods);

    const handleRefresh = async () => {
      if (window.scrollY === 0 && !loading.value) {
        await fetchGoods();
      }
    };

    window.addEventListener('scroll', handleRefresh);

    onUnmounted(() => {
      window.removeEventListener('scroll', handleRefresh);
    });

    watch(goods, () => {
      averageColor.value = calculateAverageColor();
    });

    return {
      good,
      goods,
      loading,
      uploadImage,
      deleteGood,
      handleFileChange,
      averageColor,
      selectImage,
      fileInput,
    };
  },
});
</script>

<style scoped lang="scss">
.good-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 33px;
  transition: transform 0.3s ease-in-out;
  min-height: 100px;

  &:hover {
    transform: scale(1.02);
  }
}

.good-image {
  margin-top: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

.bottom-spacing {
  height: 70px;
}

.v-col {
  display: flex;
  justify-content: center;
}

.v-card {
  width: 100%;
}
</style>
