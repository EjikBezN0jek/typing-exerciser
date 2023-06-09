<template>
  <h1>Тренажер слепой печати</h1>

  <Modal
    v-if="isShowModal"
    :isPrepareModal="isPrepareModal"
    :isEnglish="isEnglish"
    :isFail="isFail"
    :isSuccess="isSuccess"
    :maxMistakesCount="maxMistakesCount"
    :mistakesCount="mistakesCount"
    :speed="speed"
    @startExercise="startExercise"
    @resetLanguage="resetLanguage" />

  <h2>Личный рекорд: {{ user.bestTime }} зн.мин</h2>

  <div v-if="originalString">
    <span>{{ correctString }}</span> |<span>{{ clippedString }}</span>

    <KeyField @keydown="typingHandler" />

    <p>{{ speed }} зн./мин</p>

    <p v-if="wrongSymbol">
      Wrong: <span style="color: red">{{ wrongSymbol }}</span>
    </p>

    <p>Mistakes: {{ mistakesCount }}</p>
  </div>
</template>

<script setup>
  import Modal from '@/components/Modal.vue';
  import KeyField from '@/components/KeyField.vue';

  import { onMounted, ref, watch } from 'vue';

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
    toggleModal();
    clearInterval(interval.value);
    resetStats();
    const text = await fetchText();
    editString(text);
    isPrepareModal.value = false;
    interval.value = setInterval(updateSpeed, 1000);
  };

  const updateTime = () => {
    seconds.value++;
  };

  const updateSpeed = () => {
    updateTime();
    calculationSpeed();
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

  const calculationSpeed = () => {
    speed.value = Math.floor((correctString.value.length / seconds.value) * 60);
  };

  const stringSuccess = () => {
    isSuccess.value = true;
    toggleModal();
    clearInterval(interval.value);
    if (speed.value > user.value.bestTime) {
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
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    margin-top: 60px;
    font-size: 18px;
    overflow: hidden;
    min-height: calc(var(--vh, 1vh) * 100);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lock {
    overflow: hidden;
  }
</style>
