
import { useEffect, useState } from "react";

export default function UGCTracker() {
  const [ugcItems, setUgcItems] = useState([]);
  const [ugcLink, setUgcLink] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  useEffect(() => {
    fetch("/api/getItems").then((res) => res.json()).then(setUgcItems);
  }, []);

  const addItem = async () => {
    if (!ugcLink || !buyPrice) return;
    const idMatch = ugcLink.match(/catalog\/(\d+)/);
    if (!idMatch) return alert("Ungültiger Link");
    const id = idMatch[1];

    const res = await fetch(`/api/addItem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, buyPrice }),
    });
    const data = await res.json();
    setUgcItems((prev) => [...prev, data]);
    setUgcLink("");
    setBuyPrice("");
  };

  return (
    <div style={{ background: 'black', minHeight: '100vh', color: 'white', padding: 20 }}>
      <h1 style={{ fontSize: 30, fontWeight: 'bold' }}>🎯 Roblox UGC Tracker</h1>
      <div style={{ maxWidth: 500, marginTop: 20 }}>
        <input type="text" placeholder="UGC-Link einfügen" value={ugcLink}
          onChange={(e) => setUgcLink(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10 }} />
        <input type="number" placeholder="Kaufpreis (Robux)" value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10 }} />
        <button onClick={addItem} style={{ width: '100%', padding: 10, background: 'purple', color: 'white' }}>
          ✅ Hinzufügen & Überwachen
        </button>
      </div>
      <div style={{ marginTop: 30 }}>
        {ugcItems.map((item, i) => (
          <div key={i} style={{ border: '1px solid purple', padding: 10, marginBottom: 10 }}>
            <h2>{item.name || `Item #${item.id}`}</h2>
            <p>Kaufpreis: {item.buyPrice} R$</p>
            <p>Aktuell: {item.currentPrice || '...'} R$</p>
            <p>Status: {item.diff > 0 ? `+${item.diff}%` : `${item.diff}%`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
