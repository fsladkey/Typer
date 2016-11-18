const noop = () => {}
let handleChar, handleBackspace, handleTab;
handleChar = handleBackspace = handleTab = noop

const skippedChars = ['Shift', 'Meta', 'Arrow']

function shouldSkip(char) {
  return skippedChars.any(skip => char.includes(skip))
}

function handler(e) {
  e.preventDefault();
  const char = e.key
  if (skippedChars.includes(char)) return

  switch (char) {
    case 'Backspace':
      return handleBackspace()
    case 'Enter':
      return handleChar('\n')
    case 'Tab':
      return handleChar('  ')
    default:
      return handleChar(char)
  }
}

export default {
  listen() {
    document.addEventListener('keydown', handler)
  },

  remove() {
    document.removeEventListener('keydown', handler)
  },

  onChange(cb) {
    handleChar = cb
  },

  onBackspace(cb) {
    handleBackspace = cb
  }
}
