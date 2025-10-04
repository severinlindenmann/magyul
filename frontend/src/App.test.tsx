import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application title Magyul', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /magyul/i });
  expect(heading).toBeInTheDocument();
});
