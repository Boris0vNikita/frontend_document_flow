import http from "../http-common";

class ViewChildService {
  getAllChilds() {
    return http.get("/view_child_work");
  }

  get(id) {
    return http.get(`view_child_work/${id}`);
  }
}

export default new ViewChildService();