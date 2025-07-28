import { useEffect, useState } from "react";

export default function UGCTracker() {
  const [ugcItems, setUgcItems] = useState([]);
  const [ugcLink, setUgcLink] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  useEffect(() => {
    fetch("/api/getItems")
      .then((res) => res.json())
      .then(setUgcItems);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎯 Roblox UGC Tracker</h1>
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="UGC-Link einfügen"
          className="w-full p-3 rounded-lg text-black mb-3"
          value={ugcLink}
          onChange={(e) => setUgcLink(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kaufpreis (Robux)"
          className="w-full p-3 rounded-lg text-black mb-3"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />
        <button
          onClick={addItem}
          className="w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg font-bold"
        >
          ✅ Hinzufügen & Überwachen
        </button>
      </div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {ugcItems.map((item, i) => (
          <div key={i} className="bg-black/30 border border-purple-500 rounded-lg p-4 flex justify-between">
            <div>
              <h2 className="text-xl font-semibold">{item.name || `Item #${item.id}`}</h2>
              <p>Kaufpreis: {item.buyPrice} R$</p>
              <p>Aktuell: {item.currentPrice || '...'} R$</p>
            </div>
            <div className="text-right">
              <p>Status: <span className={`font-bold ${item.diff > 0 ? 'text-green-400' : 'text-red-400'}`}>{item.diff > 0 ? `+${item.diff}%` : `${item.diff}%`}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
