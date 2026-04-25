import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/categoryService";
import toast from "react-hot-toast";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      setLoading(true);
      await createCategory({ name, type });
      toast.success("Category added");

      setName("");
      setType("expense");
      fetchCategories();
    } catch {
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Categories</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {categories.length === 0 ? (
        <p>No categories yet</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>
              {cat.name} ({cat.type})
              <button onClick={() => handleDelete(cat._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;