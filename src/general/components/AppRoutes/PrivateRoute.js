import { thunkGetCurrentUserInfo } from 'app/authSlice';
import UserHelper from 'general/helpers/UserHelper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

// Route yeu cau phai dang nhap
// Neu chua dang nhap nhay ve man hinh dang nhap '/sign-in'
function PrivateRoute(props) {
  const { roles } = props;
  const dispatch = useDispatch();
  let navigate = useNavigate()
  let currentLoggedInUser;
  useEffect(() => {
    dispatch(thunkGetCurrentUserInfo());
  }, [])
  currentLoggedInUser = useSelector((state) => state.auth.user);
  console.log(currentLoggedInUser);
  
  if (!roles.includes(currentLoggedInUser.role)) {
    navigate("/login")
  }

  return props.children;
}

export default PrivateRoute;
