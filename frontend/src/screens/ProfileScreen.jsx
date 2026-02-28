import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getUserDetails, userUpdateProfile } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDetails = useSelector((state) => state.userDetails);
  const {
    loading: loadingUserDetails,
    error: errorUserDetails,
    user: userInfoDetails,
  } = userDetails;
  const updateProfile = useSelector((state) => state.updateProfile);
  const {
    loading: loadingUpdateProfile,
    error: errorUpdateProfile,
    success: successUpdateProfile,
  } = updateProfile;
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!userInfoDetails || !userInfoDetails.email || successUpdateProfile) {
        dispatch({
          type: USER_UPDATE_PROFILE_RESET,
        });
        dispatch(getUserDetails());
      } else {
        setName(userInfoDetails.name);
        setEmail(userInfoDetails.email);
        setPassword(userInfoDetails.password);
        setConfirmPassword(userInfoDetails.password);
      }
    }
  }, [userInfo, navigate, dispatch, userInfoDetails, successUpdateProfile]);

  const submitHandler = (e) => {
    if (password !== confirmPassword) {
      window.alert("Passwords mismatch!!!");
    } else {
      dispatch(userUpdateProfile(name, email, password));
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };
  return (
    <div>
      <Container>
        <h1>Update Profile: </h1>
        {loadingUserDetails ? (
          <Loader />
        ) : errorUserDetails ? (
          <Message variant="danger">{errorUserDetails}</Message>
        ) : (
          <Row className="justify-content-center align-items-center">
            <Col md={6} xs={12}>
              {loadingUpdateProfile && <Loader />}
              {errorUpdateProfile && (
                <Message variant="danger">{errorUpdateProfile}</Message>
              )}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    placeholder="Update name"
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email: </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    placeholder="Update email"
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    placeholder="Update password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    placeholder="Update Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="my-2">
                  Update{" "}
                </Button>
              </Form>
            </Col>
            <Col md={6} xs={12}></Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProfileScreen;
