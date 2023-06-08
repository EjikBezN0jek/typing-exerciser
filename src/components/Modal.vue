<template>
  <div class="modal">
    <div v-if="isPrepareModal">
      <p>Пальцы в основной позиции ASDF и JKL;</p>
      <button @click="$emit('startExercise')">Начать</button>
    </div>
    <div v-if="isCapsLock">
      <p>Пожалуйста, отключите Caps Lock.</p>
    </div>
    <div v-if="!isEnglish">
      <p>Пожалуйста, смените раскладку на English.</p>
    </div>
    <!-- <div v-if="!isEnglish">
      <p>Пожалуйста, смените раскладку на English.</p>
    </div> -->
  </div>
</template>

<script setup>
  const props = defineProps(['exerciseNum', 'isPrepareModal', 'isCapsLock', 'isEnglish']);
</script>

<style lang="scss" scoped>
  .modal {
    border: 1px solid black;
    width: 500px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
</style>
