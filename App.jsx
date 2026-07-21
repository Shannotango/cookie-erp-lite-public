import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Boxes,
  Building2,
  ChefHat,
  ClipboardCheck,
  Factory,
  Gauge,
  Home,
  Menu,
  PackageCheck,
  Plus,
  ShoppingCart,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const teal = "#60d0dc";
const orange = "#f9b15e";
const pink = "#fd2d79";

const navItems = [
  { id: "command", label: "Command Center", icon: Home },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "production", label: "Production", icon: ChefHat },
  { id: "sourcing", label: "Sourcing", icon: ShoppingCart },
  { id: "forecasting", label: "Forecasting", icon: BarChart3 },
];

const inventoryRows = [
  { item: "French Butter Blocks", qty: 84, par: 72, unit: "lbs", location: "Storefront A - Retail" },
  { item: "Valrhona Dark Chocolate", qty: 38, par: 55, unit: "kg", location: "Storefront A - Retail" },
  { item: "Organic Flour", qty: 950, par: 900, unit: "lbs", location: "Storefront B - Wholesale" },
  { item: "Pearl Sugar", qty: 18, par: 40, unit: "lbs", location: "Storefront B - Wholesale" },
  { item: "Matcha Powder", qty: 9, par: 12, unit: "kg", location: "Storefront A - Retail" },
  { item: "Custom Gift Boxes", qty: 420, par: 700, unit: "ea", location: "Storefront B - Wholesale" },
];

const batches = [
  { id: "#392", dough: "Sea Salt Chocolate Chip", location: "Cooler A - Rack 2", footprint: "4 Trays / 15% Capacity", day: 13 },
  { id: "#397", dough: "Pistachio Rose", location: "Cooler A - Rack 4", footprint: "3 Trays / 11% Capacity", day: 8 },
  { id: "#401", dough: "Brown Butter Toffee", location: "Cooler B - Rack 1", footprint: "6 Trays / 22% Capacity", day: 5 },
  { id: "#406", dough: "Matcha White Chocolate", location: "Cooler B - Rack 3", footprint: "2 Trays / 7% Capacity", day: 2 },
];

const pickList = [
  "Pull 18 lbs French butter for lamination bench",
  "Stage 12 kg chocolate feves beside Mixer 02",
  "Label 24 wholesale trays for Storefront B pickup",
  "Count remaining pearl sugar after morning bake",
];

