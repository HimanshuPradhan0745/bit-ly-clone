import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;
  try {
    const decoded = jwtDecode(accessToken);
    return !!decoded && !!decoded.isLoggedIn;
  } catch (e) {
    return false;
  }
};

export const getAuthUser = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;
  try {
    const decoded = jwtDecode(accessToken);
    return decoded && decoded.isLoggedIn ? decoded : null;
  } catch (e) {
    return null;
  }
};

export default useAuth;
