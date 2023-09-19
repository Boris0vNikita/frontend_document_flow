import http from "../http-common";

class WorkUserService {
  getAllWorkUser() {
    return http.get("/work_user");
  }

  getWorUser(id_work_user) {
    return http.get(`/work_user/${id_work_user}`);
  }

  get(id) {
    return http.get(`/work_user/${id}`);
  }

  create(newWorkUser) {
    return http.post("/work_user/", newWorkUser);
  }

  delete(id_work_user) {
    return http.delete(`/work_user/${id_work_user}`);
  }

  update(id, data) {
    return http.put(`/work_user/${id}`, data);
  }
}

export default new WorkUserService();