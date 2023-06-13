<template>
  <BaseModal
    v-if="isMobile"
    title="Упс!"
    text="Пожалуйста, используйте экран побольше"
    confirm-button-text="Ок" />

  <BaseModal
    v-if="isStartModal && !isMobile"
    @close="isStartModal = false"
    @confirm="startExercise"
    title="Тренажер слепой печати"
    text="Пальцы в основной позиции ASDF и JKL;"
    confirm-button-text="Начать" />

  <BaseModal
    v-if="isFail"
    @close="isFail = false"
    @confirm="startExercise"
    title="Упс!"
    :text="`Не более ${maxMistakesCount} ошибок. Попробуйте еще раз`"
    confirm-button-text="Повторить" />

  <BaseModal
    v-if="isNotEnglish"
    @close="isNotEnglish = false"
    text="Пожалуйста, смените раскладку на English"
    confirm-button-text="Ок" />

  <FinishModal
    v-if="isSuccess"
    @close="isSuccess = false"
    @startExercise="startExercise"
    :dictionary="dictionary"
    :mistakesCount="mistakesCount"
    :speed="speed"
    :isNewHighscore="isNewHighscore" />

  <Transition name="fade">
    <div
      v-if="clippedString && !isMobile"
      class="container">
      <h1 class="title">Тренажер слепой печати</h1>
      <div class="info">
        <div class="info__stats">
          <p class="stats__item">
            <span>{{ mistakesCount }}</span> {{ declension(mistakesCount, dictionary) }}
          </p>
          <p class="stats__item">
            <span>{{ speed }}</span> зн./мин
          </p>
        </div>

        <button
          class="restart"
          @click="startExercise"></button>

        <p class="stats__highscore">Личный рекорд: {{ highscore }} зн./мин</p>
      </div>

      <Keyfield
        @keydown="typingHandler"
        :correctString="correctString"
        :clippedString="clippedString" />

      <Keyboard
        :wrongSymbol="wrongSymbol"
        :correctSymbol="correctSymbol"></Keyboard>
    </div>
    <Loader v-else />
  </Transition>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
  import FinishModal from '@/components/FinishModal.vue';
  import Keyfield from '@/components/Keyfield.vue';
  import Keyboard from '@/components/Keyboard.vue';
  import Loader from '@/components/Loader.vue';

  import { onMounted, ref, watch, computed } from 'vue';

  import { fetchText } from '@/api/text';
  import { declension } from '@/helpers/declension';

  const dictionary = ['ошибка', 'ошибки', 'ошибок'];

  const interval = ref(0);
  const isStartModal = ref(false);

  const startExercise = async () => {
    resetStats();
    clearInterval(interval.value);
    const text = await fetchText();
    editString(text);
    isStartModal.value = false;
    interval.value = setInterval(updateSpeed, 1000);
  };

  const originalString = ref('');
  const correctString = ref('');
  const clippedString = ref('');

  const editString = text => {
    if (text) originalString.value = text.slice(0, 50).trim().toLowerCase();
    clippedString.value = originalString.value;
  };

  const mistakesCount = ref(0);
  const maxMistakesCount = ref(3);

  const correctSymbol = ref('');
  const wrongSymbol = ref('');

  const isFail = ref(false);
  const isSuccess = ref(false);

  const seconds = ref(0);
  const speed = ref(0);

  const resetStats = () => {
    seconds.value = 0;
    speed.value = 0;
    mistakesCount.value = 0;
    wrongSymbol.value = '';
    correctString.value = '';
    clippedString.value = '';
    isFail.value = false;
    isSuccess.value = false;
  };

  const updateSpeed = () => {
    updateTime();
    calculationSpeed();
  };

  const updateTime = () => {
    seconds.value++;
  };

  const calculationSpeed = () => {
    if (correctString.value.length) speed.value = Math.floor((correctString.value.length / seconds.value) * 60);
  };

  const isModalOpen = computed(() => isStartModal.value || isNotEnglish.value || isFail.value || isSuccess.value);

  const typingHandler = e => {
    if (isModalOpen.value) return;
    if (e.code === 'Space') e.preventDefault();
    checkEnglish(e.key);
    !isNotEnglish.value ? checkCorrectSymbol(e.key) : clearInterval(interval.value);
  };

  const correctSymbolTimerId = ref(0);
  const wrongSymbolTimerId = ref(0);

  const checkCorrectSymbol = key => {
    clearTimeout(correctSymbolTimerId.value);
    clearTimeout(wrongSymbolTimerId.value);
    correctSymbol.value = '';
    wrongSymbol.value = '';
    const formattedSymbol = key.toLowerCase();
    if (formattedSymbol === originalString.value[correctString.value.length]) {
      correctSymbol.value = key;
      correctSymbolTimerId.value = setTimeout(() => (correctSymbol.value = ''), 500);
      correctString.value = correctString.value.concat(formattedSymbol);
      clippedString.value = clippedString.value.substring(1);
    } else {
      wrongSymbol.value = key;
      wrongSymbolTimerId.value = setTimeout(() => (wrongSymbol.value = ''), 500);
      mistakesCount.value++;
    }
  };

  watch(correctString, newValue => {
    if (newValue.length === originalString.value.length) stringFinish();
  });

  watch(mistakesCount, newValue => {
    if (newValue > maxMistakesCount.value) {
      isFail.value = true;
      clearInterval(interval.value);
    }
  });

  const isNewHighscore = ref(false);

  const stringFinish = () => {
    isSuccess.value = true;
    clearInterval(interval.value);
    if (speed.value > highscore.value) {
      isNewHighscore.value = true;
      highscore.value = speed.value;
      saveNewHighscore();
    }
  };

  const saveNewHighscore = () => {
    localStorage.setItem('highscore', JSON.stringify(highscore.value));
  };

  const isNotEnglish = ref(false);

  const checkEnglish = key => {
    isNotEnglish.value = !/^[a-zA-Z,.:;'"-\\\[\]=`\d\s]+$/.test(key);
  };

  const highscore = ref(0);

  const extractHighscore = () => {
    return (
      JSON.parse(localStorage.getItem('highscore')) ??
      localStorage.setItem('highscore', JSON.stringify(highscore.value))
    );
  };

  const isMobile = ref(false);

  const mobileDetected = () => {
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    mobileDetected();
    if (!isMobile.value) isStartModal.value = true;
    window.onresize = mobileDetected;
    highscore.value = extractHighscore();
  });
</script>

<style lang="scss">
  @import 'assets/css/variables.scss';

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(var(--vh, 1vh) * 100);
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    font-size: 18px;
    color: white;
    background-color: $primary-color;
    overflow: hidden;
  }

  .fade-enter-active {
    transition: opacity 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 1440px;
    padding: 30px 20px;
    margin: 0 auto;
  }

  .title {
    font-weight: 400;
    text-align: center;
    font-size: 50px;
    color: black;
  }

  .lock {
    overflow: hidden;
  }

  .restart {
    position: relative;
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: url(../src/assets/icons/rotate-right-solid.svg) no-repeat;
    }
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info__stats {
    display: flex;
    align-items: center;
    gap: 30px;
    width: 20%;
  }

  .stats__item {
    flex-shrink: 0;
  }

  .stats__highscore {
    position: relative;
    margin-left: 30px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -25px;
      transform: translate(0, -50%);
      width: 20px;
      height: 20px;
      background: url(../src/assets/icons/trophy-solid.svg) no-repeat;
    }
  }
</style>
