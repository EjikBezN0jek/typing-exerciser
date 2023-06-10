<template>
  <Modal
    v-if="isShowModal"
    :isPrepareModal="isPrepareModal"
    :isEnglish="isEnglish"
    :isFail="isFail"
    :isSuccess="isSuccess"
    :maxMistakesCount="maxMistakesCount"
    :mistakesCount="mistakesCount"
    :speed="speed"
    :isNewHighscore="isNewHighscore"
    @startExercise="startExercise"
    @resetLanguage="resetLanguage" />

  <div v-if="originalString">
    <h1 class="title">Тренажер слепой печати</h1>
    <div>
      <div class="stats">
        <p>
          <span>{{ mistakesCount }}</span> {{ setWordsEndings }}
        </p>
        <p>
          <span>{{ speed }}</span> зн./мин
        </p>
      </div>

      <button
        class="btn--repeat"
        @click="startExercise"></button>

      <p class="highscore">Личный рекорд: {{ user.bestTime }} зн./мин</p>
    </div>

    <KeyField
      v-if="clippedString"
      @keydown="typingHandler"
      :correctString="correctString"
      :clippedString="clippedString" />

    <p v-if="wrongSymbol">
      Wrong: <span style="color: red">{{ wrongSymbol }}</span>
    </p>
  </div>
</template>

<script setup>
  import Modal from '@/components/Modal.vue';
  import KeyField from '@/components/KeyField.vue';

  import { onMounted, ref, watch, computed } from 'vue';

  import { fetchText } from '@/api/text';

  const user = ref({
    bestTime: 0,
  });

  const seconds = ref(0);
  const interval = ref(0);
  const speed = ref(0);
  const isShowModal = ref(false);
  const isPrepareModal = ref(false);
  const isEnglish = ref(true);

  const toggleModal = () => {
    isShowModal.value = !isShowModal.value;
    document.body.classList.toggle('lock');
  };

  const setWordsEndings = computed(() => {
    switch (mistakesCount.value) {
      case 1: {
        return 'ошибка';
      }
      case 2:
      case 3:
      case 4: {
        return 'ошибки';
      }
      default:
        return 'ошибок';
    }
  });

  const originalString = ref('');
  const clippedString = ref('');
  const correctString = ref('');
  const wrongSymbol = ref('');
  const mistakesCount = ref(0);
  const maxMistakesCount = ref(3);
  const isFail = ref(false);
  const isSuccess = ref(false);

  const resetStats = () => {
    mistakesCount.value = 0;
    wrongSymbol.value = '';
    correctString.value = '';
    clippedString.value = '';
    isFail.value = false;
    isSuccess.value = false;
  };

  const startExercise = async () => {
    isShowModal.value = false;
    clearInterval(interval.value);
    resetStats();
    const text = await fetchText();
    editString(text);
    isPrepareModal.value = false;
    interval.value = setInterval(updateSpeed, 1000);
  };

  const updateSpeed = () => {
    updateTime();
    calculationSpeed();
  };

  const updateTime = () => {
    seconds.value++;
  };

  const calculationSpeed = () => {
    speed.value = Math.floor((correctString.value.length / seconds.value) * 60);
  };

  const typingHandler = e => {
    if (e.code === 'Space') e.preventDefault();
    checkEnglish(e.key);
    if (!isShowModal.value) {
      checkCorrectSymbol(e);
    } else {
      clearInterval(interval.value);
    }
  };

  const checkCorrectSymbol = e => {
    const formattedSymbol = e.key.toLowerCase();
    if (formattedSymbol === originalString.value[correctString.value.length]) {
      correctString.value = correctString.value.concat(formattedSymbol);
      clippedString.value = clippedString.value.substring(1);
      wrongSymbol.value = '';
    } else {
      wrongSymbol.value = e.code;
      mistakesCount.value++;
    }
  };

  const isNewHighscore = ref(false);

  const stringSuccess = () => {
    isSuccess.value = true;
    toggleModal();
    clearInterval(interval.value);
    if (speed.value > user.value.bestTime) {
      isNewHighscore.value = true;
      user.value.bestTime = speed.value;
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  watch(correctString, newValue => {
    calculationSpeed();
    if (newValue.length === originalString.value.length) {
      stringSuccess();
    }
  });

  watch(mistakesCount, newValue => {
    if (newValue > maxMistakesCount.value) {
      isFail.value = true;
      toggleModal();
      clearInterval(interval.value);
    }
  });

  const checkEnglish = key => {
    if (!key || /^[-!"#$%&'()*+,./:;<=>?@[\\\]_`{|}~ ]+$/.test(key)) return;
    /^[a-zA-Z]+$/.test(key) ? (isEnglish.value = true) : (isEnglish.value = false);
  };

  watch(isEnglish, newValue => {
    if (newValue === false) toggleModal();
  });

  const resetLanguage = () => {
    isEnglish.value = true;
    toggleModal();
  };

  const editString = text => {
    if (text) originalString.value = text.slice(0, 50).trim().toLowerCase();
    clippedString.value = originalString.value;
  };

  onMounted(() => {
    user.value = JSON.parse(localStorage.getItem('user')) ?? localStorage.setItem('user', JSON.stringify(user.value));
    toggleModal();
    isPrepareModal.value = true;
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

  .title {
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

  .highscore {
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

  .stats {
    display: flex;
    align-items: center;
    gap: 100px;
  }
</style>
