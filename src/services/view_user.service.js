import http from "../http-common";

class ViewUserService {
  getAllUsers() {
    return http.get("/view_user");
  }

  get(id) {
    return http.get(`view_user/${id}`);
  }
}

export default new ViewUserService();