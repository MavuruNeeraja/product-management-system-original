# Product Management System

A full-stack web application built with React, Node.js, Express, and MongoDB for managing products with CRUD operations.

## Features

### Must Have Features ✅
- **Product List**: Display all products in a responsive grid layout
- **Add Product**: Form to create new products with validation
- **Delete Product**: Remove products with confirmation dialog
- **Sort Products**: Sort by price, name, category, or date
- **Search Products**: Search by name or description
- **Modern UI**: Clean, responsive design with CSS

### Nice to Have Features ✅
- **Edit Product**: Inline editing of existing products
- **Form Validation**: Client-side validation with error messages
- **Stock Management**: Track product inventory
- **Image Support**: Add product images via URL
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19.1.1** - UI library with hooks
- **CSS3** - Modern styling with Flexbox and Grid
- **Fetch API** - HTTP requests to backend

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## Project Structure

```
pms/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ProductList.js
│   │   │   ├── ProductCard.js
│   │   │   ├── AddProductForm.js
│   │   │   ├── SearchBar.js
│   │   │   └── SortControls.js
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # Styles
│   │   └── index.js
│   └── package.json
├── backend/                  # Node.js backend
│   ├── models/              # MongoDB models
│   │   └── Product.js
│   ├── routes/              # API routes
│   │   └── products.js
│   ├── index.js             # Server entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/product_management`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the MONGODB_URI in `backend/index.js` or create a `.env` file

### 3. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
Server will run on http://localhost:5000

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

### 4. Access the Application

Open your browser and go to http://localhost:3000

## API Endpoints

### Products
- `GET /api/products` - Get all products (with search, sort, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories/list` - Get all categories

### Health Check
- `GET /api/health` - Check if API is running

## Product Schema

```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  description: String (required),
  category: String (required),
  imageUrl: String (optional),
  stockQuantity: Number (default: 0),
  inStock: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Adding Products
1. Click "Add Product" button
2. Fill in the required fields (name, price, description, category)
3. Optionally add image URL and stock quantity
4. Click "Add Product" to save

### Managing Products
- **Search**: Use the search bar to find products by name or description
- **Sort**: Use the sort controls to organize products by price, name, category, or date
- **Edit**: Click "Edit" on any product card to modify details
- **Delete**: Click "Delete" and confirm to remove a product

### Responsive Design
- The application is fully responsive
- Works on desktop, tablet, and mobile devices
- Grid layout adapts to screen size

## Development

### Adding New Features
1. Backend: Add new routes in `backend/routes/`
2. Frontend: Create new components in `frontend/src/components/`
3. Update API calls in React components

### Styling
- All styles are in `frontend/src/App.css`
- Uses modern CSS with Flexbox and Grid
- Responsive design with mobile-first approach

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `backend/index.js`

2. **CORS Issues**
   - CORS is enabled for all origins in development
   - For production, configure specific origins

3. **Port Already in Use**
   - Change PORT in backend or kill existing process
   - Use `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

4. **Frontend Not Loading**
   - Ensure backend is running on port 5000
   - Check browser console for errors

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas connection
3. Deploy to Heroku, Vercel, or similar platform

### Frontend
1. Run `npm run build` in frontend directory
2. Deploy build folder to static hosting (Netlify, Vercel, etc.)

## License

This project is open source and available under the MIT License.
