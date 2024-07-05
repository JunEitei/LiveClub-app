<template>
  <v-app>
    <v-main>
      <router-view />
      <BottomNavigation />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNavigation from './components/BottomNavigation.vue';

export default defineComponent({
  components: {
    BottomNavigation,
  },
  setup() {
    const currentTab = ref('/');
    const router = useRouter();

    const navigateTo = (path: string) => {
      currentTab.value = path;
      router.push(path);
    };

    return {
      currentTab,
      navigateTo,
    };
  },
});
</script>

<style scoped>
.v-bottom-navigation .v-btn {
  width: 50%;
  margin: 0;
}

.icon-margin {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
}

.v-card {
  margin: 20px;
  border-radius: 16px; /* 设置圆角 */
}

.v-card-title {
  padding-bottom: 0; /* 去掉标题底部的额外间距 */
}

.v-card-text {
  padding-top: 0; /* 去掉文本顶部的额外间距 */
}

.v-icon {
  margin-top: 5px; /* 额外增加顶部间距 */
}
</style>
