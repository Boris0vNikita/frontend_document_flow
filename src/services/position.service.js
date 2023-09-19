import http from "../http-common";

class PositionService {
  getAllPosition() {
    return http.get("/position");
  }

  getPosition(id) {
    return http.get(`/position/${id}`);
  }

  get(id) {
    return http.get(`/position/${id}`);
  }

  create(data) {
    return http.post("/position/", data);
  }

  delete(id) {
    return http.delete(`/position/${id}`);
  }

  update(id, data) {
    return http.put(`/position/${id}`, data);
  }
}

export default new PositionService();