"use client";

import { useEffect, useMemo, useState } from "react";

type CountGroup = {
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

type OfficeData = {
  overview: {
    totalDc1s: number;
    standard: number;
    kids: number;
  };
  status: {
    newUnits: CountGroup;
    warranty: CountGroup;
    openBox: CountGroup;
  };
  accessories: OfficeAccessory[];
  warrantyIssues: WarrantyIssue[];
  openBoxBreakdown: {
    total: CountGroup;
    vip: CountGroup;
    sellable: CountGroup;
    warrantyGrade: CountGroup;
  };
};

type DclAccessory = {
  sku: string;
  description: string;
  quantity: number;
};

type DclData = {
  summary: {
    totalUnits: number;
    standardUnits: number;
    kidsUnits: number;
    openBox: number;
  };
  accessories: DclAccessory[];
};

type DashboardPayload = {
  ok: boolean;
  updatedAt?: string;
  office?: OfficeData;
  dcl?: DclData;
  error?: string;
};

const FALLBACK_DATA: DashboardPayload = {
  ok: true,
  updatedAt: new Date().toISOString(),
  office: {
    overview: {
      totalDc1s: 140,
      standard: 109,
      kids: 31,
    },
    status: {
      newUnits: {
        total: 23,
        standard: 14,
        kids: 9,
      },
      warranty: {
        total: 88,
        standard: 80,
        kids: 8,
      },
      openBox: {
        total: 39,
        standard: 18,
        kids: 21,
      },
    },
    accessories: [
      { label: "Kids Case", value: 72 },
      { label: "Daylight Sling", value: 39 },
      { label: "Comfy Sleeve", value: 11 },
      { label: "Lamy Stylus", value: 8 },
      { label: "Stands", value: 37 },
      { label: "Wood Lamp Fixture", value: 20 },
      { label: "36 - (T45)", value: 23 },
      { label: "36-1 - (T45 Deep Amber)", value: 6 },
      { label: "37 - (ST64)", value: 17 },
      { label: "37-1 (ST64 Deep Amber)", value: 8 },
      { label: "37-2 (ST64 Bright 60W)", value: 6 },
      { label: "41 - (G80 Red)", value: 8 },
    ],
    warrantyIssues: [
      { label: "Anti-glare film peeling", total: 0, standard: 0, kids: 0 },
      { label: "Blank screen, backlight on", total: 8, standard: 8, kids: 0 },
      { label: "Build Quality", total: 27, standard: 20, kids: 7 },
      { label: "Charging or Port Issue", total: 0, standard: 0, kids: 0 },
      { label: "Chipped screen", total: 0, standard: 0, kids: 0 },
      { label: "Dark lines on the screen", total: 1, standard: 1, kids: 0 },
      { label: "Dead Brick", total: 12, standard: 12, kids: 0 },
      { label: "Dead Pixel", total: 11, standard: 11, kids: 0 },
      { label: "Does not boot", total: 0, standard: 0, kids: 0 },
      { label: "Flashing bars", total: 0, standard: 0, kids: 0 },
      { label: "Fried Circuit", total: 0, standard: 0, kids: 0 },
      { label: "Hot Spot doesn't work", total: 0, standard: 0, kids: 0 },
      { label: "Liquid Crystal Leakage", total: 3, standard: 3, kids: 0 },
      { label: "No backlight", total: 0, standard: 0, kids: 0 },
      { label: "PU Coat Degradation", total: 0, standard: 0, kids: 0 },
      { label: "SD Card Issue", total: 0, standard: 0, kids: 0 },
      { label: "Speaker Issue", total: 1, standard: 1, kids: 0 },
      { label: "Stylus Issue", total: 4, standard: 4, kids: 0 },
      { label: "Wi-Fi Issue", total: 0, standard: 0, kids: 0 },
    ],
    openBoxBreakdown: {
      total: {
        total: 39,
        standard: 18,
        kids: 21,
      },
      vip: {
        total: 9,
        standard: 4,
        kids: 5,
      },
      sellable: {
        total: 20,
        standard: 11,
        kids: 9,
      },
      warrantyGrade: {
        total: 10,
        standard: 3,
        kids: 7,
      },
    },
  },
  dcl: {
    summary: {
      totalUnits: 1427,
      standardUnits: 363,
      kidsUnits: 842,
      openBox: 222,
    },
    accessories: [
      { sku: "23", description: "Daylight Sling", quantity: 661 },
      { sku: "28", description: "Daylight Comfy Sleeve", quantity: 419 },
      { sku: "29", description: "LAMY Pen", quantity: 261 },
      { sku: "30", description: "Kids Stylus", quantity: 244 },
      { sku: "31", description: "Daylight Kids Case", quantity: 346 },
      { sku: "34-", description: "Daylight Stand", quantity: 1500 },
      { sku: "35-", description: "Daylight Keyboard", quantity: 928 },
      { sku: "36-", description: "Small Incandescent Light Bulb", quantity: 1012 },
      { sku: "37-", description: "Large Incandescent Light Bulb", quantity: 3868 },
      { sku: "38-", description: "Kids Night Light", quantity: 455 },
      { sku: "40", description: "Wooden Light Fixture", quantity: 836 },
      { sku: "41", description: "Red Incandescent Bulb (G80)", quantity: 2947 },
      { sku: "37-1", description: "incandescent light. ST64. 40W", quantity: 3398 },
      { sku: "37-2", description: "incandescent light. ST64. 60W", quantity: 1419 },
      { sku: "36-1", description: "incandescent light. T45. 25W", quantity: 1455 },
      { sku: "32", description: "Daylight Keyboard Case", quantity: -221 },
    ],
  },
};

type ViewMode = "office" | "dcl";

const API_URL = process.env.NEXT_PUBLIC_IMS_API_URL;

export default function Page() {
  const [view, setView] = useState<ViewMode>("office");
  const [data, setData] = useState<DashboardPayload>(FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(!!API_URL);
  const [error, setError] = useState<string>("");
  const [showOpenBoxInfo, setShowOpenBoxInfo] = useState(false);

  useEffect(() => {
    if (!API_URL) {
      setError("Live data issue: Missing NEXT_PUBLIC_IMS_API_URL environment variable.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { cache: "no-store" });
        const json: DashboardPayload = await res.json();

        if (!cancelled) {
          if (json.ok) {
            setData(json);
            setError("");
          } else {
            setError(json.error || "Failed to load live IMS data.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch live IMS data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const office = data.office || FALLBACK_DATA.office!;
  const dcl = data.dcl || FALLBACK_DATA.dcl!;
  const syncedLabel = formatUpdatedAt(data.updatedAt || FALLBACK_DATA.updatedAt!);

  const topWarrantyIssues = useMemo(() => {
    return [...office.warrantyIssues]
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [office.warrantyIssues]);

  const officeAccessoryMax = Math.max(
    1,
    ...office.accessories.map((item) => Math.abs(item.value))
  );

  const dclAccessoryMax = Math.max(
    1,
    ...dcl.accessories.map((item) => Math.abs(item.quantity))
  );

  return (
    <main style={styles.page}>
      <BackgroundGlow />

      <header style={styles.topNav}>
        <div style={styles.brand}>Daylight IMS</div>
        <nav style={styles.topNavLinks}>
          <button
            style={{
              ...styles.topNavButton,
              ...(view === "office" ? styles.topNavButtonActive : {}),
            }}
            onClick={() => setView("office")}
          >
            Office Inventory
          </button>
          <button
            style={{
              ...styles.topNavButton,
              ...(view === "dcl" ? styles.topNavButtonActive : {}),
            }}
            onClick={() => setView("dcl")}
          >
            DCL Inventory
          </button>
        </nav>
      </header>

      <section style={styles.heroGrid}>
        <div style={{ ...styles.card, ...styles.heroCard }}>
          <h1 style={styles.heroTitle}>Daylight IMS</h1>
          <p style={styles.syncedText}>Last synced: {syncedLabel}</p>

          <div style={styles.heroButtons}>
            <button
              style={{
                ...styles.pillButton,
                ...(view === "office" ? styles.pillButtonActive : {}),
              }}
              onClick={() => setView("office")}
            >
              Office Inventory
            </button>
            <button
              style={{
                ...styles.pillButton,
                ...(view === "dcl" ? styles.pillButtonActive : {}),
              }}
              onClick={() => setView("dcl")}
            >
              DCL Inventory
            </button>
          </div>

          {loading && <p style={styles.helperText}>Refreshing live data…</p>}
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        <TopMetricCard
          label="Office Inventory"
          value={office.overview.totalDc1s}
          helper="Current office units in stock"
        />

        <TopMetricCard
          label="DCL Inventory"
          value={dcl.summary.totalUnits}
          helper="Current DCL units in stock"
        />
      </section>

      {view === "office" ? (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Office Inventory</h2>

          <div style={styles.cardGrid3}>
            <SummaryCard
              title="Total DC-1s"
              value={office.overview.totalDc1s}
              helper="All office units currently in stock"
            />
            <SummaryCard
              title="Standard"
              value={office.overview.standard}
              helper="Standard DC-1 inventory"
            />
            <SummaryCard
              title="Kids"
              value={office.overview.kids}
              helper="Kids DC-1 inventory"
            />
          </div>

          <div style={styles.subsectionHeader}>
            <h3 style={styles.subsectionTitle}>Inventory Status</h3>
          </div>

          <div style={styles.cardGrid3}>
            <StatusCard
              title="New Units"
              value={office.status.newUnits.total}
              helper="Ready to sell"
              standard={office.status.newUnits.standard}
              kids={office.status.newUnits.kids}
            />

            <StatusCard
              title="Warranty"
              value={office.status.warranty.total}
              helper="Condition marked as Warranty"
              standard={office.status.warranty.standard}
              kids={office.status.warranty.kids}
            />

            <StatusCard
              title="Open Box"
              value={office.status.openBox.total}
              helper="VIP, Sellable, or Warranty Grade"
              standard={office.status.openBox.standard}
              kids={office.status.openBox.kids}
              infoButton={
                <div style={styles.infoWrapper}>
                  <button
                    onClick={() => setShowOpenBoxInfo((prev) => !prev)}
                    style={styles.infoButton}
                    aria-label="Open box definitions"
                    title="Open box definitions"
                  >
                    i
                  </button>

                  {showOpenBoxInfo && (
                    <div style={styles.infoPopover}>
                      <div style={styles.infoPopoverTitle}>Open Box Definitions</div>
                      <div style={styles.infoLine}>
                        <strong>VIP</strong> — minimum to no creak
                      </div>
                      <div style={styles.infoLine}>
                        <strong>Sellable</strong> — slight creak
                      </div>
                      <div style={styles.infoLine}>
                        <strong>Warranty</strong> — most creak, build quality issue
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </div>

          <div style={styles.twoColumnLayout}>
            <div style={{ ...styles.card, ...styles.tableCard }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Open Box Breakdown</h3>
              </div>

              <div style={styles.openBoxBreakdownList}>
                <BreakdownRow
                  label="VIP"
                  total={office.openBoxBreakdown.vip.total}
                  standard={office.openBoxBreakdown.vip.standard}
                  kids={office.openBoxBreakdown.vip.kids}
                />
                <BreakdownRow
                  label="Sellable"
                  total={office.openBoxBreakdown.sellable.total}
                  standard={office.openBoxBreakdown.sellable.standard}
                  kids={office.openBoxBreakdown.sellable.kids}
                />
                <BreakdownRow
                  label="Warranty Grade"
                  total={office.openBoxBreakdown.warrantyGrade.total}
                  standard={office.openBoxBreakdown.warrantyGrade.standard}
                  kids={office.openBoxBreakdown.warrantyGrade.kids}
                />
              </div>
            </div>

            <div style={{ ...styles.card, ...styles.tableCard }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Top Warranty Issues</h3>
              </div>

              <div style={styles.simpleList}>
                {topWarrantyIssues.map((issue) => (
                  <div key={issue.label} style={styles.simpleListRow}>
                    <div style={styles.simpleListLabel}>{issue.label}</div>
                    <div style={styles.simpleListValue}>{issue.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.twoColumnLayout}>
            <div style={{ ...styles.card, ...styles.tableCard }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Office Accessories</h3>
              </div>

              <div style={styles.dataTable}>
                <div style={styles.tableHeader}>
                  <div>Name</div>
                  <div>Quantity</div>
                </div>

                {office.accessories.map((item) => (
                  <div key={item.label} style={styles.tableRow}>
                    <div>
                      <div style={styles.primaryText}>{item.label}</div>
                      <ProgressBar
                        value={Math.abs(item.value)}
                        max={officeAccessoryMax}
                      />
                    </div>
                    <div style={styles.numberCell}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...styles.card, ...styles.tableCard }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>All Warranty Issues</h3>
              </div>

              <div style={styles.dataTable}>
                <div style={styles.tableHeader3}>
                  <div>Issue</div>
                  <div>Total</div>
                  <div>Split</div>
                </div>

                {office.warrantyIssues.map((issue) => (
                  <div key={issue.label} style={styles.tableRow3}>
                    <div>
                      <div style={styles.primaryText}>{issue.label}</div>
                      <ProgressBar value={issue.total} max={Math.max(1, office.status.warranty.total)} />
                    </div>
                    <div style={styles.numberCell}>{issue.total}</div>
                    <div style={styles.splitCell}>
                      S {issue.standard} / K {issue.kids}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>DCL Inventory</h2>

          <div style={styles.cardGrid4}>
            <SummaryCard
              title="DCL Total Units"
              value={dcl.summary.totalUnits}
              helper="DC-1 + Kids + Open_Box"
            />
            <SummaryCard
              title="DCL Standard"
              value={dcl.summary.standardUnits}
              helper="SKU 1"
            />
            <SummaryCard
              title="DCL Kids"
              value={dcl.summary.kidsUnits}
              helper="SKU 7"
            />
            <SummaryCard
              title="DCL Open_Box"
              value={dcl.summary.openBox}
              helper="DCL open box count"
            />
          </div>

          <div style={{ ...styles.card, ...styles.tableCard, marginTop: 24 }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>DCL Accessories</h3>
              <p style={styles.cardSubtitle}>
                SKU, description, quantity, and relative stock level.
              </p>
            </div>

            <div style={styles.dataTable}>
              <div style={styles.tableHeaderDcl}>
                <div>SKU</div>
                <div>Description</div>
                <div>Quantity</div>
              </div>

              {dcl.accessories.map((item) => (
                <div key={`${item.sku}-${item.description}`} style={styles.tableRowDcl}>
                  <div style={styles.mutedCell}>{item.sku}</div>
                  <div>
                    <div style={styles.primaryText}>{item.description || "No description"}</div>
                    <ProgressBar value={Math.abs(item.quantity)} max={dclAccessoryMax} />
                  </div>
                  <div style={styles.numberCell}>{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FloatingMark />
    </main>
  );
}

function TopMetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div style={{ ...styles.card, ...styles.topMetricCard }}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{formatNumber(value)}</div>
      <div style={styles.metricHelper}>{helper}</div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.metricLabel}>{title}</div>
      <div style={styles.metricValue}>{formatNumber(value)}</div>
      <div style={styles.metricHelper}>{helper}</div>
    </div>
  );
}

function StatusCard({
  title,
  value,
  helper,
  standard,
  kids,
  infoButton,
}: {
  title: string;
  value: number;
  helper: string;
  standard: number;
  kids: number;
  infoButton?: React.ReactNode;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.statusCardTop}>
        <div>
          <div style={styles.statusTitleRow}>
            <div style={styles.statusTitle}>{title}</div>
            {infoButton}
          </div>
          <div style={styles.metricHelper}>{helper}</div>
        </div>
        <div style={styles.statusValue}>{formatNumber(value)}</div>
      </div>

      <div style={styles.statusSplitGrid}>
        <div style={styles.statusSplitBox}>
          <div style={styles.statusSplitLabel}>Standard</div>
          <div style={styles.statusSplitValue}>{formatNumber(standard)}</div>
        </div>
        <div style={{ ...styles.statusSplitBox, ...styles.statusSplitBoxAccent }}>
          <div style={{ ...styles.statusSplitLabel, color: "#c2410c" }}>Kids</div>
          <div style={styles.statusSplitValue}>{formatNumber(kids)}</div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({
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
    <div style={styles.breakdownRow}>
      <div>
        <div style={styles.primaryText}>{label}</div>
        <div style={styles.metricHelper}>
          Standard {standard} / Kids {kids}
        </div>
      </div>
      <div style={styles.breakdownValue}>{formatNumber(total)}</div>
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = Math.max(4, Math.min(100, (value / max) * 100));

  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${percent}%` }} />
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
    </>
  );
}

function FloatingMark() {
  return (
    <div style={styles.floatingMark}>
      <svg width="32" height="32" viewBox="0 0 320 200" aria-hidden="true">
        <circle cx="71" cy="59" r="32" fill="#f5b700" />
        <path d="M126 36a69 69 0 1 1-69 69h56V36h13Z" fill="#f59e0b" />
        <path d="M249 36a89 89 0 1 1-89 89h72V36h17Z" fill="#f97316" />
      </svg>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(date);
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8f7f4 0%, #f6f4ef 52%, #f4f1ea 100%)",
    color: "#1c1917",
    position: "relative",
    overflowX: "hidden",
    paddingBottom: 48,
  },
  topNav: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid rgba(120, 113, 108, 0.12)",
    background: "rgba(248, 247, 244, 0.8)",
    backdropFilter: "blur(10px)",
  },
  brand: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1c1917",
  },
  topNavLinks: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  topNavButton: {
    border: "none",
    background: "transparent",
    color: "#57534e",
    fontSize: 15,
    padding: "8px 10px",
    cursor: "pointer",
    borderRadius: 999,
  },
  topNavButtonActive: {
    background: "#ede9df",
    color: "#1c1917",
    fontWeight: 600,
  },
  heroGrid: {
    maxWidth: 1220,
    margin: "28px auto 0",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "1.45fr 1fr 1fr",
    gap: 20,
  },
  card: {
    background: "rgba(255,255,255,0.62)",
    border: "1px solid rgba(120, 113, 108, 0.15)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 10px 30px rgba(28,25,23,0.06)",
    backdropFilter: "blur(10px)",
  },
  heroCard: {
    minHeight: 210,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroTitle: {
    margin: 0,
    fontSize: 40,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    fontWeight: 750,
  },
  syncedText: {
    margin: "14px 0 20px",
    fontSize: 16,
    color: "#78716c",
  },
  heroButtons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  pillButton: {
    border: "1px solid rgba(120, 113, 108, 0.2)",
    background: "#fbfaf7",
    color: "#292524",
    borderRadius: 999,
    padding: "12px 18px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  pillButtonActive: {
    background: "#171717",
    color: "#fff",
    border: "1px solid #171717",
  },
  helperText: {
    marginTop: 14,
    fontSize: 14,
    color: "#78716c",
  },
  errorText: {
    marginTop: 14,
    fontSize: 14,
    color: "#b91c1c",
  },
  topMetricCard: {
    minHeight: 210,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  metricLabel: {
    fontSize: 15,
    color: "#78716c",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 42,
    fontWeight: 760,
    lineHeight: 1,
    letterSpacing: "-0.03em",
    marginBottom: 14,
  },
  metricHelper: {
    fontSize: 15,
    color: "#78716c",
  },
  section: {
    maxWidth: 1220,
    margin: "28px auto 0",
    padding: "0 20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 42,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    fontWeight: 760,
  },
  cardGrid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 20,
    marginTop: 22,
  },
  cardGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 20,
    marginTop: 22,
  },
  subsectionHeader: {
    marginTop: 26,
    marginBottom: 14,
  },
  subsectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  statusCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
  },
  statusTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1c1917",
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 760,
    color: "#111827",
  },
  statusSplitGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 20,
  },
  statusSplitBox: {
    padding: 14,
    borderRadius: 18,
    background: "#f2f0ea",
  },
  statusSplitBoxAccent: {
    background: "#f2ecd9",
  },
  statusSplitLabel: {
    fontSize: 14,
    color: "#78716c",
    marginBottom: 8,
  },
  statusSplitValue: {
    fontSize: 18,
    fontWeight: 740,
  },
  infoWrapper: {
    position: "relative",
  },
  infoButton: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "1px solid rgba(120, 113, 108, 0.2)",
    background: "#f7f4ed",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
  infoPopover: {
    position: "absolute",
    top: 34,
    right: 0,
    width: 250,
    background: "#fffaf0",
    border: "1px solid rgba(120, 113, 108, 0.16)",
    boxShadow: "0 14px 28px rgba(28,25,23,0.12)",
    borderRadius: 16,
    padding: 14,
    zIndex: 10,
  },
  infoPopoverTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  infoLine: {
    fontSize: 13,
    color: "#57534e",
    lineHeight: 1.45,
    marginBottom: 6,
  },
  twoColumnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 20,
  },
  tableCard: {
    overflow: "hidden",
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 730,
  },
  cardSubtitle: {
    margin: "8px 0 0",
    fontSize: 15,
    color: "#78716c",
    lineHeight: 1.45,
  },
  openBoxBreakdownList: {
    display: "grid",
    gap: 12,
  },
  breakdownRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: "14px 0",
    borderBottom: "1px solid rgba(120, 113, 108, 0.12)",
  },
  breakdownValue: {
    fontSize: 24,
    fontWeight: 760,
    whiteSpace: "nowrap",
  },
  simpleList: {
    display: "grid",
    gap: 12,
  },
  simpleListRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid rgba(120, 113, 108, 0.12)",
  },
  simpleListLabel: {
    fontSize: 15,
    color: "#292524",
  },
  simpleListValue: {
    fontSize: 18,
    fontWeight: 740,
  },
  dataTable: {
    display: "grid",
    gap: 0,
    border: "1px solid rgba(120, 113, 108, 0.12)",
    borderRadius: 18,
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    gap: 16,
    padding: "14px 16px",
    background: "#efede7",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  tableHeader3: {
    display: "grid",
    gridTemplateColumns: "1fr 90px 110px",
    gap: 16,
    padding: "14px 16px",
    background: "#efede7",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  tableRow3: {
    display: "grid",
    gridTemplateColumns: "1fr 90px 110px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  tableHeaderDcl: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 120px",
    gap: 16,
    padding: "14px 16px",
    background: "#efede7",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  tableRowDcl: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 120px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  primaryText: {
    fontSize: 15,
    color: "#292524",
    marginBottom: 8,
  },
  mutedCell: {
    fontSize: 14,
    color: "#57534e",
  },
  numberCell: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: 740,
    color: "#111827",
  },
  splitCell: {
    fontSize: 14,
    color: "#57534e",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    background: "#ece7df",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #f0b766 0%, #d7a556 100%)",
  },
  glowOne: {
    position: "fixed",
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(237, 194, 122, 0.16), rgba(237, 194, 122, 0) 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glowTwo: {
    position: "fixed",
    bottom: -140,
    right: -80,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(190, 214, 190, 0.18), rgba(190, 214, 190, 0) 72%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  floatingMark: {
    position: "fixed",
    right: 22,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 24px rgba(28,25,23,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(120, 113, 108, 0.12)",
  },
};