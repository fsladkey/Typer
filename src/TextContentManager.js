function isWhitespace(char) {
  return char === ' ' || char === '\n'
}

module.exports = class TextContentManager {
  constructor(text) {
    this.text = text.trim()
    this.cursorPos = -1
    this.invalidChars = 0
  }

  nextExpectedChar() {
    return this.text[this.cursorPos + 1]
  }

  handleNewChar(char) {
    if (this.invalidChars > 0 || char !== this.nextExpectedChar()) {
      this.invalidChars += 1
      this.cursorPos += 1
    } else {
      this.cursorPos += 1
      if (char == '\n') this.skipWhitespace()
    }
  }

  handleBackspace() {
    if (this.cursorPos > -1) this.cursorPos -= 1
    if (this.invalidChars > 0) this.invalidChars -= 1
  }

  skipWhitespace() {
    while (isWhitespace(this.text[this.cursorPos + 1])) this.cursorPos += 1
  }

  validText() {
    if (this.cursorPos < 0) return ""
    return this.text.slice(0, (this.cursorPos - this.invalidChars) + 1)
  }

  invalidText() {
    return this.text.slice(this.cursorPos - this.invalidChars + 1, this.cursorPos + 1)
  }

  remainingText() {
    return this.text.slice(this.cursorPos + 2)
  }

  complete() {
    return this.validText() === this.text
  }

}
