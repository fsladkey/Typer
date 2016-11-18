import React from 'react'
import ReactDOM from 'react-dom'
import TypeRacer from './TypeRacer'

$(() => {
  $('.typer-element').each((i, el) => {
    const text = $(el).text()
    $(el).empty()
    ReactDOM.render(<TypeRacer text={ text } callback={ console.log } />, el)
  })
})
