const test = require('tape');
const TextContentManager = require('../src/TextContentManager');

const text = `
class Cat
  attr_accessor :name
end
`


test(t => {
  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager(text)
    t.equal(subject.text, "class Cat\n  attr_accessor :name\nend")
    t.equal(subject.cursorPos, -1)
  })

  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager(text)
    subject.handleNewChar('c')
    t.equal(subject.cursorPos, 0)
    t.equal(subject.invalidChars, 0)
  })

  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager(text)
    subject.handleNewChar('a')
    t.equal(subject.cursorPos, 0)
    t.equal(subject.invalidChars, 1)
  })

  t.test(t => {
    t.plan(2)
    const firstLine = "class Cat\n"
    const subject = new TextContentManager(text)
    for (var i = 0; i < firstLine.length; i++) {
      subject.handleNewChar(firstLine[i])
    }

    t.equal(subject.cursorPos, 11)
    t.equal(subject.nextExpectedChar(), "a")
  })

  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager('a\n\n  b')
    subject.handleNewChar('a')
    subject.handleNewChar('\n')

    t.equal(subject.cursorPos, 4)
    t.equal(subject.nextExpectedChar(), "b")
  })

  t.test(t => {
    t.plan(2)
    const firstLine = 'class Cat\nattr_accessor :name\nexd'
    const subject = new TextContentManager(text)
    for (var i = 0; i < firstLine.length; i++) {
      subject.handleNewChar(firstLine[i])
    }
    t.equal(subject.complete(), false)
    t.equal(subject.invalidChars, 2)
  })

  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager(text)
    subject.handleNewChar('x')
    subject.handleBackspace();
    t.equal(subject.invalidChars, 0)
    t.equal(subject.cursorPos, -1)
  })

  t.test(t => {
    t.plan(2)
    const subject = new TextContentManager(text)
    subject.handleBackspace();
    t.equal(subject.invalidChars, 0)
    t.equal(subject.cursorPos, -1)
  })

  t.test(t => {
    t.plan(4)
    const subject = new TextContentManager(text)
    t.equal(subject.validText(), '')
    t.equal(subject.invalidText(), '')
    t.equal(subject.nextExpectedChar(), 'c')
    t.equal(subject.remainingText(), 'lass Cat\n  attr_accessor :name\nend')
  })

  t.test(t => {
    t.plan(4)
    const firstLine = 'class Cat\nxxxx'
    const subject = new TextContentManager(text)
    for (var i = 0; i < firstLine.length; i++) {
      subject.handleNewChar(firstLine[i])
    }
    t.equal(subject.validText(), 'class Cat\n  ')
    t.equal(subject.invalidText(), 'attr')
    t.equal(subject.nextExpectedChar(), '_')
    t.equal(subject.remainingText(), 'accessor :name\nend')
  })
})
