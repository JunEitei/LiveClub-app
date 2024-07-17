<template>
    <v-container fluid fill-height>
      <v-row no-gutters class="instrument-layout">
        <v-col v-for="(instrument, index) in instruments" :key="index" cols="3"> 
          <v-card :class="getCardClass(instrument.key)" @click="toggleInstrument(instrument.key)">
            <v-card-text class="text-center">{{ instrument.label }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        instruments: [
          { key: 'G', label: 'ギター' },
          { key: 'K', label: 'キーボード' },
          { key: 'B', label: 'ベース' },
          { key: 'D', label: 'ドラム' },
          { key: 'P', label: 'パーカッション' },
          { key: 'V', label: 'ボーカル' }
        ]
      };
    },
    methods: {
      toggleInstrument(instrument) {
        console.log('Selected instrument:', instrument);
      },
      getCardClass(instrument) {
        switch (instrument) {
          case 'G':
            return 'guitar';
          case 'K':
            return 'keyboard';
          case 'B':
            return 'bass';
          case 'D':
            return 'drums';
          case 'P':
            return 'percussion';
          case 'V':
            return 'vocal';
          default:
            return '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .instrument-layout {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    background-color: #222222; /* 设置背景色为深灰色 */
  }
  
  .v-col {
    margin: 10px; /* 设置卡片与卡片之间的间距为10px */
  }
  
  .v-card {
    width: 100%; /* 卡片宽度为100% */
    padding-top: 100%; /* 使用padding-top来确保卡片是正方形 */
    position: relative; /* 设置相对定位以便于内部元素绝对定位 */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .v-card .v-card-text {
    position: absolute; /* 内部文字绝对定位 */
    top: 50%; /* 文字垂直居中 */
    transform: translateY(-50%); /* 垂直居中 */
    width: 100%; /* 宽度100% */
    text-align: center; /* 文字居中 */
  }
  
  .guitar {
    background-color: #ffcc00;
  }
  
  .keyboard {
    background-color: #66ccff;
  }
  
  .bass {
    background-color: #cc99ff;
  }
  
  .drums {
    background-color: #ff6666;
  }
  
  .percussion {
    background-color: #99cc00;
  }
  
  .vocal {
    background-color: #ff9966;
  }
  
  .v-card:hover {
    transform: scale(1.1); /* 鼠标悬停时放大卡片 */
    transition: transform 0.3s ease; /* 添加过渡效果 */
  }
  </style>