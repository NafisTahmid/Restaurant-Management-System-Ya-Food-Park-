import React, { useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, userDelete } from "../actions/userActions";
import { useNavigate, Link } from "react-router-dom";
const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userList = useSelector((state) => state.userList);
  const { loading, users, error } = userList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const deleteUser = useSelector((state) => state.deleteUser);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = deleteUser;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete the user?")) {
      dispatch(userDelete(id));
    }
  };
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
    dispatch(getUserList());
    if (successDelete) {
      dispatch(getUserList());
    }
  }, [dispatch, navigate, userInfo, successDelete]);
  console.log("Users: ", users);
  return (
    <div>
      <Container>
        <h1>Total users: {users.length}</h1>
        <Table striped hover bordered>
          <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th></th>
            <th></th>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i style={{ color: "green" }} className="fa fa-check"></i>
                  ) : (
                    <i style={{ color: "red" }} className="fa fa-times"></i>
                  )}
                </td>
                <td>
                  <Link to={`/users/edit/${user._id}`}>
                    <Button className="btn btn-warning">
                      <i className="fa fa-pencil"></i>
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button onClick={() => deleteHandler(user._id)}>
                    <i className="fa fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UserListScreen;
