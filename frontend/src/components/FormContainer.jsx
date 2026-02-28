import React from "react";
import { Row, Col, Container } from "react-bootstrap";
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col md={6} xs={12}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
