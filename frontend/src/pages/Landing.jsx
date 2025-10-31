import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBed, FaBath, FaRupeeSign, FaRegHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// Sample data - replace with actual API call
const sampleProperties = [
  {
    id: 1,
    title: "Modern 2BHK in South City",
    location: "South City, Bangalore",
    price: 25000,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.5,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1"
  },
  {
    id: 2,
    title: "Luxury 3BHK with Garden",
    location: "Whitefield, Bangalore",
    price: 35000,
    bedrooms: 3,
    bathrooms: 3,
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1"
  },
  // Add more sample properties
];

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <div className="min-vh-100">
      {/* Hero Section with Glass Morphism */}
      <div className="position-relative">
        <div 
          className="hero-section position-relative d-flex align-items-center justify-content-center text-white"
          style={{
            height: '80vh',
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1") center/cover no-repeat',
          }}
        >
          <div 
            className="text-center p-5 rounded-3"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h1 className="display-4 fw-bold mb-4">Find Your Perfect Home</h1>
            <p className="lead mb-4">Search from thousands of rental properties across India</p>
            
            {/* Search Bar with Glass Effect */}
            <div 
              className="search-bar mx-auto"
              style={{
                maxWidth: '800px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
              }}
            >
              <form className="d-flex p-2 align-items-center">
                <div className="input-group border-0">
                  <span className="input-group-text bg-transparent border-0 text-white">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-transparent text-white"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      '::placeholder': { color: 'rgba(255,255,255,0.8)' }
                    }}
                  />
                  <select 
                    className="form-select form-select-lg border-0 bg-transparent text-white"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{ maxWidth: '200px' }}
                  >
                    <option value="">All Cities</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                  </select>
                  <button 
                    className="btn btn-lg text-white px-4" 
                    style={{ 
                      background: '#ff4d4d',
                      borderRadius: '50px',
                      marginLeft: '10px'
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5">Featured Properties</h2>
        <div className="row g-4">
          {sampleProperties.map(property => (
            <div key={property.id} className="col-md-4">
              <div 
                className="card border-0 h-100 shadow-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="position-relative">
                  <img 
                    src={property.image} 
                    className="card-img-top" 
                    alt={property.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <button 
                    className="btn position-absolute top-0 end-0 m-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    <FaRegHeart className="text-white" />
                  </button>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{property.title}</h5>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      <span>{property.rating}</span>
                      <small className="text-muted ms-1">({property.reviews})</small>
                    </div>
                  </div>
                  <p className="card-text text-muted">
                    <FaMapMarkerAlt className="me-1" />
                    {property.location}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-3">
                      <span><FaBed className="me-1" /> {property.bedrooms}</span>
                      <span><FaBath className="me-1" /> {property.bathrooms}</span>
                    </div>
                    <div className="fs-5 fw-bold" style={{ color: '#ff4d4d' }}>
                      <FaRupeeSign className="me-1" size={14} />
                      {property.price.toLocaleString()}
                    </div>
                  </div>
                  <Link 
                    to={`/properties/${property.id}`} 
                    className="btn w-100"
                    style={{ 
                      background: '#ff4d4d',
                      color: 'white'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Co-Live</h2>
          <div className="row g-4">
            {[
              {
                title: "Verified Properties",
                description: "All properties are personally verified by our team",
                icon: "🏠"
              },
              {
                title: "Zero Brokerage",
                description: "No hidden charges or brokerage fees",
                icon: "💰"
              },
              {
                title: "Instant Support",
                description: "24/7 support for all your queries",
                icon: "📞"
              }
            ].map((feature, index) => (
              <div key={index} className="col-md-4">
                <div 
                  className="card h-100 border-0 text-center p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="py-5 text-white"
        style={{
          background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
        }}
      >
        <div className="container text-center">
          <h2 className="mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="lead mb-4">Join thousands of happy tenants who found their home with Co-Live</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-light btn-lg px-4">Sign Up Now</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">Login</Link>
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
                <li><Link to="/about" className="text-muted">About Us</Link></li>
                <li><Link to="/contact" className="text-muted">Contact</Link></li>
                <li><Link to="/terms" className="text-muted">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p className="text-muted">
                Email: support@colive.com<br />
                Phone: +91 1234567890
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}