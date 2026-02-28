import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Container,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getProductDetails } from "../actions/productActions";
import { addToCart } from "../actions/cartAction";
const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const addToCartHandler = () => {
    // dispatch(addToCart(id, qty));
    navigate(`/cart/${id}/?qty=${qty}`);
  };

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);
  return (
    <div>
      <Container>
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            <Col md={6}>
              <Image src={product.image} fluid rounded />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="text-center">{product.name}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="text-center">
                    <Rating
                      rating={product.rating}
                      color={"#FDDA0D"}
                      review={`${product.rating} ratings form ${product.numReviews} reviews`}
                    />
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="text-center">{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Price:</h4>
                    </Col>
                    <Col>
                      <p>${product.price}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Status:</h4>
                    </Col>
                    <Col>
                      <p>
                        {product.countInStock > 0
                          ? "Available"
                          : "Not available"}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Quantity: </h4>
                    </Col>
                    <Col>
                      <Form.Control
                        as="select"
                        className="text-center"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {product.countInStock > 0 &&
                          [...Array(product.countInStock).keys()].map((x) => (
                            <option>{x + 1}</option>
                          ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    className="btn btn-primary btn-lg mx-auto d-block"
                    disabled={product.countInStock < 1}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProductScreen;
