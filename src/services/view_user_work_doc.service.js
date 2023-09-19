import http from "../http-common";

class ViewUserWorkService {
  getAllUserWork() {
    return http.get("/user_work_doc");
  }

  get(id) {
    return http.get(`user_work_doc/${id}`);
  }
}

export default new ViewUserWorkService();