import React from 'react';
import Typography from '@mui/material/Typography';

const Subtitle = () => {
  const text = `In today's fast-paced world, access to prompt and efficient medical services is of paramount importance. When faced with a medical emergency or seeking immediate medical attention, the ability to receive quick medical services can significantly impact the outcome of a situation.`;

  const words = text.split(' ');
  const lines = [];
  let line = '';

  words.forEach((word, index) => {
    if ((index + 1) % 5 === 0) {
      lines.push(line);
      line = '';
    }
    line += `${word} `;
  });

  // Add the remaining words to the last line
  if (line !== '') {
    lines.push(line);
  }

  return (
    <Typography variant="body1" style={{ fontSize: '1.8rem', marginBottom: '20px', marginTop: '20px' }}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </Typography>
  );
};

export default Subtitle;
