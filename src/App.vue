<template>
  <h1>Тренажер слепой печати</h1>
  <Modal
    v-if="isShowModal"
    :isPrepareModal="isPrepareModal"
    :isCapsLock="isCapsLock"
    :isEnglish="isEnglish"
    :exerciseNum="user.exerciseNum"
    @startExercise="startExercise" />
  <div v-if="string">
    <p>{{ string }}</p>
    <KeyField
      :textTyping="textTyping"
      @update:text-typing="updateTextTyping"
      @keyup="checkCapsLock($event), checkEnglish($event.target.value)" />
    <p>{{ speed }} зн./мин</p>
  </div>
</template>

<script setup>
  import Modal from '@/components/Modal.vue';
  import KeyField from '@/components/KeyField.vue';

  import { onMounted, ref, computed, watch } from 'vue';

  import { fetchText } from '@/api/text';

  const user = ref({
    bestTime: 0,
  });

  const seconds = ref(0);
  const interval = ref(0);
  const speed = ref(0);

  const isShowModal = ref(true);
  const isPrepareModal = ref(true);
  const isCapsLock = ref(false);
  const isEnglish = ref(true);

  const toggleModal = () => {
    isShowModal.value = !isShowModal.value;
  };

  const checkCapsLock = e => {
    if (e.getModifierState('CapsLock')) {
      isCapsLock.value = true;
      isShowModal.value = true;
    } else {
      isCapsLock.value = false;
      isShowModal.value = false;
    }
  };

  const checkEnglish = value => {
    if (!value) return;
    if (/^[a-zA-Z-!"#$%&'()*+,./:;<=>?@[\\\]_`{|}~ ]+$/.test(value)) {
      isEnglish.value = true;
      isShowModal.value = false;
    } else {
      isEnglish.value = false;
      isShowModal.value = true;
    }
  };

  const string = ref();
  const textTyping = ref('');

  const startExercise = async () => {
    clearInterval(interval.value);
    const text = await fetchText();
    editString(text);
    isPrepareModal.value = false;
    toggleModal();
    interval.value = setInterval(updateSpeed, 1000);
  };

  const updateTime = () => {
    seconds.value++;
  };

  const updateSpeed = () => {
    updateTime();
    calculationSpeed();
  };

  const updateTextTyping = newValue => {
    textTyping.value = newValue;
  };

  const editString = text => {
    if (text) string.value = text.slice(0, 50).toLowerCase();
  };

  const calculationSpeed = () => {
    speed.value = Math.floor((textTyping.value.length / seconds.value) * 60);
  };

  watch(textTyping, (newValue, oldValue) => {
    if (newValue !== oldValue) calculationSpeed();
  });

  onMounted(() => {
    user.value = JSON.parse(localStorage.getItem('user')) ?? localStorage.setItem('user', JSON.stringify(user.value));
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
</style>
