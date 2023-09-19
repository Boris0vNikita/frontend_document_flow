import http from "../http-common";

class ViewWorkDepartmentService {
  getAllWorkDepartments() {
    return http.get("/view_work_department");
  }

  get(id) {
    return http.get(`view_work_department/${id}`);
  }
}

export default new ViewWorkDepartmentService();