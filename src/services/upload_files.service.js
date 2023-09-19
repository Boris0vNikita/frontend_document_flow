import axios from 'axios';
//const API_URL = 'http://localhost:8080';
const API_URL = 'http://172.21.16.237:8080';

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);
    console.log(file);
    console.log(formData);
    return axios.post(API_URL + "/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }

  getFiles() {
    return axios.get(API_URL + "/files");
  }
}

export default new UploadFilesService();
