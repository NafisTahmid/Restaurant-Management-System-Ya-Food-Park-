import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo } = userLogin;
  const {
    loading: loadingRegister,
    error: errorRegister,
    userInfo: userInfoRegister,
  } = userRegister;
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      window.alert("Passwords mismatch!!!");
    } else {
      dispatch(register(name, email, password));
    }
  };
  useEffect(() => {
    if (userInfoRegister) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate(redirect);
    }
  }, [userInfoRegister, redirect, navigate]);

  return (
    <div>
      <FormContainer>
        <h1>Register: </h1>
        {loadingRegister && <Loader />}
        {loadingRegister && <Message variant="danger">{errorRegister}</Message>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name: </Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter confirmation password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Register
          </Button>
        </Form>
        <Row>
          <Col>
            <p>
              Already have an account?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Login
              </Link>
            </p>
          </Col>
        </Row>
      </FormContainer>
    </div>
  );
};

export default RegisterScreen;
