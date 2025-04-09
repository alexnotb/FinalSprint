import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Account.css';

function Account() {
  const { currentUser, updateProfile, getUserOrders, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        zipCode: currentUser.zipCode || '',
        phone: currentUser.phone || ''
      });
      
      if (activeTab === 'orders') {
        fetchOrders();
      }
    }
  }, [currentUser, activeTab]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      setError('Failed to fetch orders: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Render loading state
  if (!currentUser) {
    return (
      <div className="account-container">
        <div className="account-loading">
          <div className="loading-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
      </div>
      
      {activeTab === 'profile' && (
        <div className="account-profile">
          <h2>Profile Information</h2>
          
          {error && <div className="account-error">{error}</div>}
          {successMessage && <div className="account-success">{successMessage}</div>}
          
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                required
                disabled={true} // Email can't be changed
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={profileData.zipCode}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="update-profile-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="account-orders">
          <h2>Order History</h2>
          
          {isLoading ? (
            <div className="loading-spinner" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className={`order-status ${order.status}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-product">
                        <span className="product-name">{item.name}</span>
                        <span className="product-quantity">x{item.quantity}</span>
                        <span className="product-price">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-total">
                    Total: <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-orders">You haven't placed any orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
