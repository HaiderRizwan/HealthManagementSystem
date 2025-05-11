import React from "react";
import "../Styles/Hero.css";

function Hero() {
  return (
    <div className="section-container">
      <div className="hero-section">
        <div className="text-section">
          <p className="text-headline">❤️ Health comes first</p>
          <h2 className="text-title">
            Find your Doctor and make an Appointments
          </h2>
          <p className="text-descritpion">
            Talk to online doctors and get medical advice, online prescriptions,
            refills and medical notes within minutes. On-demand healthcare
            services at your fingertips.
          </p>
          <div className="text-stats">
            <div className="text-stats-container">
              <p>145k+</p>
              <p>Receive Patients</p>
            </div>

            <div className="text-stats-container">
              <p>50+</p>
              <p>Expert Doctors</p>
            </div>

            <div className="text-stats-container">
              <p>10+</p>
              <p>Years of Experience</p>
            </div>
          </div>
        </div>

        <div className="hero-image-section">
          <img 
            className="hero-image1" 
            src="https://img.freepik.com/free-photo/medium-shot-doctor-with-stethoscope_23-2149191355.jpg?t=st=1714935542~exp=1714939142~hmac=af15fb5d1f7c5d7c89dc428d4b680a83a4f5ec1fce5cd649ce69e7ed4c686fea&w=740" 
            alt="Doctor with stethoscope" 
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
