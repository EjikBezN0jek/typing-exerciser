<template>
  <div class="modal">
    <p>Пальцы в основной позиции ASDF и JKL;</p>
    <button @click="$emit('startExercise')">Начать</button>
  </div>
</template>

<script setup>
  const props = defineProps(['exerciseNum']);
  // const emit = defineEmits(['startExercise']);
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
