// src/pages/Landing.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from '../config';
import { Link, useNavigate } from "react-router-dom";
import { getToken, getUserFromToken, logout } from "../utils/auth";
import {
  FaSearch, FaBed, FaBath, FaRupeeSign, FaHeart,
  FaRegHeart, FaStar, FaMapMarkerAlt, FaShoppingCart,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(getUserFromToken());
  const navigate = useNavigate();

  // Listen for auth changes (login/logout in another tab etc.)
  useEffect(() => {
    const onAuth = () => setAuthUser(getUserFromToken());
    window.addEventListener('authChanged', onAuth);
    return () => window.removeEventListener('authChanged', onAuth);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthUser(null);
  };

  const getDashboardPath = () => {
    if (!authUser) return '/login';
    if (authUser.role === 'admin') return '/admin/dashboard';
    if (authUser.role === 'landlord') return '/landlord/dashboard';
    return '/dashboard';
  };

  // Dummy data if API empty/unreachable
  const dummyProperties = [
    {
      _id: "demo1",
      title: "Modern 2BHK in South City",
      address: { city: "Bangalore", state: "Karnataka" },
      price: 25000,
      bedrooms: 2,
      bathrooms: 2,
      rating: 4.5,
      reviews: 28,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "demo2",
      title: "Luxury 3BHK with Garden",
      address: { city: "Bangalore", state: "Karnataka" },
      price: 35000,
      bedrooms: 3,
      bathrooms: 3,
      rating: 4.8,
      reviews: 42,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    },
    {
      _id: "demo3",
      title: "Cozy Studio Apartment",
      address: { city: "Pune", state: "Maharashtra" },
      price: 15000,
      bedrooms: 1,
      bathrooms: 1,
      rating: 4.3,
      reviews: 15,
      image:
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80",
    },
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/property`);
      const data = await res.json();
      const valid =
        res.ok && Array.isArray(data) && data.length > 0
          ? data.filter((p) => p.verified || p.status === "approved")
          : dummyProperties;
      setProperties(valid.length ? valid : dummyProperties);
    } catch (err) {
      console.warn("API failed — using dummy data");
      setProperties(dummyProperties);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleBuy = (property) =>
    alert(
      property._id.startsWith("demo")
        ? `Feature coming soon: buying ${property.title}`
        : `You expressed interest in buying ${property.title}`
    );

  const filtered = properties.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity =
      !selectedCity ||
      p.address.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchQuery && matchCity;
  });

  return (
    <div className="min-vh-100">

      {/* ── Site Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #f0e0e0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between" style={{ height: 60 }}>
            {/* Logo */}
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
              <span style={{
                width: 34, height: 34, background: '#ff4d4d', borderRadius: 8,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>🏠</span>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1a1a1a', letterSpacing: '-0.3px' }}>
                Co‑Live
              </span>
            </Link>

            {/* Right side — changes based on auth state */}
            <div className="d-flex align-items-center gap-2">
              {authUser ? (
                // Logged in — show user name + go to dashboard
                <>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 600, color: '#555',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#ff4d4d', color: 'white',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {authUser.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                    {authUser.name?.split(' ')[0]}
                  </span>
                  <Link
                    to={getDashboardPath()}
                    className="btn btn-sm fw-600"
                    style={{
                      background: '#ff4d4d', color: 'white', borderRadius: 8,
                      padding: '6px 16px', fontWeight: 600, fontSize: '0.85rem',
                      border: 'none',
                    }}
                  >
                    Go to Dashboard →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm"
                    style={{
                      background: 'transparent', color: '#888',
                      border: '1px solid #e0e0e0', borderRadius: 8,
                      padding: '6px 14px', fontSize: '0.85rem',
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Logged out — show Login / Sign Up
                <>
                  <Link
                    to="/login"
                    className="btn btn-sm"
                    style={{
                      background: 'transparent', color: '#1a1a1a',
                      border: '1.5px solid #e0e0e0', borderRadius: 8,
                      padding: '6px 18px', fontWeight: 600, fontSize: '0.85rem',
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm"
                    style={{
                      background: '#ff4d4d', color: 'white',
                      border: '1.5px solid #ff4d4d', borderRadius: 8,
                      padding: '6px 18px', fontWeight: 600, fontSize: '0.85rem',
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="position-relative">
        <div
          className="hero-section d-flex align-items-center justify-content-center text-white"
          style={{
            height: "80vh",
            background:
              'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat',
          }}
        >
          <div
            className="text-center p-5 rounded-3"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <h1 className="display-4 fw-bold mb-4">Find Your Perfect Home</h1>
            <p className="lead mb-4">
              Search from thousands of verified properties across India
            </p>

            {/* Search Bar */}
            <div
              className="mx-auto"
              style={{
                maxWidth: "800px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "50px",
              }}
            >
              <form className="d-flex p-2 align-items-center">
                <span className="input-group-text bg-transparent border-0 text-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 bg-transparent text-white"
                  placeholder="Search by location, property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="form-select form-select-lg border-0 bg-transparent text-white"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ maxWidth: "200px" }}
                >
                  <option value="">All Cities</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                </select>
                <button
                  type="button"
                  className="btn btn-lg text-white px-4"
                  style={{
                    background: "#ff4d4d",
                    borderRadius: "50px",
                    marginLeft: "10px",
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container py-5">
        <h2 className="text-center mb-5">
          {loading ? "Loading Properties..." : "Featured Properties"}
        </h2>
        <div className="row g-4">
          {filtered.map((p) => (
            <div key={p._id} className="col-md-4">
              <div
                className="card border-0 h-100 shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div className="position-relative">
                  <img
                    src={
                      p.image ||
                      p.images?.[0] ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={p.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <button
                    className="btn position-absolute top-0 end-0 m-2"
                    onClick={() => handleWishlist(p._id)}
                    style={{
                      background: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(5px)",
                      color: wishlist.includes(p._id) ? "#ff4d4d" : "white",
                    }}
                  >
                    {wishlist.includes(p._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{p.title}</h5>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      <span>{p.rating || 4.5}</span>
                      <small className="text-muted ms-1">
                        ({p.reviews || 20})
                      </small>
                    </div>
                  </div>
                  <p className="text-muted mb-2">
                    <FaMapMarkerAlt className="me-1" />
                    {p.address.city}, {p.address.state}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-3 text-muted">
                      <span>
                        <FaBed className="me-1" /> {p.bedrooms}
                      </span>
                      <span>
                        <FaBath className="me-1" /> {p.bathrooms}
                      </span>
                    </div>
                    <div
                      className="fs-5 fw-bold"
                      style={{ color: "#ff4d4d" }}
                    >
                      <FaRupeeSign className="me-1" size={14} />
                      {p.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn flex-fill text-white"
                      style={{
                        background: "#ff4d4d",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleBuy(p)}
                    >
                      <FaShoppingCart className="me-2" /> Buy
                    </button>
                    <Link
                      to={`/properties/${p._id}`}
                      className="btn btn-outline-danger flex-fill"
                      onClick={() => {
                        if (p._id.startsWith("demo")) {
                          alert(
                            "This property is part of demo data — full details unavailable."
                          );
                        }
                      }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted">
              No matching properties found.
            </p>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose Co-Live</h2>
          <div className="row g-4">
            {[
              {
                title: "Verified Properties",
                description: "All properties are personally verified by our team before listing.",
                icon: "🏠",
                color: "#fff3f3",
                border: "#ffb3b3",
              },
              {
                title: "Zero Brokerage",
                description: "No hidden charges or brokerage fees — ever.",
                icon: "💰",
                color: "#f3fff3",
                border: "#b3e6b3",
              },
              {
                title: "Instant Support",
                description: "24/7 dedicated support for all your queries.",
                icon: "📞",
                color: "#f3f6ff",
                border: "#b3c6ff",
              },
            ].map((f, i) => (
              <div key={i} className="col-md-4">
                <div
                  className="card h-100 text-center p-4"
                  style={{
                    background: f.color,
                    border: `1.5px solid ${f.border}`,
                    borderRadius: "16px",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.07)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5 text-white" style={{ background: "linear-gradient(135deg,#ff4d4d,#ff6b6b)" }}>
        <div className="container text-center">
          <h2 className="mb-3 fw-bold">Ready to Find Your Perfect Home?</h2>
          <p className="lead mb-4 opacity-75">
            Join thousands of happy tenants who found their home with Co-Live
          </p>
          <div className="d-flex justify-content-center gap-3">
            {authUser ? (
              <Link to={getDashboardPath()} className="btn btn-light btn-lg px-5 fw-bold" style={{ borderRadius: 10 }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-light btn-lg px-5 fw-bold" style={{ borderRadius: 10 }}>
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-5" style={{ borderRadius: 10 }}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Co-Live</h5>
              <p className="text-muted">Find your perfect living space</p>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about" className="text-muted">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p className="text-muted mb-0">
                Email: support@colive.com
                <br />
                Phone: +91 1234567890
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
