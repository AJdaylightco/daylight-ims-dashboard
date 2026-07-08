import type { ReactNode } from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountSet = {
  total: number;
  standard: number;
  kids: number;
};

type OfficeAccessory = {
  label: string;
  value: number;
};

type WarrantyIssue = {
  label: string;
  total: number;
  standard: number;
  kids: number;
};

type DclAccessory = {
  sku: string;
  description: string;
  quantity: number;
};

type CreakDefinition = {
  label: string;
  description: string;
};

type ImsData = {
  ok: boolean;
  updatedAt?: string;
  office: {
    overview: {
      totalDc1s: number;
      standard: number;
      kids: number;
    };
    status: {
      newUnits: CountSet;
      warranty: CountSet;
      openBox: CountSet;
    };
    accessories: OfficeAccessory[];
    warrantyIssues: WarrantyIssue[];
    openBoxBreakdown: {
      total: CountSet;
      vip: CountSet;
      sellable: CountSet;
      warrantyGrade: CountSet;
    };
  };
  dcl: {
    summary: {
      totalUnits: number;
      standardUnits: number;
      kidsUnits: number;
      openBox: number;
    };
    accessories: DclAccessory[];
    rawRows?: DclAccessory[];
  };
};

const emptyImsData: ImsData = {
  ok: false,
  office: {
    overview: {
      totalDc1s: 0,
      standard: 0,
      kids: 0,
    },
    status: {
      newUnits: {
        total: 0,
        standard: 0,
        kids: 0,
      },
      warranty: {
        total: 0,
        standard: 0,
        kids: 0,
      },
      openBox: {
        total: 0,
        standard: 0,
        kids: 0,
      },
    },
    accessories: [],
    warrantyIssues: [],
    openBoxBreakdown: {
      total: {
        total: 0,
        standard: 0,
        kids: 0,
      },
      vip: {
        total: 0,
        standard: 0,
        kids: 0,
      },
      sellable: {
        total: 0,
        standard: 0,
        kids: 0,
      },
      warrantyGrade: {
        total: 0,
        standard: 0,
        kids: 0,
      },
    },
  },
  dcl: {
    summary: {
      totalUnits: 0,
      standardUnits: 0,
      kidsUnits: 0,
      openBox: 0,
    },
    accessories: [],
    rawRows: [],
  },
};

const creakDefinitions: CreakDefinition[] = [
  {
    label: "VIP",
    description: "Minimum to no creak.",
  },
  {
    label: "Sellable",
    description: "Slight creak, still customer-ready.",
  },
  {
    label: "Warranty",
    description: "Significant creak; does not meet customer-ready standards.",
  },
];