const seasonalScenarios = {
  offPeak: {
    label: "Off-Peak",
    shortMultiplier: 1,
    advanceMultiplier: 1,
    cooler: 60,
  },
  valentines: {
    label: "Jan-Feb Valentine's",
    shortMultiplier: 1.2,
    advanceMultiplier: 1.05,
    cooler: 75,
  },
  summer: {
    label: "May-Aug Summer Markets",
    shortMultiplier: 1.6,
    advanceMultiplier: 1.1,
    cooler: 90,
  },
  holiday: {
    label: "Nov-Dec Holiday Gifting",
    shortMultiplier: 1.3,
    advanceMultiplier: 2.5,
    cooler: 115,
  },
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function statusColor(value, par) {
  if (value < par * 0.6) return pink;
  if (value < par) return orange;
  return teal;
}

function shelfLifeColor(day) {
  if (day <= 7) return teal;
  if (day <= 11) return orange;
  return pink;
}

function Card({ children, className = "" }) {
  return (
    <section className={classNames("rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

function Pill({ children, color = teal }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-900"
      style={{ backgroundColor: `${color}33` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

function ProgressBar({ value, color = teal, max = 100, marker = false }) {
  const width = marker ? Math.min((value / max) * 100, 132) : Math.min((value / max) * 100, 100);
  return (
    <div className={classNames("relative h-3 rounded-full bg-slate-100", marker ? "overflow-visible" : "overflow-hidden")}>
      <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: color }} />
      {marker && <div className="absolute right-0 top-[-4px] h-5 w-px bg-slate-500" />}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, color }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: `${color}26` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{detail}</p>
    </Card>
  );
}

function Header({ title, subtitle, onMenu }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
        <span className="h-2.5 w-2.5 rounded-full bg-[#60d0dc]" />
        Live bakery floor sync
      </div>
    </header>
  );
}

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 z-30 bg-slate-950/30 lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950">
                <CookieMark />
              </div>
              <div>
                <p className="font-bold text-slate-950">Crumb & Co.</p>
                <p className="text-xs font-medium text-slate-500">ERP-Lite</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    setOpen(false);
                  }}
                  className={classNames(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition",
                    selected ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="m-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">42 trays cooling</p>
            <p className="mt-1 text-xs text-slate-500">Two locations reporting clean counts.</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function CookieMark() {
  return (
    <div className="relative h-6 w-6 rounded-full bg-[#f9b15e]">
      <span className="absolute left-2 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-950" />
      <span className="absolute bottom-1.5 left-1.5 h-1 w-1 rounded-full bg-slate-950" />
      <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-slate-950" />
    </div>
  );
}

function CommandCenter() {
  const alerts = [
    { title: "Batch #392 expires tomorrow", detail: "Move Sea Salt Chocolate Chip into priority bake queue.", color: pink },
    { title: "Custom Packaging delayed", detail: "Gift boxes at 60% of par; approve backup printer quote.", color: orange },
    { title: "Cooler B rack density rising", detail: "Current utilization at 82% before corporate dough load-in.", color: orange },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Gauge} label="Revenue MTD" value="$184.6k" detail="+18% vs. last month" color={teal} />
        <MetricCard icon={Factory} label="Active Batches" value="27" detail="14 retail, 13 wholesale" color={orange} />
        <MetricCard icon={ClipboardCheck} label="Open POs" value="9" detail="3 need approval today" color={pink} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Urgent Alerts</h2>
              <p className="text-sm text-slate-500">Exceptions surfaced from kitchens, inventory, and procurement.</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-[#fd2d79]" />
          </div>
          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: alert.color }} />
                  <div>
                    <p className="font-semibold text-slate-950">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{alert.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-bold text-slate-950">Throughput Snapshot</h2>
          <p className="text-sm text-slate-500">Daily output by selling channel.</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Retail", trays: 42 },
                { name: "Wholesale", trays: 58 },
                { name: "Corporate", trays: 31 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="trays" radius={[8, 8, 0, 0]}>
                  {[teal, orange, pink].map((color) => (
                    <Cell key={color} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Inventory() {
  const [location, setLocation] = useState("All");
  const [checked, setChecked] = useState([true, false, false, false]);
  const locations = ["All", "Storefront A - Retail", "Storefront B - Wholesale"];
  const rows = location === "All" ? inventoryRows : inventoryRows.filter((row) => row.location === location);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {locations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLocation(option)}
              className={classNames(
                "rounded-lg border px-3 py-2 text-sm font-semibold",
                location === option
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#60d0dc] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:brightness-95"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Transfer Stock
        </button>
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-950">Cross-Kitchen Inventory</h2>
          <p className="text-sm text-slate-500">Par levels keep production stocked without overloading cold storage.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Item Name</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Current Qty</th>
                <th className="px-5 py-3">Par Level</th>
                <th className="px-5 py-3">Reorder Trigger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => {
                const color = statusColor(row.qty, row.par);
                const low = row.qty < row.par;
                return (
                  <tr
                    key={`${row.item}-${row.location}`}
                    className="bg-white"
                    style={low ? { backgroundColor: `${color}18` } : undefined}
                  >
                    <td className="px-5 py-4 font-semibold text-slate-950">{row.item}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.location}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.qty} {row.unit}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{row.par} {row.unit}</td>
                    <td className="px-5 py-4">
                      <Pill color={color}>{low ? "Reorder Triggered" : "On Track"}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[#60d0dc]" />
          <h2 className="text-lg font-bold text-slate-950">Morning Shift Pick List</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pickList.map((task, index) => (
            <label key={task} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => setChecked((current) => current.map((value, i) => (i === index ? !value : value)))}
                className="h-5 w-5 accent-[#60d0dc]"
              />
              <span className={classNames("text-sm font-medium", checked[index] ? "text-slate-400 line-through" : "text-slate-800")}>
                {task}
              </span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Production() {
  const [started, setStarted] = useState(0);
  const [wasteCount, setWasteCount] = useState(0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Walk-In Cooler A", value: 74, detail: "Retail dough and fresh dairy" },
          { name: "Walk-In Cooler B", value: 82, detail: "Wholesale racks and corporate orders" },
        ].map((cooler) => (
          <Card key={cooler.name} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">{cooler.name}</h2>
                <p className="text-sm text-slate-500">{cooler.detail}</p>
              </div>
              <span className="text-2xl font-bold text-slate-950">{cooler.value}%</span>
            </div>
            <div className="mt-5">
              <ProgressBar value={cooler.value} color={cooler.value > 80 ? orange : teal} />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setStarted((count) => count + 1)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#60d0dc] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:brightness-95"
        >
          <Plus className="h-4 w-4" />
          Start New Batch
        </button>
        <button
          type="button"
          onClick={() => setWasteCount((count) => count + 1)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f9b15e] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:brightness-95"
        >
          <Trash2 className="h-4 w-4" />
          Log Waste
        </button>
        {(started > 0 || wasteCount > 0) && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            Materials deducted: {started} batch{started === 1 ? "" : "es"} | Waste logs: {wasteCount}
          </div>
        )}
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-950">Active Dough Batches</h2>
          <p className="text-sm text-slate-500">Shelf-life windows are tracked against a 14-day quality standard.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Dough</th>
                <th className="px-5 py-3">Specific Location</th>
                <th className="px-5 py-3">Space Footprint</th>
                <th className="px-5 py-3">Shelf-Life</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{batch.id}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{batch.dough}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{batch.location}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{batch.footprint}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-56 items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar value={batch.day} max={14} color={shelfLifeColor(batch.day)} />
                      </div>
                      <span className="w-16 text-sm font-semibold text-slate-700">Day {batch.day}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Sourcing() {
  const [vendor, setVendor] = useState("farm");
  const profile = vendor === "farm"
    ? {
        name: "Direct Farm (Dairy)",
        bought: "Bought: 650 Gal / Committed: 500 Gal (130%)",
        progress: 130,
        progressColor: teal,
        metrics: [
          ["Q3 Delay Incidents", "4 Deliveries", pink],
          ["Spoilage/Defect Rate", "3%", orange],
          ["Payment Velocity", "12 Days / Net-15", teal],
        ],
      }
    : {
        name: "National Milling (Flour/Sugar)",
        bought: "Bought: 1,700 lbs / Committed: 2,000 lbs (85%)",
        progress: 85,
        progressColor: pink,
        metrics: [
          ["Q3 Delay Incidents", "0 Deliveries", teal],
          ["Spoilage/Defect Rate", "8% Damaged Bags", pink],
          ["Payment Velocity", "18 Days / Net-15", pink],
        ],
      };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-[#60d0dc]" />
            <h2 className="text-lg font-bold text-slate-950">Procurement Engine</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <Pill color={teal}>Rule 1: Bulk Staples</Pill>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Aggregate Demand: 5,000 lbs Flour (Volume Tier Reached). Drop-ship 2k to Store A; 3k to Store B.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#60d0dc] px-4 py-2 text-sm font-bold text-slate-950">
                <PackageCheck className="h-4 w-4" />
                Generate Master PO
              </button>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <Pill color={orange}>Rule 2: Specialty Goods</Pill>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Specialty Ingredients: Matcha Powder & Pearl Sugar. Purchased individually by storefront based on channel menu.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f9b15e] px-4 py-2 text-sm font-bold text-slate-950">
                <Building2 className="h-4 w-4" />
                Generate Individual Store POs
              </button>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Vendor Scorecard</h2>
              <p className="text-sm text-slate-500">Switch profiles to review committed volume and risk signals.</p>
            </div>
            <select
              value={vendor}
              onChange={(event) => setVendor(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <option value="farm">Direct Farm (Dairy)</option>
              <option value="milling">National Milling (Flour/Sugar)</option>
            </select>
          </div>
          <div className="mt-6">
            <h3 className="font-bold text-slate-950">{profile.name}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-700">{profile.bought}</p>
            <div className="mt-3">
              <ProgressBar value={profile.progress} color={profile.progressColor} marker />
              <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>0%</span>
                <span>100% commitment marker</span>
                <span>{profile.progress}%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {profile.metrics.map(([label, value, color]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
                <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-950">Supplier Order Matrix</h2>
          <p className="text-sm text-slate-500">Inbound procurement rules by vendor category.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Vendor Category</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Origin</th>
                <th className="px-5 py-3">System Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                ["Direct Farm (Dairy)", "Bi-Weekly Drops", "Hyper-Local (Fraser Valley)", "ERP Auto-PO (Committed Volume)", teal],
                ["National Milling (Flour/Sugar)", "Monthly Pallets", "Regional Hub (Vancouver)", "ERP Auto-PO (Committed Volume)", teal],
                ["Custom Printers (Boxes)", "Quarterly", "Overseas (60-day lead)", "Manual PO Approval", orange],
              ].map(([category, frequency, origin, tracking, color]) => (
                <tr key={category}>
                  <td className="px-5 py-4"><Pill color={color}>{category}</Pill></td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{frequency}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{origin}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{tracking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Forecasting() {
  const [scenarioKey, setScenarioKey] = useState("offPeak");
  const scenario = seasonalScenarios[scenarioKey];
  const chartData = useMemo(() => {
    const shortBase = 155;
    const advanceBase = 118;
    return [
      { channel: "Short-Lead", demand: Math.round(shortBase * scenario.shortMultiplier), fill: pink },
      { channel: "Advance-Order", demand: Math.round(advanceBase * scenario.advanceMultiplier), fill: teal },
    ];
  }, [scenario]);
  const coolerColor = scenario.cooler >= 100 ? pink : scenario.cooler >= 85 ? orange : teal;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Seasonal Peak Selector</h2>
            <p className="text-sm text-slate-500">Demand and cooler load adjust instantly by sales season.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(seasonalScenarios).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenarioKey(key)}
                className={classNames(
                  "rounded-lg border px-3 py-2 text-sm font-semibold",
                  scenarioKey === key
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="text-lg font-bold text-slate-950">Channel Demand Chart</h2>
          <p className="text-sm text-slate-500">Short-lead demand is walk-in, delivery, and markets. Advance-order is wholesale and corporate.</p>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="channel" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="demand" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.channel} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-bold text-slate-950">Cooler Capacity Gauge</h2>
          <p className="text-sm text-slate-500">{scenario.label}</p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Used", value: Math.min(scenario.cooler, 100) },
                    { name: "Available", value: Math.max(100 - scenario.cooler, 0) },
                  ]}
                  dataKey="value"
                  innerRadius={68}
                  outerRadius={92}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={coolerColor} />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-950">{scenario.cooler}%</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: coolerColor }}>Projected physical footprint</p>
          </div>
          {scenario.cooler > 100 && (
            <div className="mt-5 rounded-lg border border-[#fd2d79] bg-[#fd2d79]/10 p-4 text-sm font-semibold text-slate-900">
              CRITICAL: Physical footprint exceeded. Enforce JIT fulfillment to clear racks.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("command");
  const [menuOpen, setMenuOpen] = useState(false);
  const current = navItems.find((item) => item.id === active);
  const subtitles = {
    command: "Revenue, alerts, and operating pulse for the bakery group.",
    inventory: "Shared ingredient and packaging visibility across both kitchens.",
    production: "Cold storage, active dough batches, shelf-life, and waste control.",
    sourcing: "Procurement rules, vendor commitments, and inbound order health.",
    forecasting: "Seasonal demand planning for channels and cooler constraints.",
  };
  const views = {
    command: <CommandCenter />,
    inventory: <Inventory />,
    production: <Production />,
    sourcing: <Sourcing />,
    forecasting: <Forecasting />,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} />
        <main className="min-w-0 flex-1">
          <Header title={current.label} subtitle={subtitles[active]} onMenu={() => setMenuOpen(true)} />
          <div className="p-5 lg:p-8">{views[active]}</div>
        </main>
      </div>
    </div>
  );
}
