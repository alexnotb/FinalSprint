import { useState } from 'react'
import './App.css'

function App() {
  const [favorites, setFavorites] = useState(0)

  return (
    <>
      <div className="food-header">
        <h1>My Delicious Food App</h1>
      </div>
      <div className="card">
        <p>Welcome to your personalized food experience!</p>
        <button onClick={() => setFavorites((favorites) => favorites + 1)}>
          Favorite dishes: {favorites}
        </button>
        <p>
          Browse recipes, track nutrition, and plan your meals all in one place.
        </p>
      </div>
      <p className="read-the-docs">
        Start exploring our collection of amazing recipes
      </p>
    </>
  )
}

export default App
