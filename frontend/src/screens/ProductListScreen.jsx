import React, { useEffect } from "react";
import { Table, Button, Container, Image, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, userDelete } from "../actions/userActions";
import { useNavigate, Link } from "react-router-dom";
import {
  listProducts,
  createProductAction,
  deleteProductAction,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productList = useSelector((state) => state.listProducts);
  const { loading, products, error } = productList;
  const createProduct = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    success: successCreate,
    product: productCreate,
    error: errorCreate,
  } = createProduct;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const deleteProduct = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = deleteProduct;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProducts());
    }
    if (successDelete) {
      dispatch(listProducts());
    }
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (successCreate) {
      navigate(`/products/edit/${productCreate._id}`);
    }
  }, [
    userInfo,
    dispatch,
    navigate,
    successCreate,
    successDelete,
    productCreate,
  ]);

  const productCreateHandler = () => {
    dispatch(createProductAction({}));
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      dispatch(deleteProductAction(id));
    }
  };
  return (
    <div>
      <Container>
        <Row className="justify-content-end align-items-center">
          <Col md={9} sm={12}>
            <h1>Total products: {products.length}</h1>
          </Col>
          <Col md={3} sm={12}>
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            <Button
              type="button"
              className="ms-auto text-right btn btn-lg btn-primary"
              onClick={productCreateHandler}
            >
              <i className="fas fa-plus"></i>Create Product
            </Button>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table striped hover bordered>
            <thead>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
              <th></th>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>
                    <Image
                      src={product.image}
                      fluid
                      rounded
                      className="mx-auto d-block"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <Link to={`/products/edit/${product._id}`}>
                      <Button className="btn btn-warning">
                        <i className="fa fa-pencil"></i>
                      </Button>
                    </Link>
                  </td>
                  <td>
                    {loadingDelete && <Loader />}
                    {errorDelete && (
                      <Message variant="danger">{errorDelete}</Message>
                    )}
                    <Button onClick={() => deleteHandler(product._id)}>
                      <i className="fa fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default ProductListScreen;
