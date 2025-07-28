export async function handlerCheckPrices(req, res) {
  const items = global.items || [];

  for (const item of items) {
    const html = await fetch(`https://www.roblox.com/catalog/${item.id}`).then(r => r.text());
    const price = parseInt((html.match(/data-expected-price=\"(\d+)/) || [])[1] || 0);

    if (price > item.currentPrice) {
      item.currentPrice = price;
      item.diff = Math.round(((price - item.buyPrice) / item.buyPrice) * 100);

      // Send webhook
      await fetch("https://discord.com/api/webhooks/1399503527356923946/6abutnHLJ0K_njTHMRReSKmiuhCLKG1Jflcp5dISEjDn-2mps8P_jnkCwk8rATRBdH4-", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🔔 **${item.name}** ist im Preis gestiegen!\nNeuer Preis: **${price} R$** (alt: ${item.buyPrice} R$)`
        })
      });
    }
  }

  res.status(200).json({ ok: true });
}