function addCacheBust(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cacheBust=${Date.now()}`;
}

async function getImsData(): Promise<{
  data: ImsData;
  error: string | null;
}> {
  const apiUrl = process.env.NEXT_PUBLIC_IMS_API_URL;

  if (!apiUrl) {
    return {
      data: emptyImsData,
      error: "Missing NEXT_PUBLIC_IMS_API_URL environment variable.",
    };
  }

  try {
    const response = await fetch(addCacheBust(apiUrl), {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: emptyImsData,
        error: `IMS API returned ${response.status}.`,
      };
    }

    const data = (await response.json()) as ImsData;

    if (!data.ok) {
      return {
        data: emptyImsData,
        error: "IMS API returned ok:false.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: emptyImsData,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error while loading IMS data.",
    };
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatUpdatedAt(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

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

function CreakInfoButton() {
  return (
    <details className="group relative">
      <summary className="flex h-6 w-6 cursor-pointer list-none items-center justify-center rounded-full border border-stone-300 bg-white text-[11px] font-bold text-stone-600 shadow-sm transition hover:bg-stone-50 [&::-webkit-details-marker]:hidden">
        i
      </summary>

      <div className="absolute right-0 top-8 z-30 w-[min(18rem,calc(100vw-3rem))] rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-xl">
        <p className="text-sm font-semibold text-stone-950">
          Creak Grade Definitions
        </p>

        <div className="mt-3 space-y-2 text-xs leading-5 text-stone-600">
          {creakDefinitions.map((definition) => (
            <p key={definition.label}>
              <span className="font-semibold text-stone-900">
                {definition.label}:
              </span>{" "}
              {definition.description}
            </p>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-stone-400">
          Tap the icon again to close.
        </p>
      </div>
    </details>
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

function Hero({
  updatedAt,
  error,
}: {
  updatedAt?: string;
  error: string | null;
}) {
  return (
    <section className="pt-6 sm:pt-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Daylight IMS
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Last synced: {formatUpdatedAt(updatedAt)}
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Live data issue: {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#office"
              className="rounded-full bg-stone-950 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
            >
              Office Inventory
            </a>
            <a
              href="#dcl"
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-center text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
            >
              DCL Inventory
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewCards({ data }: { data: ImsData["office"]["overview"] }) {
  const cards = [
    {
      label: "Total DC-1s",
      value: data.totalDc1s,
      subtext: "All office units currently in stock",
    },
    {
      label: "Standard",
      value: data.standard,
      subtext: "Standard DC-1 inventory",
    },
    {
      label: "Kids",
      value: data.kids,
      subtext: "Kids DC-1 inventory",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm font-medium text-stone-500">{stat.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            {formatNumber(stat.value)}
          </p>
          <p className="mt-2 text-sm leading-5 text-stone-500">
            {stat.subtext}
          </p>
        </Card>
      ))}
    </div>
  );
}

function InventoryStatusCard({
  label,
  item,
  note,
}: {
  label: string;
  item: CountSet;
  note: string;
}) {
  const showCreakInfo = label === "Open Box";

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-stone-950">{label}</p>
            {showCreakInfo && <CreakInfoButton />}
          </div>

          <p className="mt-1 text-xs leading-5 text-stone-500">{note}</p>
        </div>

        <p className="text-3xl font-semibold text-stone-950">
          {formatNumber(item.total)}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-stone-100 p-3">
          <p className="text-xs font-medium text-stone-500">Standard</p>
          <p className="mt-1 text-2xl font-semibold text-stone-950">
            {formatNumber(item.standard)}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-700">Kids</p>
          <p className="mt-1 text-2xl font-semibold text-stone-950">
            {formatNumber(item.kids)}
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
  items: {
    label: string;
    item: CountSet;
    note: string;
  }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-stone-950">{title}</h3>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <InventoryStatusCard
            key={item.label}
            label={item.label}
            item={item.item}
            note={item.note}
          />
        ))}
      </div>
    </div>
  );
}

function AccessoriesSection({
  accessories,
}: {
  accessories: OfficeAccessory[];
}) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-stone-950">Accessories</h3>
        <p className="mt-1 text-sm text-stone-500">
          Quantity-based office accessory inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {accessories.length > 0 ? (
          accessories.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3"
            >
              <p className="text-sm font-medium leading-5 text-stone-700">
                {item.label}
              </p>
              <p className="shrink-0 text-xl font-semibold text-stone-950">
                {formatNumber(item.value)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-stone-500">No accessories found.</p>
        )}
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
            Standard {formatNumber(issue.standard)} · Kids{" "}
            {formatNumber(issue.kids)}
          </p>
        </div>

        <p className="text-xl font-semibold text-stone-950">
          {formatNumber(issue.total)}
        </p>
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

function WarrantySection({ issues }: { issues: WarrantyIssue[] }) {
  const max = Math.max(...issues.map((issue) => issue.total), 1);

  const topIssues = [...issues]
    .filter((issue) => issue.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

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
          {topIssues.length > 0 ? (
            topIssues.map((issue) => (
              <WarrantyIssueRow key={issue.label} issue={issue} max={max} />
            ))
          ) : (
            <p className="text-sm text-stone-500">No warranty issues found.</p>
          )}
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
          {issues.length > 0 ? (
            issues.map((issue) => (
              <WarrantyIssueRow key={issue.label} issue={issue} max={max} />
            ))
          ) : (
            <p className="text-sm text-stone-500">No warranty issues found.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function OfficeInventorySection({ office }: { office: ImsData["office"] }) {
  const inventoryStatusItems = [
    {
      label: "New Units",
      item: office.status.newUnits,
      note: "Ready to sell",
    },
    {
      label: "Warranty",
      item: office.status.warranty,
      note: "Condition marked as Warranty",
    },
    {
      label: "Open Box",
      item: office.status.openBox,
      note: "VIP, Sellable, or Warranty Grade",
    },
  ];

  const openBoxItems = [
    {
      label: "VIP",
      item: office.openBoxBreakdown.vip,
      note: "Minimum to no creak",
    },
    {
      label: "Sellable",
      item: office.openBoxBreakdown.sellable,
      note: "Slight creak, still customer-ready",
    },
    {
      label: "Warranty Grade",
      item: office.openBoxBreakdown.warrantyGrade,
      note: "Significant creak; not customer-ready",
    },
  ];

  return (
    <section id="office" className="scroll-mt-24 py-8 sm:py-12">
      <SectionHeader
        eyebrow="Office"
        title="Office Inventory"
        description="Main office inventory view for DC-1 units, open box units, warranty units, accessories, and rack-based operational tracking."
      />

      <div className="space-y-5">
        <OverviewCards data={office.overview} />

        <InventoryStatusGrid
          title="Inventory Status"
          items={inventoryStatusItems}
        />

        <InventoryStatusGrid
          title="Open Box Breakdown"
          items={openBoxItems}
        />

        <AccessoriesSection accessories={office.accessories} />

        <WarrantySection issues={office.warrantyIssues} />
      </div>
    </section>
  );
}

function DclSummaryCards({ dcl }: { dcl: ImsData["dcl"] }) {
  const cards = [
    {
      label: "Total Units",
      value: dcl.summary.totalUnits,
      note: "DC-1 + Kids + Open_Box",
    },
    {
      label: "Daylight DC-1",
      value: dcl.summary.standardUnits,
      note: "SKU 1",
    },
    {
      label: "Daylight Kids",
      value: dcl.summary.kidsUnits,
      note: "SKU 7",
    },
    {
      label: "Open_Box",
      value: dcl.summary.openBox,
      note: "DCL open box count",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-sm font-medium text-stone-500">{card.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            {formatNumber(card.value)}
          </p>
          <p className="mt-2 text-sm leading-5 text-stone-500">{card.note}</p>
        </Card>
      ))}
    </div>
  );
}

function DclAccessorySparkline({
  quantity,
  max,
}: {
  quantity: number;
  max: number;
}) {
  const width =
    quantity === 0
      ? 0
      : Math.max(4, Math.round((Math.abs(quantity) / max) * 100));

  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
      <div
        className={`h-full rounded-full ${
          quantity < 0 ? "bg-red-300" : "bg-orange-300"
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function DclAccessoriesTable({ items }: { items: DclAccessory[] }) {
  const maxQuantity = Math.max(
    ...items.map((item) => Math.abs(item.quantity)),
    1
  );

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-stone-950">
          DCL Accessories
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          SKU, description, quantity, and relative stock level for DCL
          accessories and non-device inventory.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200">
        <div className="grid grid-cols-[0.75fr_2fr_1fr] bg-stone-100 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
          <div>SKU</div>
          <div>Description</div>
          <div className="text-right">Quantity</div>
        </div>

        <div className="divide-y divide-stone-200 bg-white">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={`${item.sku}-${item.description}`}
                className="grid grid-cols-[0.75fr_2fr_1fr] items-center gap-2 px-3 py-3 text-sm"
              >
                <div className="font-medium text-stone-700">{item.sku}</div>

                <div>
                  <div className="leading-5 text-stone-700">
                    {item.description || "No description"}
                  </div>
                  <DclAccessorySparkline
                    quantity={item.quantity}
                    max={maxQuantity}
                  />
                </div>

                <div
                  className={`text-right font-semibold ${
                    item.quantity < 0 ? "text-red-700" : "text-stone-950"
                  }`}
                >
                  {formatNumber(item.quantity)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-stone-500">
              No DCL accessories found.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function DclInventorySection({ dcl }: { dcl: ImsData["dcl"] }) {
  return (
    <section id="dcl" className="scroll-mt-24 py-8 pb-28 sm:py-12 md:pb-12">
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

      <SectionHeader
        eyebrow="DCL"
        title="DCL Inventory"
        description="Simple DCL view based on the right side of the Report tab. Total units are shown first, with accessories in the SKU table."
      />

      <div className="space-y-5">
        <DclSummaryCards dcl={dcl} />
        <DclAccessoriesTable items={dcl.accessories} />
      </div>
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

export default async function Home() {
  const { data, error } = await getImsData();

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
        <Hero updatedAt={data.updatedAt} error={error} />
        <OfficeInventorySection office={data.office} />
        <DclInventorySection dcl={data.dcl} />
      </div>

      <DaylightLogoBadge />
      <MobileBottomNav />
    </main>
  );
}