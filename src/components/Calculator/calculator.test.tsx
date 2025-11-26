import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from './Calculator'

test('basic addition works', () => {
  render(<Calculator />)
  fireEvent.click(screen.getByText('1'))
  fireEvent.click(screen.getByText('+'))
  fireEvent.click(screen.getByText('2'))
  fireEvent.click(screen.getByText('='))
  expect(screen.getByRole('application')).toHaveTextContent('3')
})
