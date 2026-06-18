import type { ReactNode } from "react";
import Image from "next/image";

type Stat = {
  label: string;
  value: string;
  subtext: string;
};

type InventoryStatus = {
  label: string;
  total: number;
  standard: number;
  kids: number;
  note: string;
};

type SimpleCount = {
  label: string;
  value: number;
  note?: string;
};

type WarrantyIssue = {
  label: string;
  total: number;
  standard: number;
  kids: number;
};

const overviewStats: Stat[] = [
  {
    label: "Total DC-1s",
    value: "144",
    subtext: "All office units currently in stock",
  },
  {
    label: "Standard",
    value: "109",
    subtext: "Standard DC-1 inventory",
  },
  {
    label: "Kids",
    value: "35",
    subtext: "Kids DC-1 inventory",
  },
];

const inventoryStatus: InventoryStatus[] = [
  {
    label: "New Units",
    total: 25,
    standard: 15,
    kids: 10,
    note: "Ready to sell",
  },
  {
    label: "Warranty",
    total: 75,
    standard: 75,
    kids: 0,
    note: "Condition marked as Warranty",
  },
  {
    label: "Open Box",
    total: 44,
    standard: 19,
    kids: 25,
    note: "VIP, Sellable, or Warranty Grade",
  },
];

const openBoxBreakdown: InventoryStatus[] = [
  {
    label: "VIP",
    total: 8,
    standard: 5,
    kids: 3,
    note: "Best open-box condition",
  },
  {
    label: "Sellable",
    total: 27,
    standard: 21,
    kids: 6,
    note: "Good open-box units",
  },
  {
    label: "Warranty Grade",
    total: 9,
    standard: 7,
    kids: 2,
    note: "Open box but warranty grade",
  },
];

const accessories: SimpleCount[] = [
  {
    label: "Kids Case",
    value: 13,
  },
  {
    label: "Daylight Sling",
    value: 20,
  },
  {
    label: "Comfy Sleeve",
    value: 8,
  },
  {
    label: "Lamy Stylus",
    value: 30,
  },
  {
    label: "Stands",
    value: 4,
  },
  {
    label: "Wood Lightbulb Fixture",
    value: 10,
  },
  {
    label: "36 - (T45)",
    value: 0,
  },
  {
    label: "36-1 - (T45 Deep Amber)",
    value: 0,
  },
  {
    label: "37 - (ST64)",
    value: 0,
  },
  {
    label: "37-1 (ST64 Deep Amber)",
    value: 0,
  },
  {
    label: "37-2 (ST64 Bright 60W)",
    value: 0,
  },
  {
    label: "41 - (G80 Red)",
    value: 0,
  },
];

const warrantyIssues: WarrantyIssue[] = [
  {
    label: "N/A",
    total: 13,
    standard: 13,
    kids: 0,
  },
  {
    label: "Anti-glare film peeling",
    total: 9,
    standard: 9,
    kids: 0,
  },
  {
    label: "Blank screen, backlight on",
    total: 7,
    standard: 7,
    kids: 0,
  },
  {
    label: "Build Quality",
    total: 7,
    standard: 7,
    kids: 0,
  },
  {
    label: "Charging or Port Issue",
    total: 6,
    standard: 6,
    kids: 0,
  },
  {
    label: "Chipped screen",
    total: 5,
    standard: 5,
    kids: 0,
  },
  {
    label: "Dark lines on the screen",
    total: 5,
    standard: 5,
    kids: 0,
  },
  {
    label: "Dead Brick",
    total: 4,
    standard: 4,
    kids: 0,
  },
  {
    label: "Dead Pixel",
    total: 4,
    standard: 4,
    kids: 0,
  },
  {
    label: "Does not boot",
    total: 3,
    standard: 3,
    kids: 0,
  },
  {
    label: "Hot Spot doesn't work",
    total: 3,
    standard: 3,
    kids: 0,
  },
  {
    label: "Liquid Crystal Leakage",
    total: 3,
    standard: 3,
    kids: 0,
  },
  {
    label: "No backlight",
    total: 2,
    standard: 2,
    kids: 0,
  },
  {
    label: "PU Coat Degradation",
    total: 2,
    standard: 2,
    kids: 0,
  },
  {
    label: "SD Card Issue",
    total: 1,
    standard: 1,
    kids: 0,
  },
  {
    label: "Speaker Issue",
    total: 1,
    standard: 1,
    kids: 0,
  },
  {
    label: "Stylus Issue",
    total: 0,
    standard: 0,
    kids: 0,
  },
  {
    label: "Wi-Fi Issue",
    total: 0,
    standard: 0,
    kids: 0,
  },
];

const topWarrantyIssues = [...warrantyIssues]
  .filter((issue) => issue.total > 0)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-stone-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
        {description}
      </p>
    </div>
  );
}

