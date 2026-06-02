const overviewStats = [
  { label: "Total DC-1s", value: 144, subtext: "Office inventory" },
  { label: "Standard", value: 109, subtext: "Standard DC-1s" },
  { label: "Kids", value: 35, subtext: "Kids DC-1s" },
];

const statusStats = [
  { label: "New Units", value: 25 },
  { label: "Warranty", value: 76 },
  { label: "Open Box", value: 44 },
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
  { issue: "Build Quality", total: 18, standard: 16, kids: 2 },
  { issue: "Charging / Port Issue", total: 7, standard: 6, kids: 1 },
  { issue: "Dead Pixel", total: 4, standard: 3, kids: 1 },
  { issue: "Blank Screen Backlight On", total: 3, standard: 3, kids: 0 },
];

const openBoxBreakdown = [
  { grade: "VIP", total: 8, standard: 5, kids: 3 },
  { grade: "Sellable", total: 27, standard: 21, kids: 6 },
  { grade: "Warranty Grade", total: 9, standard: 7, kids: 2 },
];

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: number;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
      {subtext && <p className="mt-2 text-sm text-neutral-400">{subtext}</p>}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-6 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Daylight Internal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              IMS Dashboard
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Office inventory overview using mock report data.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm text-white">
            Last updated: Mock Data
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {overviewStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              subtext={stat.subtext}
            />
          ))}
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-3">
          {statusStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard title="Accessories">
            <div className="space-y-3">
              {accessories.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-neutral-700">
                    {item.name}
                  </span>
                  <span className="text-lg font-semibold text-neutral-950">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Open Box Breakdown">
            <div className="space-y-3">
              {openBoxBreakdown.map((item) => (
                <div key={item.grade} className="rounded-xl bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-800">{item.grade}</p>
                    <p className="text-xl font-semibold">{item.total}</p>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Standard: {item.standard} · Kids: {item.kids}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-6">
          <SectionCard title="Warranty Breakdown">
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="grid grid-cols-4 bg-neutral-950 px-4 py-3 text-sm font-medium text-white">
                <p>Issue</p>
                <p className="text-right">Total</p>
                <p className="text-right">Standard</p>
                <p className="text-right">Kids</p>
              </div>

              {warrantyBreakdown.map((item) => (
                <div
                  key={item.issue}
                  className="grid grid-cols-4 border-t border-neutral-200 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-neutral-800">{item.issue}</p>
                  <p className="text-right font-semibold">{item.total}</p>
                  <p className="text-right text-neutral-600">
                    {item.standard}
                  </p>
                  <p className="text-right text-neutral-600">{item.kids}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}