<template>
  <Teleport to="body">
    <div class="modal">
      <div
        v-if="isPrepareModal"
        class="modal__dialog">
        <p>Пальцы в основной позиции ASDF и JKL;</p>
        <button @click="$emit('startExercise')">Начать</button>
      </div>
      <div
        v-if="isSuccess"
        class="modal__dialog">
        <p>Поздравляем! Ваша скорость {{ props.speed }}зн.мин, ошибок {{ props.mistakesCount }}</p>
        <button @click="$emit('startExercise')">Повторить</button>
      </div>
      <div
        v-else-if="isFail"
        class="modal__dialog">
        <p>Не более {{ props.maxMistakesCount }} ошибок. Попробуйте еще раз</p>
        <button @click="$emit('startExercise')">Повторить</button>
      </div>
      <div
        v-else-if="!isEnglish"
        class="modal__dialog">
        <p>Пожалуйста, смените раскладку на English.</p>
        <button @click="$emit('resetLanguage')">Продолжить</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  const props = defineProps([
    'isPrepareModal',
    'isEnglish',
    'isFail',
    'maxMistakesCount',
    'isSuccess',
    'mistakesCount',
    'speed',
  ]);

  defineEmits(['startExercise', 'resetLanguage']);
</script>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .modal__dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 30px;
    margin: 0 auto;
    width: 100%;
    max-width: 500px;
    border-radius: 5px;
    background: white;
  }
</style>
