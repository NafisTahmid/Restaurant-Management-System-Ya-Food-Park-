import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getProductDetails } from "../actions/productActions";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateProductDetails } from "../actions/productActions";
import {
  PRODUCT_UPDATE_RESET,
  PRODUCT_DETAILS_RESET,
} from "../constants/productConstants";

const ProductEditScreen = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, product, error } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const updateProduct = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
    product: productUpdate,
  } = updateProduct;

  const navigate = useNavigate();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch({
        type: PRODUCT_DETAILS_RESET,
      });
      navigate("/products");
    } else {
      if (!product || product._id !== Number(id)) {
        dispatch(getProductDetails(id));
      } else {
        setName(product.name);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setPrice(product.price);
        setDescription(product.description);
        setCountInStock(product.countInStock);
      }
    }
  }, [dispatch, id, product, successUpdate, navigate]);

  const uploadFileHandler = async (e) => {
    try {
      setUploading(false);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("_id", id);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/products/upload/",
        formData,
        config,
      );
      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProductDetails({
        _id: product._id,
        name,
        image,
        description,
        brand,
        category,
        price,
        countInStock,
      }),
    );
  };

  return (
    <div>
      <Container>
        <Link to="/products" className="btn btn-secondary">
          Go Back
        </Link>
        <h1>Edit Product: </h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <FormContainer>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.Label>Choose File</Form.Label>
                <Form.Control type="file" onChange={uploadFileHandler} />
              </Form.Group>
              <Form.Group controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ height: "100px" }}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="countInStock">
                <Form.Label>Count in Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Product count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" className="btn btn-primary my-2">
                Update Product
              </Button>
            </Form>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          </FormContainer>
        )}
      </Container>
    </div>
  );
};

export default ProductEditScreen;
