import type { ReactNode } from "react";
import Image from "next/image";

const overviewStats = [
  {
    source: "Office",
    label: "Total DC-1s",
    value: 144,
    description: "All office DC-1 inventory",
  },
  {
    source: "Office",
    label: "Standard",
    value: 109,
    description: "Standard DC-1 units",
  },
  {
    source: "Office",
    label: "Kids",
    value: 35,
    description: "Kids DC-1 units",
  },
];

const inventoryStatus = [
  {
    label: "New Units",
    total: 25,
    standard: 15,
    kids: 10,
    accent: "neutral",
  },
  {
    label: "Warranty",
    total: 75,
    standard: 75,
    kids: 0,
    accent: "warranty",
  },
  {
    label: "Open Box",
    total: 44,
    standard: 19,
    kids: 25,
    accent: "openbox",
  },
];

const openBoxBreakdown = [
  { grade: "VIP", total: 8, standard: 5, kids: 3 },
  { grade: "Sellable", total: 27, standard: 21, kids: 6 },
  { grade: "Warranty Grade", total: 9, standard: 7, kids: 2 },
];

const accessories = [
  { name: "Kids Case", quantity: 13 },
  { name: "Daylight Sling", quantity: 20 },
  { name: "Comfy Sleeve", quantity: 8 },
  { name: "Lamy Stylus", quantity: 30 },
  { name: "Light Bulbs", quantity: 12 },
  { name: "Stand", quantity: 4 },
  { name: "Wood Lamp Fixture", quantity: 10 },
];

const warrantyBreakdown = [
  { issue: "N/A", total: 10, standard: 10, kids: 0 },
  { issue: "Anti-glare film peeling", total: 3, standard: 3, kids: 0 },
  { issue: "Blank screen backlight on", total: 5, standard: 5, kids: 0 },
  { issue: "Build Quality", total: 18, standard: 16, kids: 2 },
  { issue: "Charging / Port Issue", total: 7, standard: 6, kids: 1 },
  { issue: "Chipped screen", total: 2, standard: 2, kids: 0 },
  { issue: "Dark lines", total: 4, standard: 4, kids: 0 },
  { issue: "Dead brick", total: 2, standard: 2, kids: 0 },
  { issue: "Dead pixel", total: 4, standard: 3, kids: 1 },
  { issue: "Device shuts off randomly", total: 3, standard: 3, kids: 0 },
  { issue: "Does not boot up past logo", total: 2, standard: 2, kids: 0 },
  { issue: "Flashing black bars (TV static)", total: 2, standard: 2, kids: 0 },
  { issue: "Fried circuit", total: 1, standard: 1, kids: 0 },
  { issue: "Hot Spot doesn't work", total: 1, standard: 1, kids: 0 },
  { issue: "Liquid crystal leakage", total: 2, standard: 2, kids: 0 },
  { issue: "No Visible Backlight", total: 2, standard: 2, kids: 0 },
  { issue: "PU Coat Degradation / Discoloration", total: 3, standard: 3, kids: 0 },
  { issue: "SD Card doesn't work", total: 1, standard: 1, kids: 0 },
  { issue: "Speaker Issue", total: 1, standard: 1, kids: 0 },
  { issue: "Stylus", total: 2, standard: 2, kids: 0 },
  { issue: "WiFi Issues", total: 1, standard: 1, kids: 0 },
];

const topWarrantyIssues = [...warrantyBreakdown]
  .filter((item) => item.issue !== "N/A")
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);

const maxWarrantyIssueTotal = Math.max(
  ...warrantyBreakdown.map((item) => item.total)
);

const dclStats = [
  {
    source: "DCL",
    label: "Total Units",
    value: "Pending",
    description: "Awaiting eFactory API connection",
  },
  {
    source: "DCL",
    label: "Standard",
    value: "Pending",
    description: "3PL Standard DC-1 inventory",
  },
  {
    source: "DCL",
    label: "Kids",
    value: "Pending",
    description: "3PL Kids DC-1 inventory",
  },
];

function getAccentClasses(accent?: string) {
  if (accent === "warranty") {
    return {
      border: "border-orange-200",
      bg: "bg-orange-50",
      text: "text-orange-800",
    };
  }

  if (accent === "openbox") {
    return {
      border: "border-amber-200",
      bg: "bg-amber-50",
      text: "text-amber-800",
    };
  }

  return {
    border: "border-stone-200",
    bg: "bg-stone-50",
    text: "text-stone-700",
  };
}

