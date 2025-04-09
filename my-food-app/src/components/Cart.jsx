import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart({ onCheckoutClick, onContinueShopping }) {
  // Get cart data and functions from context
  const { 
    cartItems, 
    isLoading, 
    removeFromCart, 
    updateQuantity,
    getTotal
  } = useCart();

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  // Calculate total price
  const total = getTotal();

  // Show loading state
  if (isLoading) {
    return (
      <section className="cart-loading" aria-live="polite">
        <h2>Loading cart...</h2>
        {/* Loading indicator */}
        <div className="loading-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  // Show empty cart message
  if (cartItems.length === 0) {
    return (
      <section className="empty-cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty</p>
        <button 
          className="continue-shopping"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  return (
    <main className="cart-container">
      <h1>Your Cart</h1>
      
      {/* Cart items list */}
      <section className="cart-items" aria-label="Shopping cart items">
        {cartItems.map((item) => (
          <article key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p className="cart-item-price">
                ${item.price.toFixed(2)}
              </p>
            </div>
            
            {/* Quantity controls */}
            <div className="cart-item-quantity" role="group" aria-label={`Quantity controls for ${item.name}`}>
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="quantity-btn"
                aria-label="Decrease quantity"
              >
                -
              </button>
              
              <span aria-live="polite">{item.quantity}</span>
              
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="quantity-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            {/* Subtotal for this item */}
            <div className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            {/* Remove item button */}
            <button 
              onClick={() => removeFromCart(item.id)}
              className="remove-item"
              aria-label={`Remove ${item.name} from cart`}
            >
              ✕
            </button>
          </article>
        ))}
      </section>
      
      {/* Cart summary and checkout actions */}
      <aside className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span aria-live="polite">${total.toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          <button 
            className="continue-shopping"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>
          <button 
            className="proceed-to-checkout"
            onClick={onCheckoutClick}
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </main>
  );
}

export default Cart;
