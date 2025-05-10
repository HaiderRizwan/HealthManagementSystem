import React from 'react';

const ProfileOverview = ({ userData }) => {
  return (
    <section className="profile-overview">
      <h2>Profile Overview</h2>
      <p>Name: {userData.fullName}</p>
      <p>Date of Birth: {userData.dateOfBirth}</p>
      <p>Gender: {userData.gender}</p>
      <p>Email: {userData.email}</p>
      <p>Contact Number: {userData.contactNumber}</p>
    </section>
  );
};

export default ProfileOverview;
