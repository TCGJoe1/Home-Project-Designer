// MaterialsPanelV2 — line-item picker with tier selectors.
const { useState: useStateM, useMemo: useMemoM } = React;

function MaterialsPanelV2({ state, selections, onSelect, onOpenShoppingList }) {
  const catalog = useMemoM(() => window.buildCatalog(state), [state]);
  const computed = useMemoM(() => window.computeCatalog(catalog, selections), [catalog, selections]);
  const [collapsed, setCollapsed] = useStateM({});
  function fmt(n) { return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 }); }
  function toggle(sec) { setCollapsed(c => ({ ...c, [sec]: !c[sec] })); }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 10 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.08, color: "var(--ink-3)" }}>Materials takeoff · tier selections update cost live</div>
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.1, marginTop: 2 }}>
            {fmt(computed.total)} <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>incl. 7% tax</span>
          </div>
        </div>
        <button onClick={onOpenShoppingList} style={{ background: "var(--terra)", color: "var(--paper)", border: 0, padding: "8px 14px", borderRadius: 99, fontWeight: 500, fontSize: 12.5, cursor: "pointer" }}>Print Home Depot list ↗</button>
      </div>
      {computed.sections.map(sec => (
        <div key={sec.section} style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--paper-2)", overflow: "hidden" }}>
          <button onClick={() => toggle(sec.section)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 14px", background: "transparent", border: 0, borderBottom: collapsed[sec.section] ? "none" : "1px solid var(--line)", cursor: "pointer", textAlign: "left" }}>
            <div className="serif" style={{ fontSize: 17 }}>{sec.section}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{fmt(sec.subtotal)}</div>
              <span style={{ color: "var(--ink-3)", fontSize: 10 }}>{collapsed[sec.section] ? "▸" : "▾"}</span>
            </div>
          </button>
          {!collapsed[sec.section] && (
            <div>{sec.items.map(it => <LineItem key={it.id} item={it} selections={selections} onSelect={onSelect} />)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function LineItem({ item, selections, onSelect }) {
  const fmt = n => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const tierOrder = ["good", "better", "best"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--line)", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{item.qty} {item.unit} · {item.brand || item.detail}</div>
        {!item.fixed && item.tiers && (
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {item.tiers.sort((a, b) => tierOrder.indexOf(a.id) - tierOrder.indexOf(b.id)).map(t => {
              const active = (selections[item.id] || "better") === t.id;
              const tierColor = t.id === "good" ? "var(--sage)" : t.id === "better" ? "var(--ink)" : "var(--terra)";
              return (
                <button key={t.id} onClick={() => onSelect(item.id, t.id)} title={t.note} style={{ padding: "4px 9px", borderRadius: 99, border: "1px solid " + (active ? tierColor : "var(--line)"), background: active ? tierColor : "var(--paper)", color: active ? "var(--paper)" : "var(--ink-2)", fontSize: 11, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
                  {t.name} <span style={{ marginLeft: 5, opacity: 0.7 }}>${t.pricePer}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", minWidth: 90 }}>
        <div className="mono" style={{ fontSize: 13, fontWeight: 500 }}>{fmt(item.lineTotal)}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>@ ${item.pricePer}/{(item.unit || "").split(" ")[0]}</div>
      </div>
    </div>
  );
}

window.MaterialsPanelV2 = MaterialsPanelV2;
