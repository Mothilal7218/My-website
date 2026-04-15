import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { 
  BookOpen, 
  Mail, 
  MapPin, 
  Star, 
  ArrowRight, 
  Menu, 
  X,
  Instagram,
  Twitter,
  ExternalLink,
  Send,
  ChevronUp,
  Quote,
  User,
  ShoppingCart,
  Heart,
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  Zap,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { articles, type Article } from './data/articles';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

// ============================================
// ANIMATED BACKGROUND COMPONENT
// ============================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-spidey-red/20 rounded-full blur-[150px] animate-orb-float-1" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-spidey-blue/20 rounded-full blur-[120px] animate-orb-float-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-spidey-red/10 rounded-full blur-[200px] animate-pulse-slow" />
      
      {/* Web pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="web-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L50 100 M0 50 L100 50 M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5" fill="none"/>
            <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.3" fill="none"/>
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.2" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#web-pattern)" />
      </svg>
      
      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-particle-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#E23636' : i % 3 === 1 ? '#2B3784' : '#ffffff',
            opacity: Math.random() * 0.5 + 0.2,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}
      
      {/* Corner web decorations */}
      <svg className="absolute top-0 left-0 w-64 h-64 opacity-10" viewBox="0 0 200 200">
        {[...Array(8)].map((_, i) => (
          <line key={`tl1-${i}`} x1="0" y1="0" x2="200" y2={i * 25} stroke="#E23636" strokeWidth="1" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`tl2-${i}`} x1="0" y1="0" x2={i * 25} y2="200" stroke="#E23636" strokeWidth="1" />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle key={`tlc-${i}`} cx="0" cy="0" r={(i + 1) * 40} stroke="#E23636" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
      
      <svg className="absolute top-0 right-0 w-64 h-64 opacity-10" viewBox="0 0 200 200" style={{ transform: 'scaleX(-1)' }}>
        {[...Array(8)].map((_, i) => (
          <line key={`tr1-${i}`} x1="0" y1="0" x2="200" y2={i * 25} stroke="#2B3784" strokeWidth="1" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`tr2-${i}`} x1="0" y1="0" x2={i * 25} y2="200" stroke="#2B3784" strokeWidth="1" />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle key={`trc-${i}`} cx="0" cy="0" r={(i + 1) * 40} stroke="#2B3784" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
      
      <svg className="absolute bottom-0 left-0 w-64 h-64 opacity-10" viewBox="0 0 200 200" style={{ transform: 'scaleY(-1)' }}>
        {[...Array(8)].map((_, i) => (
          <line key={`bl1-${i}`} x1="0" y1="0" x2="200" y2={i * 25} stroke="#2B3784" strokeWidth="1" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`bl2-${i}`} x1="0" y1="0" x2={i * 25} y2="200" stroke="#2B3784" strokeWidth="1" />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle key={`blc-${i}`} cx="0" cy="0" r={(i + 1) * 40} stroke="#2B3784" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
      
      <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-10" viewBox="0 0 200 200" style={{ transform: 'scale(-1)' }}>
        {[...Array(8)].map((_, i) => (
          <line key={`br1-${i}`} x1="0" y1="0" x2="200" y2={i * 25} stroke="#E23636" strokeWidth="1" />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`br2-${i}`} x1="0" y1="0" x2={i * 25} y2="200" stroke="#E23636" strokeWidth="1" />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle key={`brc-${i}`} cx="0" cy="0" r={(i + 1) * 40} stroke="#E23636" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
      
      {/* Shooting stars */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star"
          style={{
            top: `${Math.random() * 50}%`,
            left: '-100px',
            animationDelay: `${i * 3 + Math.random() * 5}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// NAVIGATION COMPONENT
// ============================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Books', href: '#books' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-spidey-black/90 backdrop-blur-xl border-b-2 border-spidey-red/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-comic text-2xl text-spidey-red tracking-wider hover:text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(226,54,54,1)] hover:scale-110">
            🕷️ BOOK STORE
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative font-body font-bold text-white/80 hover:text-spidey-red transition-all duration-300 group uppercase tracking-wide"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-spidey-red transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#E23636]" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user?.isAdmin && (
              <Button 
                variant="outline"
                className="border-2 border-spidey-blue text-spidey-blue-light hover:bg-spidey-blue hover:text-white font-comic"
                onClick={() => navigate('/admin')}
              >
                <LayoutDashboard size={18} className="mr-2" /> Admin
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-spidey-red to-spidey-red-dark rounded-full flex items-center justify-center border-2 border-white/50">
                <User size={18} className="text-white" />
              </div>
              <span className="font-body text-white/80">{user?.name}</span>
            </div>
            <Button 
              variant="outline"
              className="border-2 border-spidey-red text-spidey-red hover:bg-spidey-red hover:text-white font-comic"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-spidey-red hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-spidey-red/50 animate-comic-pop bg-spidey-black/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body font-bold text-white hover:text-spidey-red transition-colors uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              {user?.isAdmin && (
                <Button 
                  className="bg-spidey-blue text-white font-comic mt-2 border-2 border-white"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button 
                variant="outline"
                className="border-2 border-spidey-red text-spidey-red font-comic mt-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 relative z-10 text-center">
        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-spidey-blue/20 backdrop-blur-sm rounded-full border border-spidey-blue/50 transition-all duration-700 ${isVisible ? 'animate-bounce-in' : ''}`}>
            <MapPin size={18} className="text-spidey-red animate-heartbeat" />
            <span className="text-sm font-body text-white font-bold">Independent Author from India, Now in France</span>
          </div>

          <h1 className="font-comic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
            <span className={`block overflow-hidden transition-all duration-700 ${isVisible ? 'animate-light-speed-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
              WITH GREAT
            </span>
            <span className={`block overflow-hidden transition-all duration-700 ${isVisible ? '' : 'opacity-0'}`} style={{ animationDelay: '400ms', animation: isVisible ? 'light-speed-in 0.8s ease-out 0.4s forwards' : 'none' }}>
              <span className="text-spidey-red animate-neon-flicker">STORIES</span> COMES
            </span>
            <span className={`block overflow-hidden transition-all duration-700 ${isVisible ? '' : 'opacity-0'}`} style={{ animationDelay: '500ms', animation: isVisible ? 'light-speed-in 0.8s ease-out 0.5s forwards' : 'none' }}>
              GREAT <span className="text-spidey-blue-light">HEALING</span>
            </span>
          </h1>

          <p className={`font-body text-xl text-white/70 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '600ms' }}>
            I write books for young people going through difficult phases — breakups, sadness, loneliness, and emotional darkness. My words are your companion when life feels heavy.
          </p>

          <div className={`flex flex-wrap justify-center gap-6 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '800ms' }}>
            <Button size="lg" className="bg-spidey-red text-white font-comic text-xl tracking-wider hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-2 hover:shadow-spidey-lg hover:scale-110 border-2 border-white/50 animate-pulse-glow" asChild>
              <a href="#books" className="flex items-center gap-2">
                <BookOpen size={22} className="animate-bounce" /> Explore Books
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-spidey-blue text-spidey-blue-light hover:bg-spidey-blue hover:text-white font-comic text-xl transition-all duration-300 hover:-translate-y-2 hover:scale-110" asChild>
              <a href="#about" className="flex items-center gap-2">
                <Zap size={22} className="animate-pulse" /> Know My Story
              </a>
            </Button>
          </div>

          <div className={`flex flex-wrap justify-center gap-8 pt-6 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1000ms' }}>
            <div className="flex items-center gap-3 bg-spidey-red/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-spidey-red/50 hover:scale-110 transition-transform cursor-default hover:bg-spidey-red/30">
              <BookOpen size={24} className="text-spidey-red" />
              <span className="font-comic text-white text-xl">3 BOOKS</span>
            </div>
            <div className="flex items-center gap-3 bg-spidey-blue/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-spidey-blue/50 hover:scale-110 transition-transform cursor-default hover:bg-spidey-blue/30">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="font-comic text-white text-xl">5.0★ RATING</span>
            </div>
            <div className="flex items-center gap-3 bg-spidey-red/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-spidey-red/50 hover:scale-110 transition-transform cursor-default hover:bg-spidey-red/30">
              <Heart size={24} className="text-spidey-red animate-heartbeat" />
              <span className="font-comic text-white text-xl">1000+ READERS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BOOKS SECTION
// ============================================
function BooksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const books = [
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
  ];

  const featuredBook = books.find(b => b.featured);
  const otherBooks = books.filter(b => !b.featured);

  return (
    <section id="books" ref={sectionRef} className="py-24 relative">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-spidey-red/10 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-6 py-2 bg-spidey-red/20 backdrop-blur-sm text-spidey-red font-comic text-lg tracking-wider rounded-full border border-spidey-red/50 mb-4 animate-spidey-sense">
            📚 THE COLLECTION
          </span>
          <h2 className="font-comic text-4xl md:text-5xl lg:text-6xl text-white text-spidey-glow mb-4">STORIES THAT HEAL</h2>
          <p className="font-body text-white/60 text-lg">Raw, unfiltered narratives about the struggles we rarely speak about — but all feel.</p>
        </div>

        {featuredBook && (
          <div className={`bg-spidey-blue/10 backdrop-blur-xl border-2 border-spidey-red/50 rounded-3xl overflow-hidden mb-12 transition-all duration-700 hover:shadow-spidey-lg hover:border-spidey-red ${isVisible ? 'animate-flip-in' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-spidey-red to-spidey-blue rounded-2xl opacity-50 blur-lg animate-spidey-sense" />
                <div className="relative overflow-hidden rounded-2xl shadow-spidey-lg transition-all duration-500 group-hover:-translate-y-2">
                  <img src={featuredBook.image} alt={featuredBook.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="font-comic text-3xl md:text-4xl text-white text-spidey-glow mb-2">{featuredBook.title}</h3>
                  <p className="font-body text-spidey-red font-bold text-lg">{featuredBook.subtitle}</p>
                </div>
                <p className="font-body text-white/60 leading-relaxed">{featuredBook.description}</p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1 bg-spidey-red/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-spidey-red/50">
                    <Star size={18} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                    <span className="font-comic text-white text-lg">{featuredBook.rating}</span>
                    <span className="text-white/50 text-sm">({featuredBook.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-spidey-red text-white font-comic text-lg tracking-wider hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-2 hover:shadow-spidey border-2 border-white/50" asChild>
                    <a href={featuredBook.amazonLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ShoppingCart size={20} /> Buy on Amazon
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-spidey-blue text-spidey-blue-light hover:bg-spidey-blue hover:text-white font-comic text-lg transition-all duration-300 hover:-translate-y-2" asChild>
                    <a href={featuredBook.kindleLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <BookOpen size={20} /> Kindle
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {otherBooks.map((book, index) => (
            <div 
              key={book.id} 
              className={`bg-spidey-blue/5 backdrop-blur-sm border-2 border-spidey-blue/30 rounded-2xl overflow-hidden group transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02] hover:border-spidey-red hover:shadow-spidey-lg ${isVisible ? 'animate-flip-in' : 'opacity-0'}`} 
              style={{ animationDelay: `${400 + index * 200}ms` }}
            >
              <div className="grid sm:grid-cols-2 gap-6 p-6">
                <div className="relative overflow-hidden rounded-xl border-2 border-spidey-red/50">
                  <img src={book.image} alt={book.title} className="w-full h-48 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <h4 className="font-comic text-2xl text-white mb-1">{book.title}</h4>
                    <p className="font-body text-sm text-spidey-red font-bold">{book.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                    <span className="text-sm font-comic text-white">{book.rating}</span>
                    <span className="text-white/50 text-xs">({book.reviews} reviews)</span>
                  </div>
                  <p className="font-body text-white/50 text-sm leading-relaxed line-clamp-3">{book.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-spidey-red text-white font-comic hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-white/50" asChild>
                      <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><ShoppingCart size={14} /> Buy</a>
                    </Button>
                    <Button size="sm" variant="outline" className="border-2 border-spidey-blue text-spidey-blue-light hover:bg-spidey-blue hover:text-white font-comic transition-all duration-300 hover:-translate-y-1 hover:scale-105" asChild>
                      <a href={book.kindleLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><ExternalLink size={14} /> Kindle</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// REVIEWS SECTION
// ============================================
function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reviews = [
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
  ];

  return (
    <section id="reviews" ref={sectionRef} className="py-24 relative">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-spidey-blue/15 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-6 py-2 bg-spidey-blue/20 backdrop-blur-sm text-spidey-blue-light font-comic text-lg tracking-wider rounded-full border border-spidey-blue/50 mb-4">
            <Star size={18} className="inline mr-2 fill-yellow-400" /> 5.0 RATING
          </span>
          <h2 className="font-comic text-4xl md:text-5xl lg:text-6xl text-white text-blue-glow mb-4">WHAT READERS ARE SAYING</h2>
          <p className="font-body text-white/60 text-lg">Real reviews from Amazon readers who found comfort in these words.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`bg-spidey-black/50 backdrop-blur-xl border-2 border-spidey-red/50 rounded-2xl p-6 transition-all duration-700 hover:-translate-y-4 hover:scale-105 hover:shadow-spidey-lg ${isVisible ? 'animate-comic-pop' : 'opacity-0 translate-y-8'}`} 
              style={{ animationDelay: `${200 + index * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-spidey-red to-spidey-red-dark rounded-full flex items-center justify-center border-2 border-white/50">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-comic text-white text-lg">{review.name}</h4>
                    <p className="font-body text-sm text-white/50">{review.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-spidey-red/20 backdrop-blur-sm px-3 py-1 rounded-full border border-spidey-red/50">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-comic text-white">{review.rating}.0</span>
                </div>
              </div>
              <h5 className="font-comic text-spidey-red mb-2 text-sm">{review.title}</h5>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-spidey-blue/20 text-white/70 text-xs font-body rounded-full border border-spidey-blue/30">Review for: {review.book}</span>
              </div>
              <div className="relative mb-4">
                <Quote size={24} className="absolute -top-2 -left-2 text-spidey-red/30" />
                <p className="font-body text-white/60 leading-relaxed pl-6 text-sm">{review.text}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-body text-sm text-white/50">{review.date}</p>
                {review.verified && <span className="text-xs text-spidey-red font-comic">✓ VERIFIED</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// QUOTE SECTION
// ============================================
function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-r from-spidey-red via-spidey-red to-spidey-red-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-2 h-2 bg-white rounded-full animate-particle-float"
            style={{ left: `${i * 5}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      
      <div className={`absolute top-8 left-8 text-white/10 transition-all duration-1000 ${isVisible ? 'opacity-100 animate-rotate-in' : 'opacity-0'}`}>
        <Quote size={120} />
      </div>
      <div className={`absolute bottom-8 right-8 text-white/10 rotate-180 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '200ms', animation: isVisible ? 'rotate-in 1s ease-out 0.2s forwards' : 'none' }}>
        <Quote size={120} />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <blockquote className="font-comic text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed mb-8 drop-shadow-lg">
            "For anyone who's ever felt like they're struggling to keep it together while the world moves on without them. For anyone who needs the courage to stop pretending and start healing."
          </blockquote>
          <cite className="font-body text-white/80 not-italic text-lg font-bold">— From '23 and Broken'</cite>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ABOUT SECTION - NO PHOTO
// ============================================
function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'BOOKS', value: '3', icon: BookOpen },
    { label: 'READERS', value: '1000+', icon: Heart },
    { label: 'LOCATION', value: 'FRANCE', icon: MapPin },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-spidey-blue/10 rounded-full blur-[200px]" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-6 py-2 bg-spidey-red/20 backdrop-blur-sm text-spidey-red font-comic text-lg tracking-wider rounded-full border border-spidey-red/50 mb-4">
            🕷️ ABOUT ME
          </span>
          <h2 className="font-comic text-4xl md:text-5xl text-white text-spidey-glow">THE AUTHOR BEHIND THE MASK</h2>
        </div>

        <div className={`bg-spidey-blue/10 backdrop-blur-xl border-2 border-spidey-blue/50 rounded-3xl p-8 lg:p-12 transition-all duration-1000 hover:border-spidey-red/50 hover:shadow-spidey-lg ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <div className="space-y-4 font-body text-white/70 leading-relaxed text-lg">
              <p>My name is <span className="text-spidey-red font-bold">Mothilal Shankar</span>. I am an independent author from India, currently living in France. I write books for young people who are going through difficult phases of life — breakups, sadness, loneliness, and emotional darkness.</p>
              <p>My writing comes from real emotions and lived experiences. I understand what it feels like to feel lost, unheard, or broken inside. Through my books, I aim to reach those who are silently struggling and help them find clarity, strength, and hope during their darkest moments.</p>
              <p className="text-spidey-red font-bold text-xl">As an author, my purpose is not just to write, but to support, guide, and inspire young minds to move forward, rebuild themselves, and believe in their own worth again.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12 pt-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className={`text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`} 
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-spidey-red/30 to-spidey-red/10 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-spidey-red/50">
                    <stat.icon size={28} className="text-spidey-red" />
                  </div>
                  <div className="font-comic text-4xl text-spidey-red text-spidey-glow">{stat.value}</div>
                  <div className="font-body text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 pt-6">
              <a href="#" className="p-4 bg-spidey-red rounded-full text-white hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-2 hover:scale-110 border-2 border-white/50 hover:shadow-spidey" aria-label="Instagram">
                <Instagram size={22} />
              </a>
              <a href="#" className="p-4 bg-spidey-blue rounded-full text-white hover:bg-spidey-blue-light transition-all duration-300 hover:-translate-y-2 hover:scale-110 border-2 border-white/50 hover:shadow-[0_0_20px_#2B3784]" aria-label="Twitter">
                <Twitter size={22} />
              </a>
              <a href="https://www.amazon.in/Mothilal-Shankar/e/B0FLWD73CG" target="_blank" rel="noopener noreferrer" className="p-4 bg-spidey-red rounded-full text-white hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-2 hover:scale-110 border-2 border-white/50 hover:shadow-spidey" aria-label="Amazon">
                <ExternalLink size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG SECTION
// ============================================
function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (selectedArticle) {
    return (
      <section id="blog" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-spidey-red hover:text-white transition-colors mb-8 font-comic text-lg">
            <ArrowLeft size={20} /> BACK TO ALL ARTICLES
          </button>
          <article className="animate-comic-pop">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1 bg-spidey-red/20 backdrop-blur-sm text-spidey-red font-comic text-sm rounded-full border border-spidey-red/50 flex items-center gap-1">
                <Tag size={14} /> {selectedArticle.category}
              </span>
              <span className="text-white/50 text-sm flex items-center gap-1"><Calendar size={14} /> {selectedArticle.date}</span>
              <span className="text-white/50 text-sm flex items-center gap-1"><Clock size={14} /> {selectedArticle.readTime}</span>
            </div>
            <h1 className="font-comic text-4xl md:text-5xl text-white text-spidey-glow mb-8">{selectedArticle.title}</h1>
            <div className="prose prose-lg max-w-none">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="font-body text-white/60 leading-relaxed mb-6">{paragraph.trim()}</p>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t-2 border-spidey-red/50">
              <p className="font-body text-white/50 text-sm">Written by <span className="text-spidey-red font-comic">Mothilal Shankar</span></p>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" ref={sectionRef} className="py-24 relative">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-spidey-red/10 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-6 py-2 bg-spidey-blue/20 backdrop-blur-sm text-spidey-blue-light font-comic text-lg tracking-wider rounded-full border border-spidey-blue/50 mb-4">
            📝 MY BLOG
          </span>
          <h2 className="font-comic text-4xl md:text-5xl lg:text-6xl text-white text-blue-glow mb-4">THOUGHTS & REFLECTIONS</h2>
          <p className="font-body text-white/60 text-lg">Short pieces on life, struggles, and finding hope in unexpected places.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className={`bg-spidey-black/50 backdrop-blur-xl border-2 border-spidey-blue/50 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-700 hover:-translate-y-4 hover:border-spidey-red hover:shadow-spidey-lg ${isVisible ? 'animate-flip-in' : 'opacity-0 translate-y-8'}`}
              style={{ animationDelay: `${200 + index * 150}ms` }}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-spidey-red/20 text-spidey-red text-xs font-comic rounded-full border border-spidey-red/50">{article.category}</span>
                  <span className="text-white/50 text-sm flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                </div>
                <h3 className="font-comic text-xl text-white mb-3 group-hover:text-spidey-red transition-colors">{article.title}</h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-6">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                  <span className="flex items-center gap-1 text-spidey-red font-comic text-sm group-hover:text-white transition-colors">
                    READ MORE <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// NEWSLETTER SECTION
// ============================================
function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 relative">
      <div className="absolute top-10 right-10 w-64 h-64 bg-spidey-red/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-spidey-blue/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-6 py-2 bg-spidey-red/20 backdrop-blur-sm text-spidey-red font-comic text-lg tracking-wider rounded-full border border-spidey-red/50 mb-4 animate-spidey-sense">
            📧 JOIN THE TEAM
          </span>
          <h2 className="font-comic text-4xl md:text-5xl text-white text-spidey-glow mb-4">JOIN THE JOURNEY</h2>
          <p className="font-body text-white/60 text-lg mb-8">Get weekly reflections on life, writing, and finding hope. No spam, just honest words.</p>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 h-14 px-4 bg-spidey-black/50 backdrop-blur-sm border-2 border-spidey-blue/50 text-white placeholder:text-white/40 focus:border-spidey-red font-body text-lg" required />
              <Button type="submit" className="h-14 px-8 bg-spidey-red text-white font-comic text-lg tracking-wider hover:bg-spidey-red-dark transition-all duration-300 hover:-translate-y-1 border-2 border-white/50 hover:shadow-spidey">
                <Send size={20} className="mr-2" /> SUBSCRIBE
              </Button>
            </form>
          ) : (
            <div className="bg-spidey-blue/10 backdrop-blur-xl border-2 border-spidey-red/50 rounded-xl p-8 animate-comic-pop">
              <div className="w-16 h-16 bg-gradient-to-br from-spidey-red to-spidey-red-dark rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/50 animate-bounce">
                <Send size={32} className="text-white" />
              </div>
              <h3 className="font-comic text-2xl text-white mb-2">THANK YOU!</h3>
              <p className="font-body text-white/60">You've been added to the team. Watch your inbox for reflections.</p>
            </div>
          )}
          <p className="font-body text-white/50 text-sm mt-6">I respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-spidey-black/80 backdrop-blur-xl border-t-2 border-spidey-red/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="font-comic text-2xl text-spidey-red mb-4 drop-shadow-[0_0_15px_rgba(226,54,54,1)]">🕷️ BOOK STORE</h3>
            <p className="font-body text-white/60 text-sm leading-relaxed">Giving voice to silent struggles through raw emotional storytelling.</p>
          </div>
          <div>
            <h4 className="font-comic text-white text-lg mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {['Home', 'Books', 'Reviews', 'About', 'Blog'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="font-body text-white/60 hover:text-spidey-red transition-colors text-sm uppercase">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-comic text-white text-lg mb-4">CONNECT</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-spidey-red rounded-full text-white hover:bg-spidey-red-dark transition-colors border border-white/50" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-spidey-blue rounded-full text-white hover:bg-spidey-blue-light transition-colors border border-white/50" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="https://www.amazon.in/Mothilal-Shankar/e/B0FLWD73CG" target="_blank" rel="noopener noreferrer" className="p-2 bg-spidey-red rounded-full text-white hover:bg-spidey-red-dark transition-colors border border-white/50" aria-label="Amazon"><ExternalLink size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-comic text-white text-lg mb-4">CONTACT</h4>
            <a href="mailto:hello@mothilalshankar.com" className="flex items-center gap-2 font-body text-white/60 hover:text-spidey-red transition-colors text-sm">
              <Mail size={16} /> hello@mothilalshankar.com
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/50 text-sm">© {new Date().getFullYear()} Book Store. All rights reserved.</p>
          <button onClick={scrollToTop} className="flex items-center gap-2 font-comic text-spidey-red hover:text-white transition-colors text-sm">
            BACK TO TOP <ChevronUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN HOME PAGE
// ============================================
function HomePage() {
  return (
    <>
      <HeroSection />
      <BooksSection />
      <ReviewsSection />
      <QuoteSection />
      <AboutSection />
      <BlogSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-spidey-black relative">
          <AnimatedBackground />
          <Routes>
            {/* Public route - Login page */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - Require login */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <main className="relative z-10">
                    <HomePage />
                  </main>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
