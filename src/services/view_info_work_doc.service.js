import http from "../http-common";

class ViewInfoDocumentService {
  getAllInfoDocuments() {
    return http.get("/info_work_doc");
  }

  get(id) {
    return http.get(`info_work_doc/${id}`);
  }
}

export default new ViewInfoDocumentService();