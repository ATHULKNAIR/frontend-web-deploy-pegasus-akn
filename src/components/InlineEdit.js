import React, { useState, useEffect, useRef, useCallback } from 'react'
import useKeypress from '../hooks/useKeyPress'
import useOnClickOutside from '../hooks/useOnClickOutside'
import '../styles/inline-edit.css'

function InlineEdit ({ text, onSetText, className }) {
  const [isInputActive, setIsInputActive] = useState(false)
  const [inputValue, setInputValue] = useState(text)

  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const inputRef = useRef(null)

  const enter = useKeypress('Enter')
  const esc = useKeypress('Escape')

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      onSetText(inputValue)
      setIsInputActive(false)
    }
  })

  const onEnter = useCallback(() => {
    if (enter) {
      onSetText(inputValue)
      setIsInputActive(false)
    }
  }, [enter, inputValue, onSetText])

  const onEsc = useCallback(() => {
    if (esc) {
      setInputValue(text)
      setIsInputActive(false)
    }
  }, [esc, text])

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus()
    }
  }, [isInputActive])

  useEffect(() => {
    if (isInputActive) {
      // if Enter is pressed, save the text and close the editor
      onEnter()
      // if Escape is pressed, revert the text and close the editor
      onEsc()
    }
  }, [onEnter, onEsc, isInputActive]) // watch the Enter and Escape key presses

  const handleInputChange = useCallback(
    event => {
      setInputValue(event.target.value)
    },
    [setInputValue]
  )

  const handleSpanClick = useCallback(() => setIsInputActive(true), [
    setIsInputActive
  ])

  const classNameString = `inline-text_input inline-text_input--${isInputActive ? 'active' : 'hidden'}`

  return (
    <span className='inline-text' ref={wrapperRef}>
      <span
        ref={textRef}
        onClick={handleSpanClick}
        className={`inline-text_copy inline-text_copy--${
          !isInputActive ? 'active' : 'hidden'
        }`}
      >
        {text}
      </span>
      <input
        ref={inputRef}
        // set the width to the input length multiplied by the x height
        // it's not quite right but gets it close
        style={{ minWidth: Math.ceil(inputValue.length) + 'ch' }}
        value={inputValue}
        onChange={handleInputChange}
        className={classNameString}
      />
    </span>
  )
}

export default InlineEdit
