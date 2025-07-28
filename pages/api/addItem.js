export async function handlerAddItem(req, res) {
  const { id, buyPrice } = req.body;
  const itemUrl = `https://www.roblox.com/catalog/${id}`;
  const html = await fetch(itemUrl).then(r => r.text());

  const name = (html.match(/<title>(.*?) - Roblox/) || [])[1] || "Unknown";
  const price = parseInt((html.match(/data-expected-price=\"(\d+)/) || [])[1] || 0);

  const item = {
    id,
    name,
    buyPrice: parseInt(buyPrice),
    currentPrice: price,
    diff: Math.round(((price - buyPrice) / buyPrice) * 100),
  };

  // Save item (in-memory example)
  global.items = global.items || [];
  global.items.push(item);

  res.status(200).json(item);
}
