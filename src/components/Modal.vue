<template>
  <Teleport to="body">
    <div class="modal">
      <div
        v-if="isPrepareModal"
        class="modal__dialog">
        <p class="modal__title">Тренажер слепой печати</p>
        <p class="modal__text">Пальцы в основной позиции ASDF и JKL;</p>
        <button @click="$emit('startExercise')">Начать</button>
      </div>
      <div
        v-if="isSuccess"
        class="modal__dialog">
        <p class="modal__title">Поздравляем!</p>
        <div class="modal__stats">
          <div class="stats__item">
            <p class="text--big">{{ props.mistakesCount }}</p>
            <p>{{ setWordsEndings }}</p>
          </div>
          <div class="stats__item">
            <p class="text--big">{{ props.speed }}</p>
            <p>зн./мин</p>
            <p
              v-if="props.isNewHighscore"
              class="highscore">
              Новый рекорд!
            </p>
          </div>
        </div>
        <button @click="$emit('startExercise')">Повторить</button>
      </div>
      <div
        v-else-if="isFail"
        class="modal__dialog">
        <p class="modal__title">Упс!</p>
        <p class="modal__text">Не более {{ props.maxMistakesCount }} ошибок. Попробуйте еще раз</p>
        <button @click="$emit('startExercise')">Повторить</button>
      </div>
      <div
        v-else-if="!isEnglish"
        class="modal__dialog">
        <p class="modal__text">Пожалуйста, смените раскладку на English.</p>
        <button @click="$emit('resetLanguage')">Ок</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps([
    'isPrepareModal',
    'isEnglish',
    'isFail',
    'maxMistakesCount',
    'isSuccess',
    'mistakesCount',
    'speed',
    'isNewHighscore',
  ]);

  defineEmits(['startExercise', 'resetLanguage']);

  const setWordsEndings = computed(() => {
    switch (props.mistakesCount) {
      case 1: {
        return 'ошибка';
      }
      case 2:
      case 3: {
        return 'ошибки';
      }
      default:
        return 'ошибок';
    }
  });
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables.scss';
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    font-family: Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .modal__dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 30px 0;
    margin: 0 auto;
    width: 100%;
    max-width: 500px;
    border-radius: 5px;
    background: white;
  }

  .modal__title {
    font-size: 36px;
    font-family: 'Truetypewriter';
  }

  .text--big {
    font-family: 'Truetypewriter';
    font-size: 48px;
    font-weight: bold;
  }

  .modal__stats {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 50px;
    padding: 20px;
    width: 100%;
    background-color: $secondary-color;
  }

  .stats__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    color: white;
    text-transform: uppercase;
  }

  .highscore {
    color: coral;
    text-transform: none;
  }
</style>
