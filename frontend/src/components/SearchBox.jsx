import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`);
    } else {
      navigate(window.location.pathname);
    }
  };
  return (
    <div>
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={10}>
            <Form.Control
              type="text"
              placeholder="Search your favorite food"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            ></Form.Control>
          </Col>
          <Col md={2}>
            <Button type="submit" className="btn btn-sm btn-secondary ms-2">
              SEARCH
            </Button>
          </Col>
        </Row>
        {/* <div className="d-flex justify-content-center align-items-center"> */}

        {/* </div> */}
      </Form>
    </div>
  );
};

export default SearchBox;
