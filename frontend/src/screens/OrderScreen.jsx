import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Container, ListGroup, Image } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { orderCreate } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
const OrderScreen = () => {
  const dispatch = useDispatch();
  const shippingAddressDetails = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = shippingAddressDetails;
  cartItems.itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  cartItems.shippingPrice = cartItems.itemsPrice > 100 ? 0 : 10;
  cartItems.taxPrice = Number(cartItems.itemsPrice * Number(0.082)).toFixed(2);
  cartItems.totalPrice = (
    Number(cartItems.itemsPrice) +
    Number(cartItems.shippingPrice) +
    Number(cartItems.taxPrice)
  ).toFixed(2);
  const navigate = useNavigate();
  const createOrder = useSelector((state) => state.createOrder);
  const {
    loading: loadingCreateOrder,
    success: successCreateOrder,
    order: orderCreateOrder,
    error: errorCreateOrder,
  } = createOrder;

  const submitHandler = () => {
    dispatch(
      orderCreate({
        orderItems: cartItems,
        paymentMethod: paymentMethod,
        taxPrice: cartItems.taxPrice,
        totalPrice: cartItems.totalPrice,
        shippingPrice: cartItems.shippingPrice,
        shippingAddress: shippingAddress,
      }),
    );
  };
  useEffect(() => {
    if (successCreateOrder) {
      navigate(`/order/${orderCreateOrder._id}`);
      dispatch({
        type: ORDER_CREATE_RESET,
      });
    }
  }, [successCreateOrder, dispatch, navigate]);
  return (
    <div>
      <Container>
        <CheckoutSteps step1 step2 step3 step4 />
        <h1>My Orders: </h1>

        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>
                  <b>Shipping:</b>
                </h3>
                <p>
                  {shippingAddress.postalCode} {shippingAddress.address}{" "}
                  {shippingAddress.city} {shippingAddress.country}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h3>
                  <b>Payment Method:</b>
                </h3>
                <p>{paymentMethod}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h3>Orders:</h3>
                {!cartItems || cartItems.length === 0 ? (
                  <Message variant="info">Your cart is empty</Message>
                ) : (
                  cartItems.map((item) => (
                    <Row
                      className="my-2 justify-content-center align-items-center"
                      key={item._id || item.product}
                    >
                      <Col md={2}>
                        <Image src={item.image} fluid rounded />
                      </Col>
                      <Col md={4}>{item.name}</Col>
                      <Col md={6}>
                        {item.qty} X ${item.price}
                      </Col>
                    </Row>
                  ))
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2 className="text-center">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <h6 className="text-center">
                  <b>Items price: ${cartItems.itemsPrice}</b>
                </h6>
              </ListGroup.Item>
              <ListGroup.Item>
                <h6 className="text-center">
                  <b>Shipping price: ${cartItems.shippingPrice}</b>
                </h6>
              </ListGroup.Item>
              <ListGroup.Item>
                <h6 className="text-center">
                  <b>Tax price: ${cartItems.taxPrice}</b>
                </h6>
              </ListGroup.Item>
              <ListGroup.Item>
                <h4 className="text-center">
                  <b>Total price: ${cartItems.totalPrice}</b>
                </h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <button
                  type="button"
                  className="btn btn-primary btn-lg mx-auto d-block"
                  onClick={submitHandler}
                >
                  Place Order
                </button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderScreen;
