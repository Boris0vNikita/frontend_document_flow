import http from "../http-common";

class DocumentService {
  getAllDocument() {
    return http.get("/document");
  }

  getDocument(id_document) {
    return http.get(`/document/${id_document}`);
  }

  get(id_document) {
    return http.get(`/document/${id_document}`);
  }

  create(data) {
    return http.post("/document/", data);
  }

  delete(id) {
    return http.delete(`/document/${id}`);
  }

  update(id, data) {
    return http.put(`/document/${id}`, data);
  }
}

export default new DocumentService();