function DesktopNav() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-stone-200 bg-stone-100/85 backdrop-blur-xl md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-sm font-semibold text-stone-950">
          Daylight IMS
        </a>

        <nav className="flex items-center gap-2 text-sm font-medium text-stone-600">
          <a
            href="#office"
            className="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-950"
          >
            Office Inventory
          </a>
          <a
            href="#dcl"
            className="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-950"
          >
            DCL Inventory
          </a>
        </nav>
      </div>
    </header>
  );
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-100/90 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between">
        <a href="#top" className="text-sm font-semibold text-stone-950">
          Daylight IMS
        </a>

        <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
          Mobile View
        </span>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-full border border-stone-200 bg-white/90 p-1 shadow-lg backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-2 gap-1">
        <a
          href="#office"
          className="rounded-full px-4 py-3 text-center text-sm font-semibold text-stone-900 transition active:bg-stone-100"
        >
          Office
        </a>
        <a
          href="#dcl"
          className="rounded-full px-4 py-3 text-center text-sm font-semibold text-stone-900 transition active:bg-stone-100"
        >
          DCL
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-6 sm:pt-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Internal Inventory Management
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Daylight IMS
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Mobile-first inventory dashboard for Office and DCL tracking.
            Built to quickly check sellable units, warranty units, open box
            status, accessories, and operational inventory health.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#office"
              className="rounded-full bg-stone-950 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
            >
              View Office Inventory
            </a>
            <a
              href="#dcl"
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-center text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
            >
              View DCL Inventory
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {overviewStats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm font-medium text-stone-500">{stat.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            {stat.value}
          </p>
          <p className="mt-2 text-sm leading-5 text-stone-500">
            {stat.subtext}
          </p>
        </Card>
      ))}
    </div>
  );
}

function InventoryStatusCard({ item }: { item: InventoryStatus }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-950">{item.label}</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">{item.note}</p>
        </div>

        <p className="text-3xl font-semibold text-stone-950">{item.total}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-stone-100 p-3">
          <p className="text-xs font-medium text-stone-500">Standard</p>
          <p className="mt-1 text-2xl font-semibold text-stone-950">
            {item.standard}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-700">Kids</p>
          <p className="mt-1 text-2xl font-semibold text-stone-950">
            {item.kids}
          </p>
        </div>
      </div>
    </Card>
  );
}

function InventoryStatusGrid({
  title,
  items,
}: {
  title: string;
  items: InventoryStatus[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-stone-950">{title}</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <InventoryStatusCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function AccessoriesSection() {
  return (
    <Card>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">Accessories</h3>
          <p className="mt-1 text-sm text-stone-500">
            Quantity-based accessory inventory.
          </p>
        </div>

        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
          A11:B22
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {accessories.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3"
          >
            <p className="text-sm font-medium leading-5 text-stone-700">
              {item.label}
            </p>
            <p className="shrink-0 text-xl font-semibold text-stone-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WarrantyIssueRow({
  issue,
  max,
}: {
  issue: WarrantyIssue;
  max: number;
}) {
  const width = max > 0 ? Math.round((issue.total / max) * 100) : 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold leading-5 text-stone-900">
            {issue.label}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Standard {issue.standard} · Kids {issue.kids}
          </p>
        </div>

        <p className="text-xl font-semibold text-stone-950">{issue.total}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-orange-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function WarrantySection() {
  const max = Math.max(...warrantyIssues.map((issue) => issue.total));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-stone-950">
            Top Warranty Issues
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Highest-count issues first.
          </p>
        </div>

        <div className="space-y-2">
          {topWarrantyIssues.map((issue) => (
            <WarrantyIssueRow key={issue.label} issue={issue} max={max} />
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-stone-950">
            All Warranty Issues
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Full warranty issue breakdown from the Report tab.
          </p>
        </div>

        <div className="space-y-2">
          {warrantyIssues.map((issue) => (
            <WarrantyIssueRow key={issue.label} issue={issue} max={max} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function OfficeInventorySection() {
  return (
    <section id="office" className="scroll-mt-24 py-8 sm:py-12">
      <SectionHeader
        eyebrow="Office"
        title="Office Inventory"
        description="Main office inventory view for DC-1 units, open box units, warranty units, accessories, and rack-based operational tracking."
      />

      <div className="space-y-5">
        <OverviewCards />

        <InventoryStatusGrid title="Inventory Status" items={inventoryStatus} />

        <InventoryStatusGrid
          title="Open Box Breakdown"
          items={openBoxBreakdown}
        />

        <AccessoriesSection />

        <WarrantySection />
      </div>
    </section>
  );
}

function DclInventorySection() {
  return (
    <section id="dcl" className="scroll-mt-24 py-8 pb-28 sm:py-12 md:pb-12">
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

      <SectionHeader
        eyebrow="DCL"
        title="DCL Inventory"
        description="Separate space for warehouse inventory. This is ready for future DCL/eFactory data once we connect live reporting."
      />

      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-950">
              DCL dashboard placeholder
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              This section is intentionally separate from Office Inventory.
              Later we can add DCL monthly totals, sellable inventory, open box,
              warehouse counts, eFactory exports, and historical end-of-month
              snapshots.
            </p>
          </div>

          <div className="rounded-3xl bg-stone-100 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Status
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">
              Not connected yet
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

function DaylightLogoBadge() {
  return (
    <div className="fixed bottom-24 right-4 z-30 hidden rounded-full border border-stone-200 bg-white/80 p-3 shadow-md backdrop-blur-xl sm:block md:bottom-6 md:right-6">
      <div className="relative h-9 w-9">
        <Image
          src="/daylight-logo.png"
          alt="Daylight logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-stone-100 text-stone-950">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[20%] h-96 w-96 rounded-full bg-stone-200/60 blur-3xl" />
      </div>

      <MobileTopBar />
      <DesktopNav />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <OfficeInventorySection />
        <DclInventorySection />
      </div>

      <DaylightLogoBadge />
      <MobileBottomNav />
    </main>
  );
}