import React from "react";
import { Spinner } from "react-bootstrap";
const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        height: "100px",
        width: "100px",
        display: "block",
        margin: "auto",
        color: "#FF3B3B",
      }}
    ></Spinner>
  );
};

export default Loader;
