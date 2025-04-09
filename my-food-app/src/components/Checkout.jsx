import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

function Checkout({ onBackToCartClick, onContinueShopping, onOrderComplete }) {
  const { cartItems, getTotal, clearCart, isLoading } = useCart();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  
  // Order success state
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Calculate total
  const total = getTotal();
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Form validation
  const validateForm = () => {
    // Basic validation - check if required fields are filled
    const requiredFields = ['name', 'email', 'address', 'city', 'zipCode', 
                          'cardName', 'cardNumber', 'expDate', 'cvv'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Simulate order processing
      setTimeout(() => {
        clearCart();
        setOrderSuccess(true);
        if (onOrderComplete) {
          onOrderComplete();
        }
      }, 1000);
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };
  
  // Redirect to products if cart is empty
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <section className="empty-checkout">
        <h1>Checkout</h1>
        <p>Your cart is empty</p>
        <button 
          className="continue-shopping"
          onClick={onContinueShopping}
        >
          Shop Now
        </button>
      </section>
    );
  }
  
  // Show order success page
  if (orderSuccess) {
    return (
      <section className="order-success" aria-live="polite">
        <h1>Order Successful!</h1>
        <p>Thank you for your order.</p>
        <p>Your order has been received and is being processed.</p>
        <button 
          className="back-to-shopping"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
      </section>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <section className="checkout-loading" aria-live="polite">
        <h2>Processing...</h2>
        {/* Loading indicator */}
        <div className="loading-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-layout">
        {/* Order Summary Section */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <ul className="checkout-items">
            {cartItems.map(item => (
              <li key={item.id} className="checkout-item">
                <div className="checkout-item-name">
                  {item.name} x {item.quantity}
                </div>
                <div className="checkout-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          
          <div className="checkout-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
        
        {/* Checkout Form Section */}
        <section className="checkout-form-container">
          <form onSubmit={handleSubmit} className="checkout-form">
            <fieldset>
              <legend>Shipping Information</legend>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Payment Information</legend>
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="XXXX XXXX XXXX XXXX"
                  inputMode="numeric"
                  pattern="[0-9 ]*"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expDate">Expiration Date</label>
                  <input
                    type="text"
                    id="expDate"
                    name="expDate"
                    value={formData.expDate}
                    onChange={handleInputChange}
                    required
                    placeholder="MM/YY"
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    placeholder="123"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="4"
                  />
                </div>
              </div>
            </fieldset>
            
            <div className="checkout-actions">
              <button 
                type="button" 
                className="back-to-cart"
                onClick={onBackToCartClick}
              >
                Back to Cart
              </button>
              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Checkout;
