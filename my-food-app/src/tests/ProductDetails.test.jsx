import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductDetails from '../components/ProductDetails';

// Mock the useCart hook
vi.mock('../context/CartContext', async () => {
  const actual = await vi.importActual('../context/CartContext');
  return {
    ...actual,
    useCart: vi.fn()
  };
});

// Import the mocked useCart
import { useCart } from '../context/CartContext';

// Mock fetch API
global.fetch = vi.fn();

// Mock product data
const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 24.99,
  description: "This is a test product description.",
  image: "test-image.jpg",
  category: "Test Category"
};

describe('ProductDetails Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockReset();
    vi.resetAllMocks();
    
    // Default mock implementation for useCart
    useCart.mockReturnValue({
      addToCart: vi.fn()
    });
  });

  it('displays loading state initially', () => {
    // Mock fetch to return a promise that doesn't resolve yet
    fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading product details/i)).toBeInTheDocument();
  });

  it('renders product details after successful API call', async () => {
    // Mock successful fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct
    });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product details to load and verify they're displayed
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(await screen.findByText('$24.99')).toBeInTheDocument();
    expect(await screen.findByText('This is a test product description.')).toBeInTheDocument();
  });

  it('calls addToCart with correct product and quantity when Add to Cart button is clicked', async () => {
    // Mock the addToCart function
    const mockAddToCart = vi.fn();
    useCart.mockReturnValue({ addToCart: mockAddToCart });

    // Mock successful fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct
    });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product to load
    await screen.findByText('Test Product');

    // Change quantity
    const quantityInput = screen.getByLabelText('Quantity:');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    // Click Add to Cart button
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Verify addToCart was called with correct arguments
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 3);
  });

  it('displays error message when API call fails', async () => {
    // Mock failed fetch
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error message
    expect(await screen.findByText(/error loading product/i)).toBeInTheDocument();
  });
});
