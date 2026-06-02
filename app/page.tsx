const overviewStats = [
  { label: "Total DC-1s", value: 144, description: "All office DC-1 inventory" },
  { label: "Standard", value: 109, description: "Standard DC-1 units" },
  { label: "Kids", value: 35, description: "Kids DC-1 units" },
];

const inventoryStatus = [
  {
    label: "New Units",
    total: 25,
    standard: 15,
    kids: 10,
  },
  {
    label: "Warranty",
    total: 76,
    standard: 75,
    kids: 1,
  },
  {
    label: "Open Box",
    total: 44,
    standard: 19,
    kids: 25,
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

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>
        </div>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-5 text-neutral-500">
          {description}
        </p>
      )}
    </div>
  );
}

function StatusCard({
  label,
  total,
  standard,
  kids,
}: {
  label: string;
  total: number;
  standard: number;
  kids: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">{label}</p>

      <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
        {total}
      </p>

      <p className="mt-1 text-sm text-neutral-500">Total units</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-neutral-50 px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Standard
          </p>
          <p className="mt-1 text-xl font-semibold text-neutral-950">
            {standard}
          </p>
        </div>

        <div className="rounded-xl bg-neutral-50 px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Kids
          </p>
          <p className="mt-1 text-xl font-semibold text-neutral-950">{kids}</p>
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
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>

      <div className="pt-4">{children}</div>
    </section>
  );
}

function SmallTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200">
      <div
        className="grid bg-neutral-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
        style={{
          gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
        }}
      >
        {headers.map((header, index) => (
          <p key={header} className={index === 0 ? "text-left" : "text-right"}>
            {header}
          </p>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.join("-")}
          className="grid border-t border-neutral-200 px-4 py-3 text-sm"
          style={{
            gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
          }}
        >
          {row.map((cell, index) => (
            <p
              key={`${cell}-${index}`}
              className={
                index === 0
                  ? "text-left font-medium text-neutral-800"
                  : "text-right font-semibold text-neutral-950"
              }
            >
              {cell}
            </p>
          ))}
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
          className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            #{index + 1}
          </p>

          <p className="mt-2 min-h-[40px] text-sm font-medium leading-5 text-neutral-800">
            {item.issue}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {item.total}
          </p>

          <p className="mt-2 text-xs text-neutral-500">
            Standard: {item.standard} · Kids: {item.kids}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-6 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Daylight Internal
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                IMS Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                Office inventory overview based on the IMS Report tab. This
                mockup uses placeholder data while the dashboard layout is being
                reviewed.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm">
              <p className="font-medium text-neutral-950">Status</p>
              <p className="mt-1 text-neutral-500">Mock Data · Not Live Yet</p>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Overview
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {overviewStats.map((stat) => (
              <MetricCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.description}
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Inventory Status
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {inventoryStatus.map((stat) => (
              <StatusCard
                key={stat.label}
                label={stat.label}
                total={stat.total}
                standard={stat.standard}
                kids={stat.kids}
              />
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Section
            title="Open Box Breakdown"
            description="Open Box inventory grouped by creak grade."
          >
            <SmallTable
              headers={["Grade", "Total", "Standard", "Kids"]}
              rows={openBoxBreakdown.map((item) => [
                item.grade,
                String(item.total),
                String(item.standard),
                String(item.kids),
              ])}
            />
          </Section>

          <Section
            title="Accessories"
            description="Quantity-based items currently tracked through the IMS."
          >
            <div className="divide-y divide-neutral-200">
              {accessories.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-3"
                >
                  <p className="text-sm font-medium text-neutral-800">
                    {item.name}
                  </p>
                  <p className="text-lg font-semibold text-neutral-950">
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
            description="Full warranty-condition breakdown by issue type."
          >
            <SmallTable
              headers={["Issue", "Total", "Standard", "Kids"]}
              rows={warrantyBreakdown.map((item) => [
                item.issue,
                String(item.total),
                String(item.standard),
                String(item.kids),
              ])}
            />
          </Section>
        </div>
      </div>
    </main>
  );
} 