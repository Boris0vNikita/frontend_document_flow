import axios from "axios";
export default axios.create({
  baseURL: "http://172.21.16.237:8080/api",
 // baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});