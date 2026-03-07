import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Product from "../components/Product";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import CarouselItem from "../components/CarouselItem";
import { useSearchParams } from "react-router-dom";
const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.listProducts);
  const {
    loading,
    error,
    products,
    page: paginatorPage,
    pages: paginatorPages,
  } = productList;
  const [searchParams] = useSearchParams();
  let keyword = searchParams.get("keyword");
  if (keyword == null) {
    keyword = "";
  }
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    dispatch(listProducts(keyword, page));
  }, [dispatch, keyword, page]);
  return (
    <div>
      <Container>
        {!keyword && <CarouselItem />}
        <h1>Latest Foods:</h1>
        {loading ? (
          <Loader /> ? (
            error
          ) : (
            <Message variant="danger">{error}</Message>
          )
        ) : (
          <Row>
            {products.map((product) => (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="my-1"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="text-decoration-none"
                >
                  <Product product={product} />
                </Link>
              </Col>
            ))}
            <Paginate
              keyword={keyword}
              page={page}
              pages={paginatorPages}
              isAdmin={false}
            />
          </Row>
        )}
      </Container>
    </div>
  );
};

export default HomeScreen;
