import React, { useRef } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import img4 from '../images/img4.png';
import Footer from './Footer';

function Home() {
  const getStartedRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="overlay">
          <div className="hero-overlay-content">
            <div className="hero-left">
              <img src={img4} alt="Laptop with Room Page" className="hero-image" />
            </div>
            <div className="hero-right">
              <h1>Welcome to coStream</h1>
              <p>
                Transform your movie nights into a shared, immersive experience where the only thing you worry about is which film to watch next!
              </p>
              <p>
                At coStream, we’ve reimagined movie nights. Enjoy seamless, high-definition streaming of your locally stored videos—no need for ultra-fast connections or constant interruptions. Plus, our real-time chat feature lets you share laughs, reactions, and commentary with friends as you watch.
              </p>
              <button className="cta-btn" onClick={() => scrollToSection(getStartedRef)}>Get Started</button>
              {/* <button className="cta-btn" onClick={() => scrollToSection(howItWorksRef)}>How it Works</button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="get-started-section" ref={getStartedRef}>
        <div className="room-box">
          <div className="room-box-left">
          </div>
          <div className="room-box-right">
          <Link to="/create">
            <button className="ctb-btn">Create Room</button>
          </Link>
          <Link to="/join">
            <button className="ctb-btn">Join Room</button>
          </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;




