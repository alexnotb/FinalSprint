import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider = ({ children }) => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // State to track if we're in offline mode
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Local cart storage for offline mode
  const localCart = [];

  // Fetch cart items from API on component mount
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data);
        setIsOfflineMode(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Switch to offline mode
        setIsOfflineMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    setIsLoading(true);
    try {
      if (isOfflineMode) {
        // Handle offline mode
        const existingItem = cartItems.find(item => item.productId === product.id);
        
        if (existingItem) {
          const updatedItem = { 
            ...existingItem, 
            quantity: existingItem.quantity + quantity 
          };
          
          setCartItems(cartItems.map(item => 
            item.id === existingItem.id ? updatedItem : item
          ));
        } else {
          const newItem = {
            id: Date.now(), // Generate a temporary ID
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
          };
          
          setCartItems([...cartItems, newItem]);
        }
        setIsLoading(false);
        return;
      }

      // Online mode - use API
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = { 
          ...existingItem, 
          quantity: existingItem.quantity + quantity 
        };
        
        const response = await fetch(`http://localhost:3001/cart/${existingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        });
        
        if (!response.ok) throw new Error('Failed to update cart');
        
        // Update local state
        setCartItems(cartItems.map(item => 
          item.id === existingItem.id ? updatedItem : item
        ));
      } else {
        // Add new item if not exists
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        };
        
        const response = await fetch('http://localhost:3001/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        
        if (!response.ok) throw new Error('Failed to add to cart');
        
        const addedItem = await response.json();
        setCartItems([...cartItems, addedItem]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsOfflineMode(true);
      // Fall back to offline mode
      addToCart(product, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setIsLoading(true);
    try {
      if (isOfflineMode) {
        // Handle offline mode
        setCartItems(cartItems.filter(item => item.id !== itemId));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to remove from cart');
      
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    setIsLoading(true);
    try {
      if (isOfflineMode) {
        // Handle offline mode
        const item = cartItems.find(item => item.id === itemId);
        if (!item) throw new Error('Item not found');
        
        const updatedItem = { ...item, quantity };
        setCartItems(cartItems.map(item => 
          item.id === itemId ? updatedItem : item
        ));
        setIsLoading(false);
        return;
      }

      const item = cartItems.find(item => item.id === itemId);
      if (!item) throw new Error('Item not found');
      
      const updatedItem = { ...item, quantity };
      
      const response = await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      
      if (!response.ok) throw new Error('Failed to update quantity');
      
      setCartItems(cartItems.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (isOfflineMode) {
        // Handle offline mode
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      // Delete each cart item one by one
      await Promise.all(cartItems.map(item => 
        fetch(`http://localhost:3001/cart/${item.id}`, { method: 'DELETE' })
      ));
      
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    cartItems,
    isLoading,
    isOfflineMode,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
