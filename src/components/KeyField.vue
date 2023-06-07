<template>
  <div>
    <input
      type="textTyping"
      :value="textTyping"
      @input="$emit('update:textTyping', $event.target.value)" />
  </div>
</template>

<script setup>
  defineProps(['textTyping']);
  defineEmits(['update:textTyping']);
</script>

<style lang="scss" scoped></style>
