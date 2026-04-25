import { useEffect, useState, useContext } from "react";
import api from "../api";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UIContext } from "../context/UIContext";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const { month, setMonth } = useContext(UIContext);

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
    categories: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/stats/summary?month=${month}`);

      // ✅ SAFETY FIX (important)
      setStats({
        totalIncome: res.data.totalIncome || 0,
        totalExpense: res.data.totalExpense || 0,
        net: res.data.net || 0,
        categories: Array.isArray(res.data.categories)
          ? res.data.categories
          : [],
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [month]);

  // 🔹 Chart 1
  const incomeExpenseData = [
    { name: "Income", value: stats.totalIncome },
    { name: "Expense", value: stats.totalExpense },
  ];

  const COLORS_MAIN = ["#00C49F", "#FF4D4F"];

  // 🔹 Chart 2
  const CATEGORY_COLORS = [
    "#0088FE",
    "#FFBB28",
    "#AA66CC",
    "#FF8042",
    "#00C49F",
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      {/* 🔹 Month Picker */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* 🔹 Stats */}
          <div style={{ display: "flex", gap: 20 }}>
            <div>Income ₹{stats.totalIncome}</div>
            <div>Expense ₹{stats.totalExpense}</div>
            <div>Net ₹{stats.net}</div>
          </div>

          {/* 🔹 Charts */}
          <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
            
            {/* ✅ Chart 1: Income vs Expense */}
            <div style={{ width: "50%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeExpenseData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label={({ name }) => name}
                  >
                    {incomeExpenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS_MAIN[i]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ✅ Chart 2: Category Breakdown */}
            <div style={{ width: "50%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categories || []}
                    dataKey="total"
                    nameKey="category"
                    outerRadius={90}
                    label={({ name }) => name || "Unknown"}
                  >
                    {(stats.categories || []).map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          CATEGORY_COLORS[
                            i % CATEGORY_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  {/* ✅ THIS FIXES YOUR MISSING COLOR BOXES */}
                  <Legend
                    formatter={(value) => value || "Unknown"}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;