import api from "../api";

// GET
export const getTransactions = async (month, page = 1) => {
  const res = await api.get(
    `/transactions?month=${month}&page=${page}&limit=20`
  );

  return res.data.data; // ✅ IMPORTANT FIX
};

// CREATE
export const createTransaction = async (data) => {
  const res = await api.post("/transactions", data);
  return res.data;
};

// UPDATE
export const updateTransaction = async (id, data) => {
  const res = await api.put(`/transactions/${id}`, data);
  return res.data;
};

// DELETE
export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};