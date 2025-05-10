import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <section className="notifications">
      <h2>Notifications/Alerts</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </section>
  );
};

export default Notifications;
