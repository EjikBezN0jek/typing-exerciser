<template>
  <div class="field">
    <div class="text">
      <span class="text__writting">{{ props.correctString }}</span
      ><span class="text__remaining">{{ props.clippedString }}</span>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';

  const props = defineProps(['correctString', 'clippedString']);
  const emit = defineEmits(['keydown']);

  onMounted(() => {
    document.addEventListener('keydown', e => emit('keydown', e));
  });
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables.scss';
  .field {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px 100px;
    border-radius: 10px;
    background-color: white;
  }

  .text {
    font-size: 24px;
  }

  @media screen and (min-width: 1024px) {
    .text {
      font-size: 28px;
    }
  }
  .text__writting {
    color: $success-color;
  }

  .text__remaining {
    color: black;
    &::before {
      content: '|';
      width: 7px;
      display: inline-block;
      animation: fadeIn 0.5s ease-in infinite alternate;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
