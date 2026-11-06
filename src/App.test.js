import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio with Kasthuri Shravani title', () => {
  render(<App />);
  const elements = screen.getAllByText(/Kasthuri Shravani/i);
  expect(elements.length).toBeGreaterThan(0);
});
