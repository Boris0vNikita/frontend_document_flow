import http from "../http-common";

class ViewUserRegistrService {
  getAllUsersRegistr() {
    return http.get("/view_user_registr");
  }

  get(id) {
    return http.get(`view_user_registr/${id}`);
  }
}

export default new ViewUserRegistrService();