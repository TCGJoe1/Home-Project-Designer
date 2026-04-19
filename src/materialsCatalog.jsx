// Comprehensive materials catalog with Good/Better/Best tiers.
// See full source in the claude.ai Design project.
// buildCatalog(state), computeCatalog(catalog, selections), defaultSelections(catalog)

function buildCatalog(state) {
  const w = state.size?.w || 10;
  const d = state.size?.d || 12;
  const area = w * d;
  const perimeter = 2 * (w + d);
  const wallSqft = perimeter * 7.5;
  const roofSqft = area * (state.roof === "gable" || state.roof === "hip" ? 1.3 : state.roof === "saltbox" ? 1.35 : 1.15);
  const joistCount = Math.ceil(w / 1.33) + 2;
  const studCount = Math.ceil(perimeter / 1.33) + 8;
  const rafterCount = Math.ceil(d / 1.33) * 2 + 4;
  const wallSheets = Math.ceil(wallSqft / 32);
  const floorSheets = Math.ceil(area / 32);
  const roofSheets = Math.ceil(roofSqft / 32);
  const shingleBundles = Math.ceil(roofSqft / 33);
  const feltRolls = Math.ceil(roofSqft / 400);
  const windowCount = state.windows || 0;
  // ... full implementation in claude.ai Design project
  return [];
}

function computeCatalog(catalog, selections) {
  const sections = catalog.map(sec => {
    const items = sec.items.map(it => {
      let qty = it.qty, unit = it.unit, pricePer, tierName, brand, note;
      if (it.fixed) { pricePer = it.price; brand = it.brand; }
      else {
        const chosen = it.tiers.find(t => t.id === selections[it.id]) || it.tiers[1] || it.tiers[0];
        pricePer = chosen.pricePer; tierName = chosen.name; brand = chosen.brand; note = chosen.note;
        if (chosen.qtyOverride) qty = chosen.qtyOverride();
        if (chosen.unitOverride) unit = chosen.unitOverride;
        if (chosen.multiplier) qty = qty * chosen.multiplier;
      }
      const lineTotal = Math.round(pricePer * qty * 100) / 100;
      return { ...it, qty, unit, pricePer, tierName, brand, note, lineTotal };
    });
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    return { section: sec.section, items, subtotal };
  });
  const subtotal = sections.reduce((s, sec) => s + sec.subtotal, 0);
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  return { sections, subtotal: Math.round(subtotal * 100) / 100, tax, total: Math.round((subtotal + tax) * 100) / 100 };
}

function defaultSelections(catalog) {
  const sel = {};
  for (const sec of catalog)
    for (const it of sec.items)
      if (!it.fixed && it.tiers && it.tiers.length)
        sel[it.id] = it.tiers[Math.min(1, it.tiers.length - 1)].id;
  return sel;
}

window.buildCatalog = buildCatalog;
window.computeCatalog = computeCatalog;
window.defaultSelections = defaultSelections;
