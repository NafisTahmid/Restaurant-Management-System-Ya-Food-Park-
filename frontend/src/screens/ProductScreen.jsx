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
import {
  getProductDetails,
  productCreateReviewAction,
} from "../actions/productActions";
// import { addToCart } from "../actions/cartAction";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const createReview = useSelector((state) => state.productCreateReview);
  const {
    loading: loadingReview,
    success: successReview,
    error: errorReview,
  } = createReview;
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();

  const addToCartHandler = () => {
    // dispatch(addToCart(id, qty));
    navigate(`/cart/${id}/?qty=${qty}`);
  };

  useEffect(() => {
    dispatch(getProductDetails(id));
    if (successReview) {
      setRating(0);
      setReview("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, id, successReview]);

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(productCreateReviewAction(product._id, rating, review));
  };

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
        <Container className="my-2 justify-content-end align-items-center">
          <Row className="">
            <Col md={6}>
              <h2>Write your review: </h2>
              {loadingReview && <Loader />}
              {errorReview && (
                <Message variant="warning">{errorReview}</Message>
              )}
              <Form onSubmit={reviewSubmitHandler}>
                <Form.Group>
                  <Form.Label>Give a rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Average</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Comment: </Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    placeholder="Type your review here"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    style={{ height: "100px" }}
                  ></Form.Control>
                </Form.Group>
                <Button type="submit" className="btn btn-dark my-2">
                  SUBMIT
                </Button>
              </Form>
            </Col>
            <Col md={6}>
              <h2>Customer Reviews:</h2>
              {product.reviews.map((review) => (
                <div key={review._id}>
                  <h6>{review.user.name}</h6>
                  <p>Rating: {review.rating}</p>
                  <Rating
                    rating={review.rating}
                    color={"#FDDA0D"}
                    // review={`${product.rating} ratings form ${product.numReviews} reviews`}
                  />
                  <p>{review.comment}</p>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default ProductScreen;
