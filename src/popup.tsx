import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";


const Popup = () => {

  return (
    <Box height="540px">
      <Typography>TEST</Typography>
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
