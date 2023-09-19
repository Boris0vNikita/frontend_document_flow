import http from "../http-common";

class statusService {
  getAllStatus() {
    return http.get("/status");
  }

  getStatus(id) {
    return http.get(`/status/${id}`);
  }

  get(id) {
    return http.get(`/status/${id}`);
  }

  create(data) {
    return http.post("/status/", data);
  }

  delete(id) {
    return http.delete(`/status/${id}`);
  }

  update(id, data) {
    return http.put(`/status/${id}`, data);
  }
}

export default new statusService();