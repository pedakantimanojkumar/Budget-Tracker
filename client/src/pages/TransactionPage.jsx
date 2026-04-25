import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

import { getCategories } from "../services/categoryService";
import { UIContext } from "../context/UIContext";
import Spinner from "../components/Spinner";

const TransactionPage = () => {
  const { month, setMonth, categoryFilter, setCategoryFilter } =
    useContext(UIContext);

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // 🔹 Fetch categories
  const fetchCategories = async () => {
  try {
    const data = await getCategories();

    // ✅ ensure array
    setCategories(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load categories");
    setCategories([]); // ✅ prevent crash
  }
};

  // 🔹 Fetch transactions
  const fetchTransactions = async () => {
  try {
    setLoading(true);

    const data = await getTransactions(month);

    setTransactions(Array.isArray(data) ? data : []);
  } catch (err) {
    toast.error("Failed to load transactions");
    setTransactions([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [month]);

  // 🔹 Handle form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Filter categories based on type
  const filteredCategories = (categories || []).filter(
  (cat) => cat.type === form.type
);

  // 🔹 Edit
  const handleEdit = (tx) => {
    setForm({
      amount: tx.amount,
      type: tx.type,
      categoryId: tx.categoryId?._id || "",
      date: new Date(tx.date).toISOString().split("T")[0],
      note: tx.note || "",
    });
    setEditingId(tx._id);
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || form.amount <= 0) {
      return toast.error("Enter valid amount");
    }

    if (!form.categoryId) {
      return toast.error("Select a category");
    }

    try {
      if (editingId) {
        await updateTransaction(editingId, form);
        toast.success("Updated");
        setEditingId(null);
      } else {
        await createTransaction(form);
        toast.success("Added");
      }

      setForm({
        amount: "",
        type: "expense",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  // 🔹 Delete
  const confirmDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      await deleteTransaction(id);
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
      fetchTransactions();
    }
  };

  // 🔹 Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (!categoryFilter) return true;
    return tx.categoryId?._id === categoryFilter;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transactions</h2>

      {/* 🔹 FORM */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>Amount</label>
        <input
          name="amount"
          type="number"
          placeholder="e.g. 500"
          value={form.amount}
          onChange={handleChange}
        />

        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label>Category</label>

        {filteredCategories.length === 0 ? (
          <p style={{ color: "red" }}>
            No {form.type} categories found.
            <br />
            👉 Create one in Categories page
          </p>
        ) : (
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {filteredCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        <label>Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <label>Note</label>
        <input
          name="note"
          placeholder="Optional"
          value={form.note}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      {/* 🔹 FILTER */}
      <div style={{ margin: "15px 0" }}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 LIST */}
      {loading ? (
        <Spinner />
      ) : filteredTransactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        filteredTransactions.map((tx) => (
          <div key={tx._id} style={cardStyle}>
            <strong>₹{tx.amount}</strong> -{" "}
            {tx.categoryId?.name || "No Category"}

            <p style={{ color: tx.type === "expense" ? "red" : "green" }}>
              {tx.type}
            </p>

            <button onClick={() => handleEdit(tx)}>Edit</button>

            <button onClick={() => confirmDelete(tx._id)}>
              Delete Transaction
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// 🔹 styles
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "400px",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
};

export default TransactionPage;