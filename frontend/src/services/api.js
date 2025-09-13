//import axios
import axios from "axios";
const api = axios.create({
  //set default endpoint API
  baseURL: "http://localhost:3000", // pastikan sesuai backend-mu
});
export default api;