function MetricCard({
  source,
  label,
  value,
  description,
}: {
  source?: string;
  label: string;
  value: number;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 transition-transform duration-200 hover:-translate-y-0.5">
      <div>
        {source && (
          <span className="mb-3 inline-flex rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">
            {source}
          </span>
        )}

        <p className="text-sm font-medium text-stone-500">{label}</p>

        <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
          {value}
        </p>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-5 text-stone-500">{description}</p>
      )}
    </div>
  );
}

function PlaceholderCard({
  source,
  label,
  value,
  description,
}: {
  source?: string;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 shadow-sm shadow-stone-200/40 transition-transform duration-200 hover:-translate-y-0.5">
      {source && (
        <span className="mb-3 inline-flex rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
          {source}
        </span>
      )}

      <p className="text-sm font-medium text-stone-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-500">
        {value}
      </p>

      {description && (
        <p className="mt-3 text-sm leading-5 text-stone-500">{description}</p>
      )}
    </div>
  );
}

function StatusCard({
  label,
  total,
  standard,
  kids,
  accent,
}: {
  label: string;
  total: number;
  standard: number;
  kids: number;
  accent?: string;
}) {
  const accentClasses = getAccentClasses(accent);

  return (
    <div
      className={`rounded-2xl border ${accentClasses.border} bg-white p-5 shadow-sm shadow-stone-200/40 transition-transform duration-200 hover:-translate-y-0.5`}
    >
      <p className={`text-sm font-medium ${accentClasses.text}`}>{label}</p>

      <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
        {total}
      </p>

      <p className="mt-1 text-sm text-stone-500">Total units</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className={`rounded-xl ${accentClasses.bg} px-3 py-3`}>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Standard
          </p>
          <p className="mt-1 text-xl font-semibold text-stone-950">
            {standard}
          </p>
        </div>

        <div className={`rounded-xl ${accentClasses.bg} px-3 py-3`}>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Kids
          </p>
          <p className="mt-1 text-xl font-semibold text-stone-950">{kids}</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40">
      <div className="border-b border-stone-100 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-stone-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        )}
      </div>

      <div className="pt-4">{children}</div>
    </section>
  );
}

function OpenBoxCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {openBoxBreakdown.map((item) => (
        <div
          key={item.grade}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-sm font-medium text-amber-800">{item.grade}</p>

          <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            {item.total}
          </p>

          <p className="mt-1 text-sm text-stone-500">Total units</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Standard
              </p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {item.standard}
              </p>
            </div>

            <div className="rounded-xl bg-white px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Kids
              </p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {item.kids}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopWarrantyIssues() {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {topWarrantyIssues.map((item, index) => (
        <div
          key={item.issue}
          className="rounded-2xl border border-orange-200 bg-orange-50 p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            #{index + 1}
          </p>

          <p className="mt-2 min-h-[40px] text-sm font-medium leading-5 text-stone-800">
            {item.issue}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            {item.total}
          </p>

          <p className="mt-2 text-xs text-stone-500">
            Standard: {item.standard} · Kids: {item.kids}
          </p>
        </div>
      ))}
    </div>
  );
}

function WarrantyIssueBars() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200">
      <div className="grid grid-cols-[1.6fr_0.5fr_0.5fr_0.5fr] gap-3 bg-stone-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600">
        <p>Issue</p>
        <p className="text-right">Total</p>
        <p className="text-right">Standard</p>
        <p className="text-right">Kids</p>
      </div>

      {warrantyBreakdown.map((item) => {
        const barWidth =
          maxWarrantyIssueTotal > 0
            ? Math.round((item.total / maxWarrantyIssueTotal) * 100)
            : 0;

        return (
          <div
            key={item.issue}
            className="grid grid-cols-[1.6fr_0.5fr_0.5fr_0.5fr] gap-3 border-t border-stone-100 px-4 py-4 text-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-stone-800">{item.issue}</p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-orange-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            <p className="text-right font-semibold text-stone-950">
              {item.total}
            </p>

            <p className="text-right font-medium text-stone-600">
              {item.standard}
            </p>

            <p className="text-right font-medium text-stone-600">{item.kids}</p>
          </div>
        );
      })}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-10 flex items-center gap-4">
      <div className="h-px flex-1 bg-stone-200" />
      <div className="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-stone-500 shadow-sm shadow-stone-200/30">
        DCL View
      </div>
      <div className="h-px flex-1 bg-stone-200" />
    </div>
  );
}

function DaylightLogoBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-40 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white/90 px-3 py-3 shadow-lg shadow-stone-300/20 backdrop-blur sm:flex">
      <Image
        src="/daylight-logo.png"
        alt="Daylight logo"
        width={34}
        height={34}
        className="h-8 w-8 object-contain"
      />
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
        Daylight
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main id="top" className="relative min-h-screen bg-stone-100 text-stone-950">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-yellow-200/10 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-stone-200 bg-stone-100/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" className="flex items-center gap-2 text-sm font-semibold text-stone-950">
            <Image
              src="/daylight-logo.png"
              alt="Daylight logo"
              width={22}
              height={22}
              className="h-5 w-5 object-contain"
            />
            <span>Daylight IMS</span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a
              href="#office"
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Office Inventory
            </a>

            <a
              href="#dcl"
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              DCL Inventory
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm shadow-stone-200/40">
          <div className="h-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500" />

          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Daylight Internal
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                IMS Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                Internal inventory dashboard with separate Office and DCL
                inventory views. This mockup currently focuses on the Office IMS
                Report view while DCL is planned separately.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
              <p className="font-medium text-stone-950">Status</p>
              <p className="mt-1 text-stone-500">Mock Data · Not Live Yet</p>
            </div>
          </div>
        </header>

        <section
          id="office"
          className="scroll-mt-24 rounded-[2rem] border border-stone-200 bg-stone-50/95 p-4 shadow-sm shadow-stone-200/30 sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Office Inventory
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-stone-950">
              Office IMS Report View
            </h2>

            <p className="max-w-3xl text-sm leading-6 text-stone-500">
              This section only represents inventory tracked through the Office
              IMS Report tab, including DC-1 totals, condition status, open box
              grades, accessories, and warranty breakdowns.
            </p>
          </div>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Overview
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {overviewStats.map((stat) => (
                <MetricCard
                  key={stat.label}
                  source={stat.source}
                  label={stat.label}
                  value={stat.value}
                  description={stat.description}
                />
              ))}
            </div>
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Inventory Status
              </h3>
            </div>

            <div className="mb-4 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm shadow-stone-200/40">
              <span className="font-medium text-stone-950">Count logic:</span>{" "}
              Total DC-1s = New Units + Warranty + Open Box. Standard/Kids
              splits are shown inside each category.
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {inventoryStatus.map((stat) => (
                <StatusCard
                  key={stat.label}
                  label={stat.label}
                  total={stat.total}
                  standard={stat.standard}
                  kids={stat.kids}
                  accent={stat.accent}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Section
              title="Open Box Breakdown"
              description="Open Box inventory grouped by creak grade."
            >
              <OpenBoxCards />
            </Section>

            <Section
              title="Accessories"
              description="Quantity-based items currently tracked through the Office IMS."
            >
              <div className="divide-y divide-stone-100">
                {accessories.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-3"
                  >
                    <p className="text-sm font-medium text-stone-800">
                      {item.name}
                    </p>
                    <p className="text-lg font-semibold text-stone-950">
                      {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="mt-6">
            <Section
              title="Top Warranty Issues"
              description="Highest-count warranty issues, excluding N/A."
            >
              <TopWarrantyIssues />
            </Section>
          </div>

          <div className="mt-6">
            <Section
              title="All Warranty Issues"
              description="Full warranty-condition breakdown by issue type. Data bars show each issue relative to the highest-count issue."
            >
              <WarrantyIssueBars />
            </Section>
          </div>
        </section>

        <SectionDivider />

        <section
          id="dcl"
          className="scroll-mt-24 rounded-[2rem] border border-stone-200 bg-stone-50/95 p-4 shadow-sm shadow-stone-200/30 sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              DCL Inventory
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-stone-950">
              DCL / 3PL Inventory View
            </h2>

            <p className="max-w-3xl text-sm leading-6 text-stone-500">
              This section is separate from Office inventory and will be shaped
              differently once the DCL/eFactory data source is ready.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {dclStats.map((stat) => (
              <PlaceholderCard
                key={stat.label}
                source={stat.source}
                label={stat.label}
                value={stat.value}
                description={stat.description}
              />
            ))}
          </div>
        </section>
      </div>

      <DaylightLogoBadge />
    </main>
  );
}