import http from "../http-common";

class WorkDocumentService {
  getAllWorkDocument() {
    return http.get("/work");
  }

  getWorkDocument(id_work_document) {
    return http.get(`/work/${id_work_document}`);
  }

  get(id) {
    return http.get(`/work/${id}`);
  }

  create(newWorkDocument) {
    return http.post("/work/", newWorkDocument);
  }

  delete(id_work_document) {
    return http.delete(`/work/${id_work_document}`);
  }

  update(id, data) {
    return http.put(`/work/${id}`, data);
  }
}

export default new WorkDocumentService();