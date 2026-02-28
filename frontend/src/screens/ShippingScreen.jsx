import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { addShippingAddress } from "../actions/cartAction";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";
const ShippingScreen = () => {
  const dispatch = useDispatch();
  const shippingAddress = useSelector((state) => state.cart);
  const { shippingAddress: shippingAddressStore } = shippingAddress;
  const [address, setAddress] = useState(shippingAddressStore.address);
  const [city, setCity] = useState(shippingAddressStore.city);
  const [postalCode, setPostalCode] = useState(shippingAddressStore.postalCode);
  const [country, setCountry] = useState(shippingAddressStore.country);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      addShippingAddress({
        address: address,
        city: city,
        postalCode: postalCode,
        country: country,
      }),
    );
    navigate("/payment");
  };
  return (
    <Container>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping: </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Address: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address ? address : ""}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="city">
            <Form.Label>City: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city ? city : ""}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="postal-code">
            <Form.Label>Postal Code: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode ? postalCode : ""}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="country">
            <Form.Label>Country: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country ? country : ""}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ShippingScreen;
