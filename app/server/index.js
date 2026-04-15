const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ============== SCHEMAS ==============

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Visitor Schema (for tracking)
const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// Newsletter Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// ============== AUTH MIDDLEWARE ==============

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// ============== AUTH ROUTES ==============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        loginCount: user.loginCount
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============== TRACKING ROUTES ==============

// Track visitor
app.post('/api/track/visit', async (req, res) => {
  try {
    const { page } = req.body;
    const visitor = new Visitor({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      page
    });
    await visitor.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============== ADMIN DASHBOARD ROUTES ==============

// Get stats (Admin only)
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();
    const todayVisitors = await Visitor.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    // Get users list
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Get recent visitors
    const recentVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVisitors,
        totalSubscribers,
        todayVisitors
      },
      users,
      recentVisitors
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============== PUBLIC ROUTES ==============

// Get books
app.get('/api/books', (req, res) => {
  res.json([
    {
      id: 1,
      title: "23 and Broken",
      subtitle: "A raw exploration of the emotional battles faced by young adults at 23",
      description: "At an age where society demands clarity and achievement, this book brings light to the struggles many feel but rarely speak about.",
      image: "/images/book-23-broken.jpg",
      rating: "5.0",
      reviews: 5,
      amazonLink: "https://www.amazon.in/23-Broken-Mothilal-Shankar-ebook/dp/B0FJGB2DGM",
      kindleLink: "https://www.amazon.in/23-Broken-Mothilal-Shankar-ebook/dp/B0FJGB2DGM",
      featured: true
    },
    {
      id: 2,
      title: "Mistakes",
      subtitle: "The Wrong Turns That Shape the Right Path",
      description: "Raw, relatable stories about the years when life feels uncertain. Every wrong step can still lead to the right destination.",
      image: "/images/book-mistakes.jpg",
      rating: "5.0",
      reviews: 2,
      amazonLink: "https://www.amazon.in/Mistakes-Wrong-Turns-Shape-Right-ebook/dp/B0FLSXJPG8",
      kindleLink: "https://www.amazon.in/Mistakes-Wrong-Turns-Shape-Right-ebook/dp/B0FLSXJPG8",
      featured: false
    },
    {
      id: 3,
      title: "Being Alone Could Be a Gift",
      subtitle: "A Story of Self-Discovery in France",
      description: "A heartfelt story of a young man rebuilding himself in France. From silence and lonely mornings, he discovers strength and hope.",
      image: "/images/book-alone-gift.jpg",
      rating: "5.0",
      reviews: 3,
      amazonLink: "https://www.amazon.in/Being-alone-could-be-gift-ebook/dp/B0G2DYGY2J",
      kindleLink: "https://www.amazon.in/Being-alone-could-be-gift-ebook/dp/B0G2DYGY2J",
      featured: false
    }
  ]);
});

// Get reviews
app.get('/api/reviews', (req, res) => {
  res.json([
    {
      id: 1,
      name: "M.sharuk",
      location: "India",
      rating: 5,
      book: "23 and Broken",
      title: "Really an amazing book",
      text: "Really an amazing book to read..the context are we can connect in our life especially as a youth..",
      date: "9 February 2026",
      verified: true
    },
    {
      id: 2,
      name: "salla goutham",
      location: "India",
      rating: 5,
      book: "23 and Broken",
      title: "At 23, life feels like it's supposed to begin...",
      text: '"23 and Broken" is not just a story, it\'s a raw, honest reflection of what many silently go through...',
      date: "25 July 2025",
      verified: true
    },
    {
      id: 3,
      name: "vishnu kumar",
      location: "India",
      rating: 5,
      book: "23 and Broken",
      title: "Emotional & Relatable",
      text: "Just finished 23 and Broken by Mothilal Shankar — raw, honest, and incredibly relatable.",
      date: "24 July 2025",
      verified: true
    }
  ]);
});

// Newsletter signup
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============== START SERVER ==============

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin/stats`);
});
