import http from "../http-common";

class DepartmentService {
  getAllDepartment() {
    return http.get("/department");
  }

  getDepartment(id_department) {
    return http.get(`/department/${id_department}`);
  }

  get(id_department) {
    return http.get(`/department/${id_department}`);
  }

  create(data) {
    return http.post("/department/", data);
  }

  delete(id) {
    return http.delete(`/department/${id}`);
  }

  update(id, data) {
    return http.put(`/department/${id}`, data);
  }
}

export default new DepartmentService();