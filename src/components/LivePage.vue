<template>
    <v-container fluid fill-height>
      <v-card class="instrument-layout">
        <v-card-title class="text-center">乐队成员</v-card-title>
        <v-row no-gutters>
          <v-col v-for="(instrument, index) in instruments" :key="index" cols="6"> 
            <div class="card-wrapper">
              <v-card :class="getCardClass(instrument.key)" @click="toggleInstrument(instrument.key)">
                <v-card-text class="text-center">{{ instrument.label }}</v-card-text>
                <div class="info-overlay">
                  <div class="info-text">{{ instrument.label }}</div>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-card>
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
    background-color: #222222;
    padding: 20px;
    justify-content: center; /* 将卡片内部内容居中 */
    align-items: center;
  }
  
  .card-wrapper {
    position: relative;
  }
  
  .v-card {
    width: 100%;
    padding-top: 100px; /* 根据需要调整 */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .v-card:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }
  
  .v-card .v-card-text {
    position: absolute;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    text-align: center;
  }
  
  .info-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    padding: 5px;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  
  .v-card:hover .info-overlay {
    transform: translateY(0);
  }
  
  .info-text {
    font-size: 12px;
    margin-bottom: 3px;
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
  
  .v-card-title {
    justify-content: center;
    align-items: center;
  }
  </style>