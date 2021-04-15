import React, { useState } from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode) => {
    setMode(newMode)
    setHistory(prev => [...prev, newMode])
    console.log('This is history', history)
  }
  const back = () => {
    const prevHistory = history.splice(-1)
    setMode(history[history.length - 1])

  }

  return { mode, transition, back };
}