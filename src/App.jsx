import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const r = await fetch(`${API}/feedback`);
    setItems(await r.json());
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect -- load is async; setItems runs after await, not synchronously
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!customer || !message) return;
    await fetch(`${API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, message }),
    });
    setCustomer(""); setMessage(""); load();
  };

  const analyze = async (id) => {
    await fetch(`${API}/feedback/${id}/analyze`, { method: "POST" });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/feedback/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>📮 Smart Feedback Desk</h1>
      <input placeholder="Customer name" value={customer}
             onChange={(e) => setCustomer(e.target.value)}
             style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }} />
      <textarea placeholder="Feedback message" value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }} />
      <button onClick={submit} style={{ padding: "8px 16px" }}>Submit</button>

      <hr style={{ margin: "24px 0" }} />

      {items.map((f) => (
        <div key={f.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <strong>{f.customer}</strong>
          <p>{f.message}</p>
          {f.category !== "Uncategorized" && <p>🏷️ <b>{f.category}</b></p>}
          {f.ai_reply && <p>🤖 {f.ai_reply}</p>}
          <button onClick={() => analyze(f.id)}>Analyze with AI ✨</button>{" "}
          <button onClick={() => remove(f.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}