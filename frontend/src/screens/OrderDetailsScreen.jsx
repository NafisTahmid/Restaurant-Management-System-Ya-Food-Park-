import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button, ListGroup, Container, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrderDetails } from "../actions/orderActions";
import {
  ORDER_DETAILS_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { payOrder, deliverOrder } from "../actions/orderActions";
const OrderDetailsScreen = () => {
  const { pk } = useParams();
  const dispatch = useDispatch();
  // const shippingAddressDetails = useSelector((state) => state.cart);
  // const { shippingAddress, paymentMethod } = shippingAddressDetails;
  const detailsOrder = useSelector((state) => state.orderDetails);
  const { loading, order, error } = detailsOrder;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    error: errorOrderPay,
    loading: loadingOrderPay,
    success: successOrderPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingOrderDeliver,
    error: errorOrderDeliver,
    success: successOrderDeliver,
  } = orderDeliver;
  useEffect(() => {
    if (!order || order._id !== Number(pk)) {
      dispatch(getOrderDetails(pk));
    }

    if (successOrderPay || successOrderDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(pk));
    }
  }, [dispatch, pk, successOrderPay, successOrderDeliver]);
  order.itemsPrice = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const submitHandler = () => {
    dispatch(
      payOrder({
        pk: order._id,
        total_price: order.totalPrice,
        shippingAddress: {
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          country: order.shippingAddress.country,
        },
      }),
    );
  };

  const deliverSubmitHandler = () => {
    dispatch(deliverOrder(pk));
  };
  return (
    <div>
      <Container>
        <h1>Order: {pk}</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row className="justify-content-center align-items-center">
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    <b>Shipping:</b>
                  </h3>
                  <p>
                    {order.shippingAddress.postalCode}{" "}
                    {order.shippingAddress.address} {order.shippingAddress.city}{" "}
                    {order.shippingAddress.country}
                  </p>
                  <p>
                    {order.isDelivered ? (
                      <Message variant="warning">
                        {order.deliveredAt.slice(0, 10)}
                      </Message>
                    ) : (
                      "Order Not Delivered"
                    )}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>
                    <b>Payment Method:</b>
                  </h3>
                  <p>{order.paymentMethod}</p>
                  <p className="py-1">
                    {order.isPaid ? (
                      <Message variant="info">
                        {order.paidAt.slice(0, 10)}
                      </Message>
                    ) : (
                      "Order Not Paid"
                    )}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>Orders:</h3>
                  {!order || order.orderItems.length === 0 ? (
                    <Message variant="info">Your order list is empty</Message>
                  ) : (
                    order.orderItems.map((item) => (
                      <Row
                        className="my-2 justify-content-center align-items-center"
                        key={item._id}
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
                    <b>Item price: ${order.itemsPrice}</b>
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="text-center">
                    <b>Tax price: ${order.taxPrice}</b>
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="text-center">
                    <b>Shipping price: ${order.shippingPrice}</b>
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="text-center">
                    <b>Total price: ${order.totalPrice}</b>
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item>
                  {order.isPaid && !order.isDelivered ? (
                    <div>
                      {loadingOrderDeliver && <Loader />}
                      {errorOrderDeliver && (
                        <Message variant="danger">{errorOrderDeliver}</Message>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-lg mx-auto d-block my-1"
                        onClick={deliverSubmitHandler}
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  ) : !order.isPaid ? (
                    <div>
                      {loadingOrderPay && <Loader />}
                      {errorOrderPay && (
                        <Message variant="danger">{errorOrderPay}</Message>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-lg mx-auto d-block my-1"
                        onClick={submitHandler}
                      >
                        Confirm Payment
                      </button>
                    </div>
                  ) : (
                    <p>{""}</p>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default OrderDetailsScreen;
