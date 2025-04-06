// api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api", // 👈 IP của máy bạn chạy backend
});
