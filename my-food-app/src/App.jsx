import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import './App.css';

// Import components directly
import ProductListContent from './components/ProductList';
import ProductDetailsContent from './components/ProductDetails';
import CartContent from './components/Cart';
import CheckoutContent from './components/Checkout';

// Create wrapper components that don't rely on react-router-dom
const ProductList = ({ onProductClick }) => <ProductListContent onProductClick={onProductClick} />;
const Cart = ({ onCheckoutClick, onContinueShopping }) => (
  <CartContent onCheckoutClick={onCheckoutClick} onContinueShopping={onContinueShopping} />
);
const Checkout = ({ onBackToCartClick, onContinueShopping, onOrderComplete }) => (
  <CheckoutContent
    onBackToCartClick={onBackToCartClick}
    onContinueShopping={onContinueShopping}
    onOrderComplete={onOrderComplete}
  />
);

const ProductDetails = ({ productId, onBackClick }) => {
  return (
    <div className="product-details-wrapper">
      <button onClick={onBackClick} className="back-button">&larr; Back to Products</button>
      <ProductDetailsContent productId={productId} />
    </div>
  );
};

// App content component (inside CartProvider)
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { getItemCount } = useCart();

  // Handle navigation
  const navigate = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  };

  // Render the appropriate component based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <ProductList onProductClick={(id) => navigate('product', id)} />;
      case 'product':
        return <ProductDetails 
                 productId={selectedProductId} 
                 onBackClick={() => navigate('home')} 
               />;
      case 'cart':
        return <Cart 
                 onCheckoutClick={() => navigate('checkout')}
                 onContinueShopping={() => navigate('home')}
               />;
      case 'checkout':
        return <Checkout 
                 onBackToCartClick={() => navigate('cart')}
                 onContinueShopping={() => navigate('home')}
                 onOrderComplete={() => {
                   setTimeout(() => navigate('home'), 3000);
                 }}
               />;
      default:
        return <ProductList />;
    }
  };

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Simple handling - just go home on back button
      setCurrentPage('home');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-content">
          <div 
            className="logo-link" 
            onClick={() => navigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <h1>Food Shop</h1>
          </div>
          
          <nav className="main-nav">
            <span 
              onClick={() => navigate('home')}
              style={{ cursor: 'pointer' }}
            >
              Home
            </span>
            <span 
              onClick={() => navigate('cart')}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              Cart
              {getItemCount() > 0 && (
                <span className="cart-count">{getItemCount()}</span>
              )}
            </span>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2029 Food Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Main App component
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
