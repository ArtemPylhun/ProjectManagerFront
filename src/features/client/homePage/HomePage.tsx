import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../../styles/client-styles/homePageStyles.css"; // Keep the stylesheet import

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate("/login"); // Navigate to login page

    if (localStorage.getItem("token")) {
      navigate("/projects"); // Navigate to projects page if authorized
    } else {
      navigate("/login"); // Navigate to login page if unauthorized
    }
  };

  const handleSignUp = () => {
    navigate("/register"); // Navigate to register page
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Productivity Platform</h1>
          <p>Streamline your projects, tasks, and time management with ease.</p>
          <Button
            type="primary"
            className="hero-button"
            size="large"
            onClick={handleGetStarted} // Add click handler
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Project Management</h3>
            <p>
              Organize and track projects efficiently with our intuitive tools.
            </p>
          </div>
          <div className="feature-card">
            <h3>Task Automation</h3>
            <p>
              Automate repetitive tasks to save time and focus on what matters.
            </p>
          </div>
          <div className="feature-card">
            <h3>Time Tracking</h3>
            <p>
              Monitor time entries accurately for better productivity insights.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              “This platform has transformed how we manage our projects—highly
              recommended!”
            </p>
            <p className="testimonial-author">- Jane Doe, Project Manager</p>
          </div>
          <div className="testimonial-card">
            <p>
              “Easy to use and incredibly effective for tracking time. Love it!”
            </p>
            <p className="testimonial-author">- John Smith, Developer</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Boost Your Productivity?</h2>
        <p>
          Join thousands of users who trust us to manage their work efficiently.
        </p>
        <Button
          type="primary"
          className="cta-button"
          size="large"
          onClick={handleSignUp} // Add click handler
        >
          Sign Up Now
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
