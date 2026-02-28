import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Row, Col, Button, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch } from "react-redux";
import { addPaymentMethod } from "../actions/cartAction";
import { useNavigate } from "react-router-dom";
const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addPaymentMethod(paymentMethod));
    navigate("/order");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Select Payment Method</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                checked
                label="Stripe"
                id="stripe"
                name="paymentMethod"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default PaymentScreen;
