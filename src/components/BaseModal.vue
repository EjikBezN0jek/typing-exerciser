<template>
  <Teleport to="body">
    <div class="modal">
      <div class="modal__dialog">
        <header>
          <slot name="header">
            <p class="modal__title">{{ title }}</p>
          </slot>
        </header>
        <div class="modal__content">
          <slot>
            <p class="modal__text">{{ text }}</p>
          </slot>
        </div>
        <footer>
          <slot name="footer">
            <Button @click="emitHandler">{{ confirmButtonText }}</Button>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { onMounted, onBeforeUnmount } from 'vue';

  import Button from '@/components/Button.vue';

  const props = defineProps(['modelValue', 'title', 'text', 'confirmButtonText']);

  const emit = defineEmits(['confirm', 'close']);

  const emitHandler = () => {
    emit('close');
    emit('confirm');
  };

  const confirmOnEnter = event => {
    event.key === 'Enter' && emitHandler();
  };

  onMounted(() => {
    document.body.classList.add('lock');
    document.addEventListener('keydown', confirmOnEnter);
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('lock');
    document.removeEventListener('keydown', confirmOnEnter);
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

  .modal__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal__title {
    font-size: 36px;
  }

  .modal__text {
    text-align: center;
  }
</style>
