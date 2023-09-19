import axios from 'axios';
//const API_URL = 'http://localhost:8080/api/auth/';
const API_URL = 'http://172.21.16.237:8080/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        login: user.login,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic: user.patronymic,
      login: user.login,
      password: user.password,
      email: user.email,
      id_chief: user.id_chief,
      id_department: user.id_department,
    });
  }
}

export default new AuthService();
