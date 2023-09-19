import http from "../http-common";

class typeService {
  getAllType() {
    return http.get("/type_document");
  }

  getType(id) {
    return http.get(`/type_document/${id}`);
  }

  get(id) {
    return http.get(`/type_document/${id}`);
  }

  create(data) {
    return http.post("/type_document/", data);
  }

  delete(id) {
    return http.delete(`/type_document/${id}`);
  }

  update(id, data) {
    return http.put(`/type_document/${id}`, data);
  }
}

export default new typeService();