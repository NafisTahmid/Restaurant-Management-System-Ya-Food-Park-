import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { productTopAction } from "../actions/productActions";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
const CarouselItem = () => {
  const dispatch = useDispatch();
  const topProducts = useSelector((state) => state.productTop);
  const { loading, products, error } = topProducts;

  useEffect(() => {
    dispatch(productTopAction());
  }, [dispatch]);
  console.log("Top products: ", products);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Carousel pause="hover" className="bg-primary">
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} />
            </Link>
            <Carousel.Caption>
              <h6>
                {product.name} (${product.price})
              </h6>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselItem;
