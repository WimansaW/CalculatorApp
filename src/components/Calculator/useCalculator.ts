// This file is a starting point for moving compute logic into pure functions
export function compute(a: number, b: number, op: string | null){
  switch(op){
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b === 0 ? NaN : a / b
    default: return b
  }
}
