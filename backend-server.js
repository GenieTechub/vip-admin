const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Mock data
const mockUsers = [
  { id: 1, username: 'admin', name: 'Admin User', role: 'admin', email: 'admin@example.com' }
];

const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', isActive: true },
  { id: 2, name: 'Clothing', description: 'Fashion and apparel', isActive: true },
  { id: 3, name: 'Books', description: 'Books and literature', isActive: true }
];

const mockSubcategories = [
  { id: 1, name: 'Smartphones', description: 'Mobile phones and accessories', categoryId: 1, isActive: true },
  { id: 2, name: 'Laptops', description: 'Laptop computers and accessories', categoryId: 1, isActive: true },
  { id: 3, name: 'Men\'s Clothing', description: 'Men\'s fashion and apparel', categoryId: 2, isActive: true },
  { id: 4, name: 'Women\'s Clothing', description: 'Women\'s fashion and apparel', categoryId: 2, isActive: true }
];

const mockProducts = [
  { id: 1, name: 'iPhone 15', price: 999, categoryId: 1, subcategoryId: 1, stock: 50, status: 'active' },
  { id: 2, name: 'MacBook Pro', price: 1999, categoryId: 1, subcategoryId: 2, stock: 25, status: 'active' },
  { id: 3, name: 'T-Shirt', price: 29, categoryId: 2, subcategoryId: 3, stock: 100, status: 'active' }
];

// Auth routes
app.post('/api/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password });
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = 'mock-jwt-token-' + Date.now();
    const user = mockUsers.find(u => u.username === username);
    
    res.json({
      success: true,
      token: token,
      user: user,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories: mockCategories
  });
});

app.post('/api/categories', (req, res) => {
  const newCategory = {
    id: mockCategories.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockCategories.push(newCategory);
  res.json({ success: true, category: newCategory });
});

app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...req.body };
    res.json({ success: true, category: mockCategories[index] });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories.splice(index, 1);
    res.json({ success: true, message: 'Category deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

// Subcategories routes
app.get('/api/subcategories', (req, res) => {
  let filteredSubcategories = [...mockSubcategories];
  
  if (req.query.categoryId) {
    filteredSubcategories = filteredSubcategories.filter(s => s.categoryId == req.query.categoryId);
  }
  
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredSubcategories = filteredSubcategories.filter(s => 
      s.name.toLowerCase().includes(searchTerm) || 
      s.description.toLowerCase().includes(searchTerm)
    );
  }
  
  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    filteredSubcategories = filteredSubcategories.filter(s => s.isActive === isActive);
  }
  
  res.json({
    success: true,
    subcategories: filteredSubcategories
  });
});

app.get('/api/subcategories/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const subcategories = mockSubcategories.filter(s => s.categoryId === categoryId);
  res.json({
    success: true,
    subcategories: subcategories
  });
});

app.get('/api/subcategories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const subcategory = mockSubcategories.find(s => s.id === id);
  if (subcategory) {
    res.json({ success: true, subcategory: subcategory });
  } else {
    res.status(404).json({ success: false, message: 'Subcategory not found' });
  }
});

app.get('/api/subcategories/:id/products', (req, res) => {
  const subcategoryId = parseInt(req.params.id);
  const products = mockProducts.filter(p => p.subcategoryId === subcategoryId);
  res.json({
    success: true,
    products: products
  });
});

app.post('/api/subcategories', (req, res) => {
  const newSubcategory = {
    id: mockSubcategories.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockSubcategories.push(newSubcategory);
  res.json({ success: true, subcategory: newSubcategory });
});

app.put('/api/subcategories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockSubcategories.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSubcategories[index] = { ...mockSubcategories[index], ...req.body };
    res.json({ success: true, subcategory: mockSubcategories[index] });
  } else {
    res.status(404).json({ success: false, message: 'Subcategory not found' });
  }
});

app.delete('/api/subcategories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockSubcategories.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSubcategories.splice(index, 1);
    res.json({ success: true, message: 'Subcategory deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Subcategory not found' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  let filteredProducts = [...mockProducts];
  
  if (req.query.categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId == req.query.categoryId);
  }
  
  if (req.query.subcategoryId) {
    filteredProducts = filteredProducts.filter(p => p.subcategoryId == req.query.subcategoryId);
  }
  
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json({
    success: true,
    products: filteredProducts
  });
});

// Upload route (mock)
app.post('/api/uploads', (req, res) => {
  res.json({
    success: true,
    imageUrl: 'https://via.placeholder.com/300x200?text=Uploaded+Image'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: username=admin, password=admin123`);
});

module.exports = app;

