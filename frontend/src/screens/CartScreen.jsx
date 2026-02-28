import React, { useEffect } from "react";
import {
  Row,
  Col,
  Image,
  Form,
  ListGroup,
  Button,
  Container,
} from "react-bootstrap";
import {
  useSearchParams,
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../actions/cartAction";
import Message from "../components/Message";
const CartScreen = () => {
  const [searchParams] = useSearchParams();
  const qty = searchParams.get("qty");
  const dispatch = useDispatch();
  const { id } = useParams();
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(addToCart(Number(id), Number(qty)));
    }
  }, [dispatch, id, qty]);
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    navigate("/shipping");
  };
  return (
    <div>
      <Container>
        <h1>Cart Items:</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty. <Link to="/">Go back.</Link>
          </Message>
        ) : (
          <Row className="justify-content-center align-items-center">
            <Col md={8}>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item>
                    <Row key={item._id}>
                      <Col md={2}>
                        <Image
                          src={item.image}
                          fluid
                          rounded
                          className="mx-auto d-block"
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={3}>
                        <Form.Control
                          as="select"
                          value={item.qty}
                          className="text-center"
                          onChange={(e) =>
                            dispatch(
                              addToCart(
                                Number(item._id),
                                Number(e.target.value),
                              ),
                            )
                          }
                        >
                          {[
                            ...Array(
                              Math.max(1, item.countInStock || 1),
                            ).keys(),
                          ].map((x) => (
                            <option key={x + 1}>{x + 1}</option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="primary"
                          className="my-1 mx-auto d-block"
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2 className="text-center">
                    {" "}
                    Sub-total:{" "}
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.qty),
                      0,
                    )}{" "}
                    items
                  </h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4 className="text-center">
                    <b>Total: </b> $
                    {cartItems
                      .reduce(
                        (acc, item) =>
                          acc + Number(item.qty) * Number(item.price),
                        0,
                      )
                      .toFixed(2)}
                  </h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <button
                    className="btn btn-lg btn-primary mx-auto d-block"
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartScreen;
