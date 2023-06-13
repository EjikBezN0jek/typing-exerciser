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
          <p>
            <span>{{ mistakesCount }}</span> {{ declension(mistakesCount, dictionary) }}
          </p>
          <p>
            <span>{{ speed }}</span> зн./мин
          </p>
        </div>

        <button
          class="btn--repeat"
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
    <div
      v-else
      class="loader" />
  </Transition>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';
  import FinishModal from '@/components/FinishModal.vue';
  import Keyfield from '@/components/Keyfield.vue';
  import Keyboard from '@/components/Keyboard.vue';

  import { onMounted, ref, watch, computed } from 'vue';

  import { fetchText } from '@/api/text';
  import { declension } from '@/helpers/declension';

  const dictionary = ['ошибка', 'ошибки', 'ошибок'];

  const interval = ref(0);
  const isStartModal = ref(false);

  const startExercise = async () => {
    clearInterval(interval.value);
    resetStats();
    const text = await fetchText();
    editString(text);
    isStartModal.value = false;
    interval.value = setInterval(updateSpeed, 1000);
  };

  const originalString = ref('');

  const editString = text => {
    if (text) originalString.value = text.slice(0, 50).trim().toLowerCase();
    clippedString.value = originalString.value;
  };

  const mistakesCount = ref(0);
  const maxMistakesCount = ref(3);
  const wrongSymbol = ref('');
  const correctString = ref('');
  const clippedString = ref('');
  const isFail = ref(false);
  const isSuccess = ref(false);

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

  const seconds = ref(0);

  const updateTime = () => {
    seconds.value++;
  };

  const speed = ref(0);

  const calculationSpeed = () => {
    speed.value = Math.floor((correctString.value?.length ?? 0 / seconds.value) * 60);
  };

  const isModalOpen = computed(() => isStartModal.value || isNotEnglish.value || isFail.value || isSuccess.value);

  const typingHandler = e => {
    if (isModalOpen.value) return;
    if (e.code === 'Space') e.preventDefault();
    checkEnglish(e.key);
    if (!isNotEnglish.value) {
      checkCorrectSymbol(e);
    } else {
      clearInterval(interval.value);
    }
  };

  const correctSymbol = ref('');

  const checkCorrectSymbol = e => {
    correctSymbol.value = '';
    wrongSymbol.value = '';
    const formattedSymbol = e.key.toLowerCase();
    if (formattedSymbol === originalString.value[correctString.value.length]) {
      correctSymbol.value = e.code;
      correctString.value = correctString.value.concat(formattedSymbol);
      clippedString.value = clippedString.value.substring(1);
      wrongSymbol.value = '';
    } else {
      wrongSymbol.value = e.code;
      mistakesCount.value++;
    }
  };

  watch(correctString, newValue => {
    calculationSpeed();
    if (newValue.length === originalString.value.length) {
      stringFinish();
    }
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
  @import 'assets/css/fonts.scss';
  @import 'assets/css/variables.scss';

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #app {
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    font-size: 18px;
    overflow: hidden;
    min-height: calc(var(--vh, 1vh) * 100);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    background-color: $primary-color;
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
    font-family: 'Truetypewriter';
  }

  .lock {
    overflow: hidden;
  }

  .btn--repeat {
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

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border: 5px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
