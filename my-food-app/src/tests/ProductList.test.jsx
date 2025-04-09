import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductList from '../components/ProductList';

// Mock fetch API
global.fetch = vi.fn();

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Test Product 1",
    price: 10.99,
    description: "Test description 1",
    image: "test-image-1.jpg",
    category: "Test Category"
  },
  {
    id: 2,
    name: "Test Product 2",
    price: 15.99,
    description: "Test description 2",
    image: "test-image-2.jpg",
    category: "Test Category"
  }
];

describe('ProductList Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockReset();
  });

  it('displays loading state initially', () => {
    // Mock fetch to return a promise that never resolves
    fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </BrowserRouter>
    );

    // Check for loading text
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('renders products after successful API call', async () => {
    // Mock successful fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    });

    render(
      <BrowserRouter>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </BrowserRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Check for price formatting
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    // Mock failed fetch
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(
      <BrowserRouter>
        <CartProvider>
          <ProductList />
        </CartProvider>
      </BrowserRouter>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });
});
