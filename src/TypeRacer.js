import React, { Component } from 'react'
import keyHandler from './keyHandler'
import TextContentManager from './TextContentManager'

const initialState = {
  currentMS: 0,
  complete: false
}

export default class TypeRacer extends Component {

  constructor(props) {
    super(props)
    this.start = this.start.bind(this)
    this.tick = this.tick.bind(this)
    this.textContentManager = new TextContentManager(props.text)
    this.state = initialState
  }

  setListeners() {
    keyHandler.onChange(char => this.textContentManager.handleNewChar(char))
    keyHandler.onBackspace(char => this.textContentManager.handleBackspace())
    keyHandler.listen();
  }

  removeListeners() {
    keyHandler.remove()
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  buildText() {
    const valid = this.textContentManager.validText()
    const invalid = this.textContentManager.invalidText()
    const cursor = this.textContentManager.nextExpectedChar()
    const remaining = this.textContentManager.remainingText()
    return (
      <pre>
        <span className="match">{ valid }</span>
        <span className="no-match">{ invalid }</span>
        <span className="cursor">{ cursor }</span>
        <span className="remaining">{ remaining }</span>
      </pre>
    )
  }

  start() {
    this.startTime = new Date()
    this.interval && clearInterval(this.interval)
    this.interval = setInterval(this.tick, 100)
    this.setState(initialState)
    this.textContentManager = new TextContentManager(this.props.text)
    this.setListeners();
  }

  tick() {
    this.setState({ currentMS: new Date() - this.startTime })
    if (this.textContentManager.complete()) this.stop();
  }

  stop() {
    this.interval && clearInterval(this.interval)
    this.setState({ complete: true })
    this.removeListeners()
    this.props.callback({
      wpm: this.currentWPM(),
      elapsedSeconds: this.currentSeconds(),
    })
  }

  currentNumWords() {
    return this.textContentManager.validText().split(" ").length
  }

  currentSeconds() {
    return Math.round(this.state.currentMS / 1000)
  }

  currentWPM() {
    return Math.round( this.currentNumWords() / (this.currentSeconds() / 60))
  }

  render() {
    return (
      <section onClick={ this.focus } className="type-racer">
        <strong>Current Elapsed Time: { this.currentSeconds() }</strong>
        <br/>
        <strong>Current Words Per Minute: { this.currentWPM() }</strong>
        { this.buildText() }
        <button onClick={ this.start }>Start</button>
      </section>
    )
  }

}
