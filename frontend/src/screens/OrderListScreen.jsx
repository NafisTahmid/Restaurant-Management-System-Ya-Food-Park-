import React, { useEffect } from "react";
import { Row, Col, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderListAction } from "../actions/orderActions";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, orders, error } = orderList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      dispatch(orderListAction());
    }
  }, [navigate, dispatch, userInfo]);
  console.log("All orders: ", orders);
  return (
    <div>
      <Container>
        <h1>Total Orders: {orders.length}</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="table-responsive">
            <Table striped hover bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.slice(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    {order.isPaid ? (
                      <td>{order.paidAt.slice(0, 10)}</td>
                    ) : (
                      <td>
                        {
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        }
                      </td>
                    )}
                    {order.isDelivered ? (
                      <td>{order.deliveredAt.slice(0, 10)}</td>
                    ) : (
                      <td>
                        <Link
                          className="btn btn-primary"
                          to={`/order/${order._id}`}
                        >
                          DELIVER
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderListScreen;
