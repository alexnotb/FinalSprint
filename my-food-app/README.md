# Food Shop App

A React-based e-commerce application for ordering food items.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

To start both the JSON Server and the React app simultaneously:

```bash
npm run start
```

This will start:
- JSON Server on http://localhost:3001 (serving product and cart data)
- React App on http://localhost:5173 (or another port if 5173 is in use)

### Alternative: Run Servers Separately

1. Start the JSON Server:
```bash
npm run server
```

2. In a separate terminal, start the React app:
```bash
npm run dev
```

## Features

- Browse products
- View product details
- Add items to cart
- Manage cart (change quantities, remove items)
- Checkout process

## Troubleshooting

If you see a warning about "Using sample data", it means the JSON Server is not running.
Make sure to start the server with `npm run server` before using the application.

If both the React app and JSON server are running but you still see this message, check
if there's another application using port 3001.
