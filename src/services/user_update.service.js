import http from "../http-common";

class UserUpdateService {
  getAllUser() {
    return http.get("/users");
  }

  get(id) {
    return http.get(`users/${id}`);
  }
}

export default new UserUpdateService();