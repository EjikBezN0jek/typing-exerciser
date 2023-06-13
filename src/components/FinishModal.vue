<template>
  <BaseModal
    @confirm="emit('startExercise')"
    title="Поздравляем!"
    confirm-button-text="Повторить">
    <template #default>
      <div class="modal__stats">
        <div class="stats__item">
          <p class="text--big">{{ props.mistakesCount }}</p>
          <p>{{ declension(props.mistakesCount, props.dictionary) }}</p>
        </div>
        <div class="stats__item">
          <p class="text--big">{{ props.speed }}</p>
          <span>зн./мин</span>
          <p
            v-if="props.isNewHighscore"
            class="highscore">
            Новый рекорд!
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
  import BaseModal from '@/components/BaseModal.vue';

  import { declension } from '@/helpers/declension';

  const props = defineProps(['mistakesCount', 'speed', 'isNewHighscore', 'dictionary']);
  const emit = defineEmits(['startExercise']);
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables.scss';
  .text--big {
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
    background-color: $success-color;
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
    color: $accent-color;
    text-transform: none;
  }
</style>
