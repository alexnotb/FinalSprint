import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

function ProductDetails({ productId }) {
  // Use productId prop instead of useParams
  const id = productId || 1; // Default to first product if no ID provided
  
  // State for product data
  const [product, setProduct] = useState(null);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);
  // State for quantity selection
  const [quantity, setQuantity] = useState(1);
  // Get cart functions from context
  const { addToCart } = useCart();

  // Fetch product details from API when component mounts or ID changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/products/${id}`);
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  // Handle quantity increment/decrement with keyboard accessibility
  const handleQuantityAdjust = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show feedback to user (could be enhanced with a toast notification)
    alert(`Added ${quantity} ${product.name}(s) to cart`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="product-details-loading" aria-live="polite">
        <h2>Loading product details...</h2>
        {/* Loading indicator for consistency with other components */}
        <div className="loading-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="product-details-error" aria-live="assertive">
        <h2>Error loading product</h2>
        <p>{error}</p>
      </section>
    );
  }

  // Show not found state
  if (!product) {
    return (
      <section className="product-not-found" aria-live="assertive">
        <h2>Product not found</h2>
      </section>
    );
  }

  return (
    <main className="product-details-container">
      {/* Product details content with image and information */}
      <article className="product-details-content">
        <figure className="product-details-image">
          <img src={product.image} alt={product.name} />
        </figure>
        
        <section className="product-details-info">
          <header>
            <h1>{product.name}</h1>
            <p className="product-details-category">{product.category}</p>
            <p className="product-details-price" aria-label={`Price: ${product.price} dollars`}>
              ${product.price.toFixed(2)}
            </p>
          </header>
          
          {/* Product description */}
          <div className="product-details-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          {/* Quantity selection and add to cart controls */}
          <div className="product-details-actions">
            <div className="quantity-control" role="group" aria-labelledby="quantity-label">
              <label id="quantity-label" htmlFor="quantity">Quantity:</label>
              <div className="quantity-input-group">
                <button 
                  type="button" 
                  onClick={() => handleQuantityAdjust(-1)}
                  aria-label="Decrease quantity"
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  aria-label="Product quantity"
                  aria-valuemin="1"
                  aria-valuenow={quantity}
                />
                <button 
                  type="button"
                  onClick={() => handleQuantityAdjust(1)}
                  aria-label="Increase quantity"
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
              aria-label={`Add ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </section>
      </article>
    </main>
  );
}

export default ProductDetails;
