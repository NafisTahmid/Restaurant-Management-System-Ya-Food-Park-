import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { getUserDetailsById, userUpdate } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GET_USER_RESET } from "../constants/userConstants";

const UserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const getUser = useSelector((state) => state.getUser);
  const { loading, user, error } = getUser;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const updateUser = useSelector((state) => state.updateUser);
  const {
    loading: loadingUpdateId,
    user: userUpdateId,
    error: errorUpdateId,
  } = updateUser;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!user) {
      dispatch(getUserDetailsById(id));
    } else {
      setName(user.name);
      setUserName(user.username);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [id, dispatch, user, navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userUpdate(id, name, email, isAdmin));
    setName("");
    setUserName("");
    setEmail("");
    setIsAdmin(false);
    navigate("/users");
  };

  return (
    <div>
      <Container>
        <Button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            dispatch({ type: GET_USER_RESET });
            navigate("/users");
          }}
        >
          Go Back
        </Button>
        <h1>User Details: </h1>
        <FormContainer>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Update name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="username">
                <Form.Label>User name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Update user name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Update email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="isAdmin">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </Form.Group>
              <Button type="submit" className="btn btn-primary my-2">
                Update user
              </Button>
            </Form>
          )}
        </FormContainer>
      </Container>
    </div>
  );
};

export default UserEditScreen;
