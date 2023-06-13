<template>
  <div class="keyboard">
    <div
      v-for="row in keyboard"
      :key="row"
      class="keyboard__row">
      <button
        v-for="symbol in row"
        :key="symbol.code"
        class="keyboard__btn"
        :style="{ 'background-color': findColor(symbol.key) }"
        :class="[
          { correct: symbol.code === props.correctSymbol },
          { wrong: symbol.code === props.wrongSymbol },
          symbol.code,
        ]">
        {{ symbol.key.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['wrongSymbol', 'correctSymbol']);

  const keyboard = {
    row1: [
      {
        code: 'Backquote',
        key: '`',
      },
      {
        code: 'Digit1',
        key: '1',
      },
      {
        code: 'Digit2',
        key: '2',
      },
      {
        code: 'Digit3',
        key: '3',
      },
      {
        code: 'Digit4',
        key: '4',
      },
      {
        code: 'Digit5',
        key: '5',
      },
      {
        code: 'Digit6',
        key: '6',
      },
      {
        code: 'Digit7',
        key: '7',
      },
      {
        code: 'Digit8',
        key: '8',
      },
      {
        code: 'Digit9',
        key: '9',
      },
      {
        code: 'Digit0',
        key: '0',
      },
      {
        code: 'Minus',
        key: '-',
      },
      {
        code: 'Equal',
        key: '=',
      },
      {
        code: 'Backspace',
        key: 'Backspace',
      },
    ],
    row2: [
      {
        code: 'Tab',
        key: 'Tab',
      },
      {
        code: 'KeyQ',
        key: 'q',
      },
      {
        code: 'KeyW',
        key: 'w',
      },
      {
        code: 'KeyE',
        key: 'e',
      },
      {
        code: 'KeyR',
        key: 'r',
      },
      {
        code: 'KeyT',
        key: 't',
      },
      {
        code: 'KeyY',
        key: 'y',
      },
      {
        code: 'KeyU',
        key: 'u',
      },
      {
        code: 'KeyI',
        key: 'i',
      },
      {
        code: 'KeyO',
        key: 'o',
      },
      {
        code: 'KeyP',
        key: 'p',
      },
      {
        code: 'BracketLeft',
        key: '[',
      },
      {
        code: 'BracketRight',
        key: ']',
      },
      {
        code: 'Backslash',
        key: '\\',
      },
    ],
    row3: [
      {
        code: 'CapsLock',
        key: 'CapsLock',
      },
      {
        code: 'KeyA',
        key: 'a',
      },
      {
        code: 'KeyS',
        key: 's',
      },
      {
        code: 'KeyD',
        key: 'd',
      },
      {
        code: 'KeyF',
        key: 'f',
      },
      {
        code: 'KeyG',
        key: 'g',
      },
      {
        code: 'KeyH',
        key: 'h',
      },
      {
        code: 'KeyJ',
        key: 'j',
      },
      {
        code: 'KeyK',
        key: 'k',
      },
      {
        code: 'KeyL',
        key: 'l',
      },
      {
        code: 'Semicolon',
        key: ';',
      },
      {
        code: 'Quote',
        key: "'",
      },
      {
        code: 'Enter',
        key: 'Enter',
      },
    ],
    row4: [
      {
        code: 'ShiftLeft',
        key: 'Shift',
      },
      {
        code: 'KeyZ',
        key: 'z',
      },
      {
        code: 'KeyX',
        key: 'x',
      },
      {
        code: 'KeyC',
        key: 'c',
      },
      {
        code: 'KeyV',
        key: 'v',
      },
      {
        code: 'KeyB',
        key: 'b',
      },
      {
        code: 'KeyN',
        key: 'n',
      },
      {
        code: 'KeyM',
        key: 'm',
      },
      {
        code: 'Comma',
        key: ',',
      },
      {
        code: 'Period',
        key: '.',
      },
      {
        code: 'Slash',
        key: '/',
      },
      {
        code: 'ShiftRight',
        key: 'Shift',
      },
    ],
    row5: [
      {
        code: 'Space',
        key: ' ',
      },
    ],
  };

  const colors = [
    {
      symbols: ['1', '2', '0', '-', '=', 'q', 'p', '[', ']', 'a', ';', "'", 'z', '/'],
      code: '#2de62d',
    },
    {
      symbols: ['3', '9', 'w', 'o', 's', 'l', 'x', '.'],
      code: '#e68a2d',
    },
    {
      symbols: ['4', '8', 'e', 'i', 'd', 'k', 'c', ','],
      code: '#2de6dd',
    },
    {
      symbols: ['5', '6', 'r', 't', 'f', 'g', 'v', 'b'],
      code: '#832de6',
    },
    {
      symbols: ['7', 'y', 'u', 'h', 'j', 'n', 'm'],
      code: '#e62db5',
    },
    {
      symbols: ['`', 'Backspace', 'Tab', '\\', 'CapsLock', 'Enter', 'Shift', ' '],
      code: '#757174',
    },
  ];

  const findColor = symbol => colors.find(item => item.symbols.includes(symbol)).code;
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
    background-color: white;
    width: 800px;
    padding: 10px 10px 30px;
    border-radius: 10px;

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
    padding: 5px;
    border-radius: 5px;
    border: none;
    font-size: 20px;
    font-family: 'Truetypewriter';
    // background: #e68a2d;
    // color: white;
  }

  .correct {
    border: 3px solid $third-color;
    color: black;
  }

  .wrong {
    border: 3px solid $secondary-color;
    color: black;
  }

  .Tab,
  .Backspace {
    width: 95px;
  }

  .CapsLock,
  .Enter {
    width: 97px;
  }

  .ShiftLeft,
  .ShiftRight {
    width: 123px;
  }
  .Space {
    width: 411px;
  }
</style>
