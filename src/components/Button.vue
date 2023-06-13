<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script setup></script>

<style lang="scss" scoped>
  @import '../assets/css/variables.scss';
  .btn {
    color: black;
    text-transform: uppercase;
    padding: 15px 20px;
    border-radius: 5px;
    border: none;
    background-color: $secondary-color;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
</style>
