import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL.replace(/\/+$/, "");

export const addProuduct = async (formdata: FormData) => {
  return axios.post(`${BASE_URL}/admin/products`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = async ({
  page = 1,
  searchQuery,
}: {
  page?: number;
  searchQuery?: string;
}) => {
  return axios.get(
    `${BASE_URL}/admin/products?per_page=10&page=${page}&query=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }
  );
};

export const getProduct = async (id: number) => {
  return axios.get(`${BASE_URL}/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const editProuduct = async (formdata: FormData, id: number) => {
  return axios.post(`${BASE_URL}/admin/products/${id}`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (id: number) => {
  return axios.delete(`${BASE_URL}/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const changeProductStatus = async (status: number, id: number) => {
  const formdata = new FormData();
  formdata.append("status", status.toString());
  formdata.append("_method", "Patch");
  return axios.post(`${BASE_URL}/admin/products/${id}`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addBrand = async (formdata: FormData) => {
  return axios.post(`${BASE_URL}/admin/commercial-sign`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBrands = async ({ searchQuery }: { searchQuery?: string }) => {
  return axios.get(`${BASE_URL}/admin/commercial-sign?query=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const getBrand = async (id: number) => {
  return axios.get(`${BASE_URL}/admin/commercial-sign/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const editBrand = async (formdata: FormData, id: number) => {
  return axios.post(`${BASE_URL}/admin/commercial-sign/${id}`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBrand = async (id: number) => {
  return axios.delete(`${BASE_URL}/admin/commercial-sign/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const addCategory = async (formdata: FormData) => {
  return axios.post(`${BASE_URL}/admin/categories`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCategories = async ({
  searchQuery,
}: {
  searchQuery?: string;
}) => {
  return axios.get(`${BASE_URL}/admin/categories?query=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const getCategory = async (id: number) => {
  return axios.get(`${BASE_URL}/admin/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const editCategory = async (formdata: FormData, id: number) => {
  return axios.post(`${BASE_URL}/admin/categories/${id}`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCategory = async (id: number) => {
  return axios.delete(`${BASE_URL}/admin/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
};

export const addAttachment = async (formdata: FormData) => {
  return axios.post(`${BASE_URL}/admin/products/attachment`, formdata, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAttachment = async (id:number) => {
  return axios.delete(`${BASE_URL}/admin/products/attachment/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};