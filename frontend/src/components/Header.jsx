import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <Navbar className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="/">
            <i className="fa-solid fa-pizza-slice"></i>YaYa Food Park
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/cart">
              <Nav.Link>
                <i className="fa-solid fa-cart-arrow-down"></i>Cart
              </Nav.Link>
            </LinkContainer>

            {userInfo ? (
              <NavDropdown title={userInfo.name} id="user-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>{userInfo.username}</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />

                {userInfo.isAdmin && (
                  <div>
                    <LinkContainer to="/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                  </div>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fa-solid fa-user"></i>Login
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
