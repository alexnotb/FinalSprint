import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Cart from '../components/Cart';

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

describe('Cart Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.resetAllMocks();
  });

  it('displays empty cart message when cart is empty', () => {
    // Mock the useCart hook to return an empty cart
    useCart.mockReturnValue({
      cartItems: [],
      isLoading: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getTotal: vi.fn().mockReturnValue(0)
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays loading state when cart is loading', () => {
    // Mock the useCart hook to return loading state
    useCart.mockReturnValue({
      cartItems: [],
      isLoading: true,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getTotal: vi.fn().mockReturnValue(0)
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading cart/i)).toBeInTheDocument();
  });

  it('renders cart items when cart has items', () => {
    // Mock cart items
    const mockCartItems = [
      {
        id: 1,
        productId: 101,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        image: 'test-image.jpg'
      }
    ];

    // Mock the useCart hook to return cart items
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      isLoading: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getTotal: vi.fn().mockReturnValue(39.98)
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    // Check if cart item is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$39.98')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });
});
