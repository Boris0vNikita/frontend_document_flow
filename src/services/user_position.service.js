import http from "../http-common";

class UserPositionService {
  getAllUserPosition() {
    return http.get("/user_position");
  }

  getUserPosition(id) {
    return http.get(`/user_position/${id}`);
  }

  get(id) {
    return http.get(`/user_position/${id}`);
  }

  create(data) {
    return http.post("/user_position/", data);
  }

  delete(id) {
    return http.delete(`/user_position/${id}`);
  }


  update(id, data) {
    return http.put(`/user_position/${id}`, data);
  }
}

export default new UserPositionService();