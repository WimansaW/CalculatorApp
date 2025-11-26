import React, { useState, useEffect, useRef } from 'react'
import './calc.css'
import { saveHistory, loadHistory } from '../../services/localHistory'

type Op = '+' | '-' | '*' | '/' | '=' | null

function formatDisplay(value: string){
  if (value === '') return '0'
  return value
}

export default function Calculator(){
  const [display, setDisplay] = useState<string>('0')
  const [acc, setAcc] = useState<string | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [overwrite, setOverwrite] = useState<boolean>(true)
  const [history, setHistory] = useState<string[]>(() => loadHistory())

  const displayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') handleDigit(e.key)
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Enter') handleEquals()
      else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key as Op)
      else if (e.key.toLowerCase() === 'c') handleClear()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [display, acc, op, overwrite])

  function handleDigit(d: string){
    if (overwrite){
      setDisplay(d === '.' ? '0.' : d)
      setOverwrite(false)
    } else {
      if (d === '.' && display.includes('.')) return
      setDisplay(s => (s === '0' && d !== '.' ? d : s + d))
    }
  }

  function handleBackspace(){
    if (overwrite){
      setDisplay('0')
      setOverwrite(true)
      return
    }
    setDisplay(s => {
      if (s.length <= 1){
        setOverwrite(true)
        return '0'
      }
      return s.slice(0, -1)
    })
  }

  function handleClear(){
    setDisplay('0')
    setAcc(null)
    setOp(null)
    setOverwrite(true)
  }

  function handleToggleSign(){
    setDisplay(s => (s.startsWith('-') ? s.slice(1) : '-' + s))
  }

  function handlePercent(){
    setDisplay(s => String(Number(s) / 100))
    setOverwrite(true)
  }

  function handleSqrt(){
    const val = Number(display)
    if (val < 0){
      setDisplay('NaN')
    } else {
      setDisplay(String(Math.sqrt(val)))
      setOverwrite(true)
    }
  }

  function compute(a: number, b: number, op: Op){
    switch(op){
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? NaN : a / b
      default: return b
    }
  }

  function handleOperator(nextOp: Op){
    const current = Number(display)
    if (acc == null){
      setAcc(String(current))
      setOp(nextOp)
      setOverwrite(true)
    } else {
      const result = compute(Number(acc), current, op)
      const resultStr = String(result)
      setDisplay(resultStr)
      setAcc(resultStr)
      setOp(nextOp)
      setOverwrite(true)
      saveHistoryItem(resultStr + ' (' + (op ?? '') + ')')
    }
  }

  function handleEquals(){
    if (acc == null || op == null) return
    const result = compute(Number(acc), Number(display), op)
    const item = `${acc} ${op} ${display} = ${result}`
    setDisplay(String(result))
    setAcc(null)
    setOp(null)
    setOverwrite(true)
    saveHistoryItem(item)
    setHistory(loadHistory())
  }

  function saveHistoryItem(item: string){
    saveHistory(item)
    setHistory(loadHistory())
  }

  return (
    <div className="calc-root" role="application" aria-label="Calculator">
      <div className="calc-display" ref={displayRef} aria-live="polite">
        {formatDisplay(display)}
      </div>

      <div className="calc-grid">
        <button onClick={handleClear} aria-label="All Clear" className="btn">AC</button>
        <button onClick={() => {handleToggleSign()}} aria-label="Toggle Sign" className="btn">±</button>
        <button onClick={() => handlePercent()} aria-label="Percent" className="btn">%</button>
        <button onClick={() => handleOperator('/')} aria-label="Divide" className="op">÷</button>

        <button onClick={() => handleDigit('7')} className="btn">7</button>
        <button onClick={() => handleDigit('8')} className="btn">8</button>
        <button onClick={() => handleDigit('9')} className="btn">9</button>
        <button onClick={() => handleOperator('*')} className="op">×</button>

        <button onClick={() => handleDigit('4')} className="btn">4</button>
        <button onClick={() => handleDigit('5')} className="btn">5</button>
        <button onClick={() => handleDigit('6')} className="btn">6</button>
        <button onClick={() => handleOperator('-')} className="op">−</button>

        <button onClick={() => handleDigit('1')} className="btn">1</button>
        <button onClick={() => handleDigit('2')} className="btn">2</button>
        <button onClick={() => handleDigit('3')} className="btn">3</button>
        <button onClick={() => handleOperator('+')} className="op">+</button>

        <button onClick={() => handleSqrt()} aria-label="Square Root" className="btn">√</button>
        <button onClick={() => handleDigit('0')} className="btn">0</button>
        <button onClick={() => handleDigit('.')} className="btn">.</button>
        <button onClick={() => handleEquals()} aria-label="Equals" className="op">=</button>
      </div>

      <div className="calc-history" aria-label="History">
        <strong>History</strong>
        <ul>
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
    </div>
  )
}
