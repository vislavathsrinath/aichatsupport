"use client";
import React from 'react';
import { Box, Typography, Button, Modal } from "@mui/material";
import { useState } from "react";

const Review = ({ handleClose }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log(`Rating submitted: ${rating}`);
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          We value your feedback!
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Please rate your experience:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                variant="outlined"
                onClick={() => setRating(num)}
                sx={{
                  margin: '0 5px',
                  borderColor: rating >= num ? 'primary.main' : 'grey.500',
                  color: rating >= num ? 'primary.main' : 'inherit',
                }}
              >
                {num}
              </Button>
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Review;
