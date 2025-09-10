const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stockQuantity: 25,
    inStock: true
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Made from 100% organic cotton.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stockQuantity: 50,
    inStock: true
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 19.99,
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    stockQuantity: 30,
    inStock: true
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    description: "RGB backlit mechanical keyboard with Cherry MX switches. Perfect for gaming and programming with customizable lighting effects.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
    stockQuantity: 15,
    inStock: true
  },
  {
    name: "Yoga Mat Premium",
    price: 39.99,
    description: "Non-slip yoga mat made from eco-friendly materials. Extra thick for comfort and durability. Perfect for all types of yoga practice.",
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    stockQuantity: 20,
    inStock: true
  },
  {
    name: "Ceramic Coffee Mug Set",
    price: 29.99,
    description: "Set of 4 handcrafted ceramic coffee mugs. Each mug holds 12oz and features a unique design. Dishwasher and microwave safe.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
    stockQuantity: 40,
    inStock: true
  },
  {
    name: "Wireless Phone Charger",
    price: 34.99,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator and non-slip surface. Charges up to 10W.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    stockQuantity: 0,
    inStock: false
  },
  {
    name: "Leather Wallet",
    price: 49.99,
    description: "Genuine leather bi-fold wallet with RFID blocking technology. Multiple card slots and cash compartment. Handcrafted with attention to detail.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stockQuantity: 12,
    inStock: true
  },
  {
    name: "Bluetooth Speaker",
    price: 59.99,
    description: "Portable Bluetooth speaker with 360-degree sound. Waterproof design perfect for outdoor activities. 12-hour battery life.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    stockQuantity: 8,
    inStock: true
  },
  {
    name: "Essential Oil Diffuser",
    price: 44.99,
    description: "Ultrasonic essential oil diffuser with LED color changing lights. Large capacity water tank and timer function. Perfect for aromatherapy.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1607853204693-96d6675fd655?w=400",
    stockQuantity: 18,
    inStock: true
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product_management';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} sample products`);
    
    // Display inserted products
    console.log('\nSample products added:');
    products.forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - ${product.category}`);
    });
    
    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
