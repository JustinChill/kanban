import { UserLogin } from "../interfaces/UserLogin";
import axios from 'axios';

const login = async (userInfo: UserLogin) => {
  try {
    const response = await axios.post('/api/auth/login', userInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { login };
