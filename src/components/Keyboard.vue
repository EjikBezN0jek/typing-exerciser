<template>
  <div class="keyboard">
    <div
      v-for="row in keyboard"
      :key="row"
      class="keyboard__row">
      <button
        v-for="symbol in row"
        :key="symbol"
        class="keyboard__btn"
        :style="{ 'background-color': findColor(symbol) }"
        :class="[
          { correct: symbol === props.correctSymbol },
          { wrong: symbol === props.wrongSymbol },
          getSymbolName(symbol),
        ]">
        {{ symbol.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['wrongSymbol', 'correctSymbol']);

  const keyboard = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    [' '],
  ];

  const colors = [
    {
      symbols: ['1', '2', '0', '-', '=', 'q', 'p', '[', ']', 'a', ';', "'", 'z', '/'],
      code: '#A5D6A7',
    },
    {
      symbols: ['3', '9', 'w', 'o', 's', 'l', 'x', '.'],
      code: '#CE93D8',
    },
    {
      symbols: ['4', '8', 'e', 'i', 'd', 'k', 'c', ','],
      code: '#EF9A9A',
    },
    {
      symbols: ['5', '6', 'r', 't', 'f', 'g', 'v', 'b'],
      code: '#FFCC80',
    },
    {
      symbols: ['7', 'y', 'u', 'h', 'j', 'n', 'm'],
      code: '#80DEEA',
    },
    {
      symbols: ['`', 'Backspace', 'Tab', '\\', 'CapsLock', 'Enter', 'Shift'],
      code: '#EEEEEE',
    },
    {
      symbols: [' '],
      code: '#B0BEC5',
    },
  ];

  const findColor = symbol => colors.find(item => item.symbols.includes(symbol)).code;

  const getSymbolName = symbol => (symbol === ' ' ? 'Space' : symbol);
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables.scss';
  .keyboard {
    position: relative;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
    width: 800px;
    padding: 10px 10px 30px;
    border-radius: 10px;
    background-color: white;

    &::after {
      position: absolute;
      content: '';
      top: 130px;
      left: 48%;
      transform: translate(-50%, 0);
      width: 628px;
      height: 218px;
      background: url(../assets/images/hands.webp) no-repeat;
    }
  }

  .keyboard__row {
    display: flex;
    gap: 5px;
  }
  .keyboard__btn {
    width: 47px;
    height: 47px;
    font-size: 12px;
    border-radius: 5px;
    border: none;
  }

  @media screen and (min-width: 1024px) {
    .keyboard__btn {
      font-size: 14px;
    }
  }

  .correct {
    color: white;
    background: $success-color !important;
  }

  .wrong {
    background: $accent-color !important;
  }

  .Tab,
  .Backspace {
    width: 95px;
  }

  .CapsLock,
  .Enter {
    width: 97px;
  }

  .Shift {
    width: 123px;
  }
  .Space {
    width: 411px;
  }
</style>
