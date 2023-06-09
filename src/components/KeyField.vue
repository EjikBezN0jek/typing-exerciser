<template>
  <div></div>
</template>

<script setup>
  import { onMounted } from 'vue';

  const emit = defineEmits(['keydown']);

  onMounted(() => {
    document.addEventListener('keydown', e => emit('keydown', e));
  });
</script>

<style lang="scss" scoped></style>
