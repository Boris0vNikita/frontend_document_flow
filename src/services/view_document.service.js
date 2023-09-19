import http from "../http-common";

class ViewDocumentService {
  getAllDocuments() {
    return http.get("/view_document");
  }

  get(id) {
    return http.get(`view_document/${id}`);
  }
}

export default new ViewDocumentService();