import React from "react";
import Card from "react-bootstrap/Card";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card>
      <Card.Img src={product.image} variant="top" />
      <Card.Body>
        <Card.Text as="div">
          <Rating
            rating={product.rating}
            color={"#FDDA0D"}
            review={`${product.rating} ratings form ${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Title as="h4">{product.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default Product;
