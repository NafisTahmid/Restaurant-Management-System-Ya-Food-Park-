import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate(window.location.pathname);
    }
  };
  return (
    <div>
      <Form onSubmit={submitHandler}>
        <div className="d-flex justify-content-center align-items-center">
          <Form.Control
            type="text"
            placeholder="Search your favorite food"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          ></Form.Control>
          <Button type="submit" className="btn btn-sm btn-secondary ms-2">
            SEARCH
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SearchBox;
