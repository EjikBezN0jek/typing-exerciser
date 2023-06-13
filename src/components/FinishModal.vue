<template>
  <BaseModal
    @confirm="emit('startExercise')"
    title="Поздравляем!"
    confirm-button-text="Повторить">
    <template #default>
      <div class="modal__stats">
        <div class="stats__item">
          <p class="item__title">{{ props.mistakesCount }}</p>
          <p>{{ declension(props.mistakesCount, props.dictionary) }}</p>
        </div>
        <div class="stats__item">
          <p class="item__title">{{ props.speed }}</p>
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

  .item__title {
    font-size: 48px;
    font-weight: bold;
  }

  .highscore {
    color: $accent-color;
    text-transform: none;
  }
</style>
