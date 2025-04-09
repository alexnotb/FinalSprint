import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './ProductList.css';

// Fallback data when server is unavailable
const fallbackProducts = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.",
    image: "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=300",
    category: "Italian"
  },
  {
    id: 2,
    name: "Veggie Burger",
    price: 9.99,
    description: "Plant-based burger patty with lettuce, tomato, onion, and special sauce.",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=300",
    category: "American"
  },
  // Add a couple more items from your db.json as fallback
];

function ProductList({ onProductClick }) {
  // State for products data
  const [products, setProducts] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);
  // State to track if we're using fallback data
  const [usingFallback, setUsingFallback] = useState(false);
  // Get cart functions from context
  const { addToCart } = useCart();

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Use fallback data instead of showing error
        setProducts(fallbackProducts);
        setUsingFallback(true);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle add to cart button click
  const handleAddToCart = (product, event) => {
    if (event) event.preventDefault();  // Prevent navigation
    addToCart(product, 1);
  };

  // Handle view product details
  const handleViewProduct = (productId, event) => {
    if (event) event.preventDefault();
    if (onProductClick) {
      onProductClick(productId);
    } else {
      console.warn('No onProductClick handler provided');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="products-loading" aria-live="polite">
        <h2>Loading products...</h2>
        {/* Adding a loading indicator for better UX */}
        <div className="loading-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="products-error" aria-live="assertive">
        <h2>Error loading products</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <main className="products-container">
      {/* Header section with page title and description */}
      <header>
        <h1>Our Menu</h1>
        <p>Explore our delicious food options</p>
        {usingFallback && (
          <div className="server-warning">
            <p>⚠️ Using sample data. JSON Server is not running.</p>
            <p>Run <code>npm run server</code> in another terminal to fetch real data.</p>
          </div>
        )}
      </header>
      
      {/* Product grid listing all available products */}
      <section className="products-grid" aria-label="Products">
        {products.map(product => (
          <article key={product.id} className="product-card">
            <div className="product-link">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image" 
              />
              <div className="product-info">
                <h2>{product.name}</h2>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="product-actions">
              <button 
                className="view-button"
                onClick={(e) => handleViewProduct(product.id, e)}
                aria-label={`View details of ${product.name}`}
              >
                View Details
              </button>
              <button 
                className="add-to-cart-button"
                onClick={(e) => handleAddToCart(product, e)}
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default ProductList;
