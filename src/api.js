import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await API.post("/auth/login", {
    identifier: username,
    password,
  });
  localStorage.setItem("token", response.data.jwt);
  return response.data;
};

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    localStorage.removeItem("token");
  }
};

export const getCategorias = async (type) => {
  const response = await API.get("/transaction/categories", {
    params: { type },
  });
  return response.data;
};

export const getEntradas = async () => {
  const response = await API.get("/transaction", {
    params: { type: "INCOME" },
  });
  return response.data;
};

export const getSalidas = async () => {
  const response = await API.get("/transaction", {
    params: { type: "EXPENSE" },
  });
  return response.data;
};

export const createTransaccion = async (
  tipo,
  categoryCode,
  monto,
  fecha,
  facturaFile,
) => {
  const formData = new FormData();
  formData.append("type", tipo);
  formData.append("categoryCode", categoryCode);
  formData.append("amount", monto);
  formData.append("transactionDate", fecha);

  if (facturaFile) {
    formData.append("invoice", facturaFile);
  }

  const response = await API.post("/transaction", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getBalance = async () => {
  const response = await API.get("/transaction/balance");
  return response.data;
};

export const descargarReportePDF = async () => {
  const response = await API.get("/transaction/report/pdf", {
    responseType: "blob",
  });
  return response.data;
};

export const getReportePDF = descargarReportePDF;

export const getFacturaTransaccion = async (id) => {
  const response = await API.get(`/transaction/invoices/${id}`, {
    responseType: "blob",
  });
  return response.data;
};

export default API;
