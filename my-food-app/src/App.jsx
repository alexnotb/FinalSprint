import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import './App.css';

// Import components directly
import ProductListContent from './components/ProductList';
import ProductDetailsContent from './components/ProductDetails';
import CartContent from './components/Cart';
import CheckoutContent from './components/Checkout';

// Create wrapper components that don't rely on react-router-dom
const ProductList = () => <ProductListContent />;
const Cart = () => <CartContent />;
const Checkout = () => <CheckoutContent />;

const ProductDetails = ({ productId, onBackClick }) => {
  return (
    <div className="product-details-wrapper">
      <button onClick={onBackClick} className="back-button">&larr; Back to Products</button>
      <ProductDetailsContent productId={productId} />
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  
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
        return <Cart onCheckoutClick={() => navigate('checkout')} />;
      case 'checkout':
        return <Checkout onBackToCartClick={() => navigate('cart')} />;
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
    <CartProvider>
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
                style={{ cursor: 'pointer' }}
              >
                Cart
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
            <p>&copy; 2023 Food Shop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
