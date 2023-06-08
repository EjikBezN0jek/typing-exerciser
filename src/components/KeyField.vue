<template>
  <div>
    <input
      ref="input"
      type="textTyping"
      :value="textTyping"
      @input="$emit('update:textTyping', $event.target.value)" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  defineProps(['textTyping']);
  defineEmits(['update:textTyping']);

  const input = ref(null);

  const inputAutofocus = () => {
    input.value.focus();
  };

  onMounted(() => {
    document.body.addEventListener('click', inputAutofocus);
    inputAutofocus();
  });
</script>

<style lang="scss" scoped></style>
