import UserHelper from 'general/helpers/UserHelper';
import { Navigate } from 'react-router-dom';

// Route danh cho tai khoan chua dang nhap (Guest)
// Neu da dang nhap thi nhay ve man hinh root '/'
function GuestRoute(props) {
  // MARK: --- Params ---
  const isAuth = UserHelper.checkApiKeyValid();

  return !isAuth ? props.children : <Navigate to="/" />;
}

export default GuestRoute;
