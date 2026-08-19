"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
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

type ViewMode = "office" | "dcl" | "locator";
type SortMode = "name" | "total";

type LocatorFilter =
  | "New DC-1"
  | "New Kids DC-1"
  | "Open Box DC-1"
  | "Open Box Kids DC-1"
  | "Warranty DC-1"
  | "Accessories";

type LocatorTag = LocatorFilter;

type LocatorSectionCategory =
  | "Standard DC-1"
  | "Kids DC-1"
  | "Warranty"
  | "Accessories"
  | "Mixed";

type LocatorRack = {
  rack: string;
  item: string;
  filters: LocatorTag[];
  searchTerms?: string[];
  quantity?: number | null;
};

type LocatorSection = {
  title: string;
  category: LocatorSectionCategory;
  racks: LocatorRack[];
};

type LocatorResult = LocatorRack & {
  shelf: string;
  category: LocatorSectionCategory;
};

const API_URL = process.env.NEXT_PUBLIC_IMS_API_URL ?? "";

const LOCATOR_FILTERS: LocatorFilter[] = [
  "New DC-1",
  "New Kids DC-1",
  "Open Box DC-1",
  "Open Box Kids DC-1",
  "Warranty DC-1",
  "Accessories",
];

const LOCATOR_SECTIONS: LocatorSection[] = [
  {
    title: "Shelf 1",
    category: "Standard DC-1",
    racks: [
      {
        rack: "Rack A, B, C",
        item: "New DC-1",
        filters: ["New DC-1"],
      },
      {
        rack: "Rack D, E",
        item: "Open Box DC-1",
        filters: ["Open Box DC-1"],
      },
    ],
  },
  {
    title: "Shelf 2",
    category: "Standard DC-1",
    racks: [
      {
        rack: "Rack A",
        item: "Refurbished",
        filters: [],
        searchTerms: ["Refurbished DC-1"],
      },
      {
        rack: "Rack B",
        item: "Open Box / Warranty Grade Creaks",
        filters: ["Open Box DC-1", "Warranty DC-1"],
        searchTerms: ["Warranty Creak", "Warranty Grade Creaks"],
      },
      {
        rack: "Rack C, D",
        item: "Warranty Grade Creaks",
        filters: ["Warranty DC-1"],
        searchTerms: ["Warranty Creak"],
      },
    ],
  },
  {
    title: "Shelf 3",
    category: "Kids DC-1",
    racks: [
      {
        rack: "Rack A",
        item: "New Kids DC-1",
        filters: ["New Kids DC-1"],
      },
      {
        rack: "Rack B, C, D",
        item: "Open Box Kids DC-1",
        filters: ["Open Box Kids DC-1"],
      },
    ],
  },
  {
    title: "Shelf 4",
    category: "Warranty",
    racks: [
            { rack: "Rack A", item: "N/A", filters: [] },
      {
        rack: "Rack B",
        item: "Build Quality",
        filters: ["Warranty DC-1"],
      },
      {
        rack: "Rack C",
        item: "Liquid Crystal Leakage, WiFi Issues, Charging / Port Issue, Blank Screen Backlight On, Stylus, Dead Pixel",
        filters: ["Warranty DC-1"],
      },
      {
        rack: "Rack D",
        item: "Charging / Port Issue, WiFi Issues",
        filters: ["Warranty DC-1"],
      },
      { rack: "Rack E", item: "N/A", filters: [] },
      {
        rack: "Rack F",
        item: "Dead Pixel, WiFi Issues",
        filters: ["Warranty DC-1"],
      },
    ],
  },
  {
    title: "Shelf 5",
    category: "Accessories",
    racks: [
      {
        rack: "Rack C",
        item: "Kids Case",
        filters: ["Accessories"],
        searchTerms: ["Kids Cases", "Daylight Kids Case"],
      },
      {
        rack: "Rack D",
        item: "Comfy Sleeve",
        filters: ["Accessories"],
        searchTerms: ["Comfy Sleeves", "Daylight Comfy Sleeve"],
      },
    ],
  },
  {
    title: "Shelf 6",
    category: "Kids DC-1",
    racks: [
      {
        rack: "Rack A",
        item: "VIP Open Box Kids DC-1",
        filters: ["Open Box Kids DC-1"],
        searchTerms: ["VIP"],
      },
      {
        rack: "Rack B",
        item: "Sellable Open Box Kids DC-1",
        filters: ["Open Box Kids DC-1"],
        searchTerms: ["Sellable"],
      },
      {
        rack: "Rack C",
        item: "Warranty Grade Creaks",
        filters: ["Open Box Kids DC-1", "Warranty DC-1"],
      },
      {
        rack: "Rack D",
        item: "Warranty Kids DC-1",
        filters: ["Warranty DC-1"],
      },
    ],
  },
  {
    title: "Shelf 7",
    category: "Accessories",
    racks: [
      {
        rack: "Rack A",
        item: "Daylight Keyboard",
        filters: ["Accessories"],
        searchTerms: ["Daylight Keyboards", "Keyboard"],
      },
      {
        rack: "Rack B",
        item: "Light Bulbs",
        filters: ["Accessories"],
        searchTerms: ["Lightbulbs", "Light Bulb"],
      },
    ],
  },
  {
    title: "Closet",
    category: "Mixed",
    racks: [
      {
        rack: "Rack A",
        item: "Daylight Sling",
        filters: ["Accessories"],
        searchTerms: ["Sling"],
      },
      {
        rack: "Rack B",
        item: "Stands",
        filters: ["Accessories"],
        searchTerms: ["Daylight Stand"],
      },
      {
        rack: "Rack C",
        item: "Warranty Grade Creaks",
        filters: ["Warranty DC-1"],
        searchTerms: ["Warranty Creak Grade", "Warranty Creak"],
      },
      {
        rack: "Rack D",
        item: "Wood Lamp Fixture",
        filters: ["Accessories"],
        searchTerms: ["Lightbulb Fixture", "Wooden Light Fixture", "Wood Lamp Fixture"],
      },
      {
        rack: "Rack E",
        item: "Kids Case",
        filters: ["Accessories"],
        searchTerms: ["Kids Cases", "Daylight Kids Case"],
      },
      {
        rack: "Rack F",
        item: "Comfy Sleeve and Lamy Stylus",
        filters: ["Accessories"],
        searchTerms: ["Comfy Sleeve", "Lamy", "LAMY Pen", "Lamy Stylus"],
      },
      {
        rack: "Rack G",
        item: "Pre-MP Units",
        filters: [],
        searchTerms: ["Pre-MP", "Pre MP", "Pre-MP Rejects"],
      },
    ],
  },
];

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

export default function Page() {
  const [view, setView] = useState<ViewMode>("office");
  const [data, setData] = useState<DashboardPayload>(FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(!!API_URL);
  const [error, setError] = useState<string>("");
  const [showOpenBoxInfo, setShowOpenBoxInfo] = useState(false);
  const [officeAccessorySort, setOfficeAccessorySort] = useState<SortMode>("total");
  const [warrantyIssueSort, setWarrantyIssueSort] = useState<SortMode>("total");
  const [dclAccessorySort, setDclAccessorySort] = useState<SortMode>("total");
  const [locatorSearch, setLocatorSearch] = useState("");
  const [locatorCategory, setLocatorCategory] = useState<LocatorFilter | null>(null);

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
      } catch {
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

  const sortedOfficeAccessories = useMemo(() => {
    const items = [...office.accessories];

    if (officeAccessorySort === "name") {
      return items.sort((a, b) => a.label.localeCompare(b.label));
    }

    return items.sort((a, b) => b.value - a.value);
  }, [office.accessories, officeAccessorySort]);

  const sortedWarrantyIssues = useMemo(() => {
    const items = [...office.warrantyIssues];

    if (warrantyIssueSort === "name") {
      return items.sort((a, b) => a.label.localeCompare(b.label));
    }

    return items.sort((a, b) => b.total - a.total);
  }, [office.warrantyIssues, warrantyIssueSort]);

  const sortedDclAccessories = useMemo(() => {
    const items = [...dcl.accessories];

    if (dclAccessorySort === "name") {
      return items.sort((a, b) => a.description.localeCompare(b.description));
    }

    return items.sort((a, b) => b.quantity - a.quantity);
  }, [dcl.accessories, dclAccessorySort]);

  const locatorResults = useMemo(() => {
    const searchValue = locatorSearch.trim().toLowerCase();

    return LOCATOR_SECTIONS.flatMap((section) =>
      section.racks.map((rack) => ({
        shelf: section.title,
        category: section.category,
        ...rack,
      }))
    ).filter((result) => {
      const matchesFilter = locatorCategory
        ? result.filters.includes(locatorCategory)
        : true;
              const searchText = [
        result.shelf,
        result.category,
        result.rack,
        result.item,
        ...result.filters,
        ...(result.searchTerms || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchValue || searchText.includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [locatorCategory, locatorSearch]);

  const showLocatorResults =
    locatorSearch.trim().length > 0 || locatorCategory !== null;
    const officeAccessoryMax = Math.max(
    1,
    ...office.accessories.map((item) => Math.abs(item.value))
  );

  const warrantyIssueMax = Math.max(
    1,
    ...office.warrantyIssues.map((item) => Math.abs(item.total))
  );

  const dclAccessoryMax = Math.max(
    1,
    ...dcl.accessories.map((item) => Math.abs(item.quantity))
  );

  return (
    <main style={styles.page}>
      <BackgroundGlow />
      <ResponsiveStyles />
      <MobileFloatingSwitch view={view} onChange={setView} />

      <section className="hero-grid" style={styles.heroGrid}>
        <div className="hero-intro-card" style={{ ...styles.card, ...styles.heroCard }}>
          <h1 style={styles.heroTitle}>Daylight IMS</h1>
          <p style={styles.syncedText}>Last synced: {syncedLabel}</p>

          <div style={styles.heroButtons}>
            <button
              type="button"
              style={{
                ...styles.pillButton,
                ...(view === "office" ? styles.pillButtonActive : {}),
              }}
              onClick={() => setView("office")}
            >
              Office Inventory
            </button>
            <button
              type="button"
              style={{
                ...styles.pillButton,
                ...(view === "dcl" ? styles.pillButtonActive : {}),
              }}
              onClick={() => setView("dcl")}
            >
              DCL Inventory
            </button>
            <button
              type="button"
              style={{
                ...styles.pillButton,
                ...(view === "locator" ? styles.pillButtonActive : {}),
              }}
              onClick={() => setView("locator")}
            >
              Locator
            </button>
          </div>

          {loading && <p style={styles.helperText}>Refreshing live data…</p>}
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        <TopMetricCard
          label="Office Inventory Units in Stock"
          value={office.overview.totalDc1s}
        />

        <TopMetricCard
          label="DCL Inventory Units in Stock"
          value={dcl.summary.totalUnits}
        />
      </section>

      {view === "office" ? (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Office Inventory</h2>

          <div className="office-desktop-layout">
            <div className="card-grid-3" style={styles.cardGrid3}>
              <OverviewMetricCard
                label="Total DC-1s Stock"
                value={office.overview.totalDc1s}
              />
              <OverviewMetricCard
                label="Standard DC-1s"
                value={office.overview.standard}
              />
              <OverviewMetricCard
                label="Kid DC-1s"
                value={office.overview.kids}
              />
            </div>

            <div style={styles.subsectionHeader}>
              <h3 style={styles.subsectionTitle}>Inventory Status</h3>
            </div>

            <div className="card-grid-3" style={styles.cardGrid3}>
              <StatusCard
                title="New Units"
                value={office.status.newUnits.total}
                helper="Ready to sell"
                standard={office.status.newUnits.standard}
                kids={office.status.newUnits.kids}
              />

              <StatusCard
                title="Open Box"
                value={office.status.openBox.total}
                helper="VIP, Sellable, or Warranty Grade"
                standard={office.status.openBox.standard}
                kids={office.status.openBox.kids}
                infoButton={
                  <OpenBoxInfoButton
                    show={showOpenBoxInfo}
                    onToggle={() => setShowOpenBoxInfo((prev) => !prev)}
                  />
                }
              />

              <StatusCard
                title="Warranty"
                value={office.status.warranty.total}
                helper="Condition marked as Warranty"
                standard={office.status.warranty.standard}
                kids={office.status.warranty.kids}
              />
            </div>

            <div className="two-column-layout" style={styles.twoColumnLayout}>
              <OpenBoxBreakdownCard office={office} />

              <TopWarrantyIssuesCard issues={topWarrantyIssues} />
            </div>

            <div className="two-column-layout" style={styles.twoColumnLayout}>
              <OfficeAccessoriesCard
                items={sortedOfficeAccessories}
                max={officeAccessoryMax}
                sort={officeAccessorySort}
                onSortChange={setOfficeAccessorySort}
              />

              <AllWarrantyIssuesCard
                items={sortedWarrantyIssues}
                max={warrantyIssueMax}
                sort={warrantyIssueSort}
                onSortChange={setWarrantyIssueSort}
              />
            </div>
          </div>

          <div className="office-mobile-layout" style={styles.officeMobileLayout}>
            <OverviewMetricCard
              label="Total DC-1s Stock"
              value={office.overview.totalDc1s}
            />
            <OverviewMetricCard
              label="Standard DC-1s"
              value={office.overview.standard}
                          />
            <OverviewMetricCard
              label="Kid DC-1s"
              value={office.overview.kids}
            />

            <div style={styles.mobileSubsectionHeader}>
              <h3 style={styles.subsectionTitle}>Inventory Status</h3>
            </div>

            <StatusCard
              title="New Units"
              value={office.status.newUnits.total}
              helper="Ready to sell"
              standard={office.status.newUnits.standard}
              kids={office.status.newUnits.kids}
            />

            <StatusCard
              title="Open Box"
              value={office.status.openBox.total}
              helper="VIP, Sellable, or Warranty Grade"
              standard={office.status.openBox.standard}
              kids={office.status.openBox.kids}
              infoButton={
                <OpenBoxInfoButton
                  show={showOpenBoxInfo}
                  onToggle={() => setShowOpenBoxInfo((prev) => !prev)}
                />
              }
            />

            <OpenBoxBreakdownCard office={office} />

            <StatusCard
              title="Warranty"
              value={office.status.warranty.total}
              helper="Condition marked as Warranty"
              standard={office.status.warranty.standard}
              kids={office.status.warranty.kids}
            />

            <TopWarrantyIssuesCard issues={topWarrantyIssues} />

            <AllWarrantyIssuesCard
              items={sortedWarrantyIssues}
              max={warrantyIssueMax}
              sort={warrantyIssueSort}
              onSortChange={setWarrantyIssueSort}
            />

            <OfficeAccessoriesCard
              items={sortedOfficeAccessories}
              max={officeAccessoryMax}
              sort={officeAccessorySort}
              onSortChange={setOfficeAccessorySort}
            />
          </div>
        </section>
      ) : view === "dcl" ? (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>DCL Inventory</h2>

          <div className="card-grid-4" style={styles.cardGrid4}>
            <OverviewMetricCard
              label="DCL Total Units"
              value={dcl.summary.totalUnits}
            />
            <OverviewMetricCard
              label="DCL Standard"
              value={dcl.summary.standardUnits}
            />
            <OverviewMetricCard
              label="DCL Kids"
              value={dcl.summary.kidsUnits}
            />
            <OverviewMetricCard
              label="DCL Open_Box"
              value={dcl.summary.openBox}
            />
          </div>

          <DclAccessoriesCard
            items={sortedDclAccessories}
            max={dclAccessoryMax}
            sort={dclAccessorySort}
            onSortChange={setDclAccessorySort}
          />
        </section>
      ) : (
        <LocatorView
          search={locatorSearch}
          category={locatorCategory}
          sections={LOCATOR_SECTIONS}
          results={locatorResults}
          showResults={showLocatorResults}
          onSearchChange={setLocatorSearch}
          onCategoryChange={setLocatorCategory}
        />
      )}

      <FloatingMark />
    </main>
  );
}
function MobileFloatingSwitch({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  return (
    <div className="mobile-floating-switch" style={styles.mobileFloatingSwitch}>
      <button
        type="button"
        onClick={() => onChange("office")}
        style={{
          ...styles.mobileFloatingButton,
          ...(view === "office" ? styles.mobileFloatingButtonActive : {}),
        }}
      >
        Office
      </button>
      <button
        type="button"
        onClick={() => onChange("dcl")}
        style={{
          ...styles.mobileFloatingButton,
          ...(view === "dcl" ? styles.mobileFloatingButtonActive : {}),
        }}
      >
        DCL
      </button>
      <button
        type="button"
        onClick={() => onChange("locator")}
        style={{
          ...styles.mobileFloatingButton,
          ...(view === "locator" ? styles.mobileFloatingButtonActive : {}),
        }}
      >
        Locator
      </button>
    </div>
  );
}

function LocatorView({
  search,
  category,
  sections,
  results,
  showResults,
  onSearchChange,
  onCategoryChange,
}: {
  search: string;
  category: LocatorFilter | null;
  sections: LocatorSection[];
  results: LocatorResult[];
  showResults: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: LocatorFilter | null) => void;
}) {
  const searchValue = search.trim();
  const resultTitle = category || (searchValue ? `Search results for "${searchValue}"` : "Shelf Map");
  const resultCountLabel = `${results.length} ${results.length === 1 ? "location" : "locations"} found`;
  const totalQuantity = results.reduce((total, result) => {
    return typeof result.quantity === "number" ? total + result.quantity : total;
  }, 0);
  const hasQuantity = results.some((result) => typeof result.quantity === "number");

  return (
    <section style={styles.section}>
      <div style={styles.locatorHeader}>
        <h2 style={styles.sectionTitle}>Locator</h2>
        <p style={styles.locatorSummary}>
          Find where units and accessories are stored in the office.
        </p>
              </div>

      <div style={styles.locatorControls}>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search shelf, rack, item, or category..."
          style={styles.locatorSearchInput}
        />

        <div style={styles.locatorFilterRow}>
          {LOCATOR_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onCategoryChange(category === filter ? null : filter)}
              style={{
                ...styles.locatorChip,
                ...(category === filter ? styles.locatorChipActive : {}),
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {showResults ? (
        <>
          <div style={{ ...styles.card, ...styles.locatorResultsHeaderCard }}>
            <div>
              <h3 style={styles.locatorResultsTitle}>{resultTitle}</h3>
              <p style={styles.locatorResultsSub}>{resultCountLabel}</p>
            </div>
            <div style={styles.locatorTotalBadge}>
              Total: {hasQuantity ? formatNumber(totalQuantity) : "--"}
            </div>
          </div>

          {results.length > 0 ? (
            <div style={styles.locatorResultList}>
              {results.map((result) => (
                <LocatorResultCard
                  key={`${result.shelf}-${result.rack}-${result.item}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <div style={{ ...styles.card, ...styles.emptyLocatorCard }}>
              No matching locations found.
            </div>
          )}
        </>
      ) : sections.length > 0 ? (
        <div className="locator-grid" style={styles.locatorGrid}>
          {sections.map((section) => (
            <LocatorCard key={section.title} section={section} />
          ))}
        </div>
      ) : (
        <div style={{ ...styles.card, ...styles.emptyLocatorCard }}>
          No storage areas found.
        </div>
      )}
    </section>
  );
}

function LocatorCard({ section }: { section: LocatorSection }) {
  return (
    <div style={{ ...styles.card, ...styles.locatorCard }}>
      <div style={styles.locatorCardHeader}>
        <div>
          <h3 style={styles.locatorShelfTitle}>{section.title}</h3>
        </div>
        <span style={styles.locatorBadge}>{section.category}</span>
      </div>

      <div style={styles.locatorRackList}>
        {section.racks.map((rack) => (
          <LocatorRackRow
            key={`${section.title}-${rack.rack}-${rack.item}`}
            rack={rack}
          />
        ))}
      </div>
    </div>
  );
}

function LocatorRackRow({ rack }: { rack: LocatorRack }) {
  return (
    <div className="locator-rack-row" style={styles.locatorRackRow}>
      <div style={styles.locatorRackName}>{rack.rack}</div>
      <div style={styles.locatorRackItem}>{rack.item}</div>
    </div>
  );
}

function LocatorResultCard({ result }: { result: LocatorResult }) {
  return (
    <div className="locator-result-card" style={{ ...styles.card, ...styles.locatorResultCard }}>
      <div style={styles.locatorResultTop}>
        <div style={styles.locatorResultItem}>{result.item}</div>
        <div style={styles.locatorQuantityBadge}>
          Qty {formatLocatorQuantity(result.quantity)}
        </div>
      </div>
      <div style={styles.locatorResultLocation}>
        {result.shelf} · {result.rack}
      </div>
    </div>
  );
}

function OpenBoxInfoButton({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={styles.infoWrapper}>
      <button
        type="button"
        onClick={onToggle}
        style={styles.infoButton}
        aria-label="Open box definitions"
        title="Open box definitions"
      >
        i
      </button>

      {show && (
        <div className="open-box-info-popover" style={styles.infoPopover}>
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
  );
}

function TopMetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={{ ...styles.card, ...styles.topMetricCard }}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{formatNumber(value)}</div>
    </div>
  );
}

function OverviewMetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{formatNumber(value)}</div>
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
  infoButton?: ReactNode;
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
function OpenBoxBreakdownCard({ office }: { office: OfficeData }) {
  return (
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
  );
}

function TopWarrantyIssuesCard({ issues }: { issues: WarrantyIssue[] }) {
  return (
    <div style={{ ...styles.card, ...styles.tableCard }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Top Warranty Issues in Office</h3>
      </div>

      <div style={styles.simpleList}>
        {issues.map((issue) => (
          <div key={issue.label} style={styles.simpleListRow}>
            <div style={styles.simpleListLabel}>{issue.label}</div>
            <div style={styles.simpleListValue}>{issue.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OfficeAccessoriesCard({
  items,
  max,
  sort,
  onSortChange,
}: {
  items: OfficeAccessory[];
  max: number;
  sort: SortMode;
  onSortChange: (sort: SortMode) => void;
}) {
  return (
    <div style={{ ...styles.card, ...styles.tableCard }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Office Accessories</h3>
      </div>

      <div style={styles.dataTable}>
        <div className="table-header-accessory" style={styles.tableHeaderAccessory}>
          <button
            type="button"
            onClick={() => onSortChange("name")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "name" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Name
          </button>
          <div />
          <button
            type="button"
            onClick={() => onSortChange("total")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "total" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Total
          </button>
        </div>

        {items.map((item) => (
          <div
            key={item.label}
            className="table-row-accessory"
            style={styles.tableRowAccessory}
          >
            <div style={styles.primaryTextNoMargin}>{item.label}</div>
            <ProgressBar value={Math.abs(item.value)} max={max} />
            <div style={styles.numberCell}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllWarrantyIssuesCard({
  items,
  max,
  sort,
  onSortChange,
}: {
  items: WarrantyIssue[];
  max: number;
  sort: SortMode;
  onSortChange: (sort: SortMode) => void;
}) {
  return (
    <div style={{ ...styles.card, ...styles.tableCard }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>All Warranty Issues</h3>
      </div>

      <div style={styles.dataTable}>
        <div className="table-header-warranty" style={styles.tableHeaderWarranty}>
          <button
            type="button"
            onClick={() => onSortChange("name")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "name" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Issue
                      </button>
          <div />
          <button
            type="button"
            onClick={() => onSortChange("total")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "total" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Total
          </button>
        </div>

        {items.map((issue) => (
          <div
            key={issue.label}
            className="table-row-warranty"
            style={styles.tableRowWarranty}
          >
            <div>
              <div style={styles.primaryTextNoMargin}>{issue.label}</div>
              <div style={styles.warrantySplitTiny}>
                S {issue.standard} / K {issue.kids}
              </div>
            </div>
            <ProgressBar value={issue.total} max={max} />
            <div style={styles.numberCell}>{issue.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DclAccessoriesCard({
  items,
  max,
  sort,
  onSortChange,
}: {
  items: DclAccessory[];
  max: number;
  sort: SortMode;
  onSortChange: (sort: SortMode) => void;
}) {
  return (
    <div style={{ ...styles.card, ...styles.tableCard, marginTop: 24 }}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>DCL Accessories</h3>
      </div>

      <div style={styles.dataTable}>
        <div className="table-header-dcl" style={styles.tableHeaderDcl}>
          <button
            type="button"
            onClick={() => onSortChange("name")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "name" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Name
          </button>
          <div />
          <button
            type="button"
            onClick={() => onSortChange("total")}
            style={{
              ...styles.sortHeaderButton,
              ...(sort === "total" ? styles.sortHeaderButtonActive : {}),
            }}
          >
            Total
          </button>
        </div>

        {items.map((item) => (
          <div
            key={`${item.sku}-${item.description}`}
            className="table-row-dcl"
            style={styles.tableRowDcl}
          >
            <div>
              <div style={styles.primaryTextNoMargin}>
                {item.description || "No description"}
              </div>
              <div style={styles.warrantySplitTiny}>SKU {item.sku}</div>
            </div>
            <ProgressBar value={Math.abs(item.quantity)} max={max} />
            <div style={styles.numberCell}>{item.quantity}</div>
          </div>
        ))}
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
        <div style={styles.breakdownLabel}>{label}</div>
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

function ResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 980px) {
        .hero-grid,
        .card-grid-3,
        .card-grid-4,
        .two-column-layout,
        .locator-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 640px) {
        body {
          overflow-x: hidden;
        }

        .mobile-floating-switch {
          display: flex !important;
        }

        .hero-intro-card {
          display: none !important;
        }

        .office-desktop-layout {
          display: none !important;
        }

        .office-mobile-layout {
          display: grid !important;
        }

        .hero-grid {
          margin-top: 76px !important;
          padding-left: 14px !important;
          padding-right: 14px !important;
          gap: 12px !important;
        }

        .card-grid-3,
        .card-grid-4,
        .two-column-layout {
          gap: 12px !important;
          margin-top: 14px !important;
        }
                  .open-box-info-popover {
          position: fixed !important;
          top: 88px !important;
          left: 16px !important;
          right: 16px !important;
          width: auto !important;
          max-width: none !important;
          z-index: 80 !important;
        }

        .table-header-accessory,
        .table-row-accessory,
        .table-header-warranty,
        .table-row-warranty,
        .table-header-dcl,
        .table-row-dcl {
          grid-template-columns: minmax(0, 1fr) 56px 52px !important;
          gap: 8px !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        .locator-rack-row {
          grid-template-columns: 1fr !important;
          gap: 6px !important;
        }

        .locator-result-card {
          padding: 16px !important;
        }
      }
    `}</style>
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
      <div style={styles.floatingLogoInner}>
        <Image
          src="/daylight-logo.png"
          alt="Daylight logo"
          fill
          style={{ objectFit: "contain" }}
          priority
          sizes="40px"
        />
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatLocatorQuantity(value?: number | null) {
  if (typeof value !== "number") {
    return "--";
  }

  return formatNumber(value);
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

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8f7f4 0%, #f6f4ef 52%, #f4f1ea 100%)",
    color: "#1c1917",
    position: "relative",
    overflowX: "hidden",
    paddingBottom: 48,
  },
  mobileFloatingSwitch: {
    display: "none",
    position: "fixed",
    top: 14,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 70,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(120, 113, 108, 0.14)",
    borderRadius: 999,
    padding: 5,
    boxShadow: "0 10px 24px rgba(28,25,23,0.12)",
    backdropFilter: "blur(10px)",
    gap: 4,
  },
  mobileFloatingButton: {
    border: "none",
    background: "transparent",
    borderRadius: 999,
    padding: "9px 12px",
    fontSize: 13,
    fontWeight: 700,
    color: "#57534e",
    cursor: "pointer",
  },
  mobileFloatingButtonActive: {
    background: "#171717",
    color: "#fff",
  },
  officeMobileLayout: {
    display: "none",
    gap: 12,
    marginTop: 14,
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
  mobileSubsectionHeader: {
    marginTop: 10,
    marginBottom: 0,
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
  breakdownLabel: {
    fontSize: 17,
    fontWeight: 740,
    color: "#292524",
    marginBottom: 8,
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
  warrantySplitTiny: {
    marginTop: 4,
    fontSize: 12,
    color: "#78716c",
    lineHeight: 1.2,
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
  sortHeaderButton: {
    border: "none",
    background: "transparent",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
  },
  sortHeaderButtonActive: {
    color: "#1c1917",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  tableHeaderAccessory: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 90px",
    gap: 16,
    padding: "14px 16px",
    background: "#efede7",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  tableRowAccessory: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 90px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  tableHeaderWarranty: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 90px",
    gap: 16,
    padding: "14px 16px",
    background: "#efede7",
    color: "#57534e",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  tableRowWarranty: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 90px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  tableHeaderDcl: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 90px",
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
    gridTemplateColumns: "1fr 120px 90px",
    gap: 16,
    padding: "14px 16px",
    borderTop: "1px solid rgba(120, 113, 108, 0.12)",
    alignItems: "center",
  },
  primaryTextNoMargin: {
    fontSize: 15,
    color: "#292524",
    marginBottom: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  numberCell: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: 740,
    color: "#111827",
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
  locatorHeader: {
    marginBottom: 18,
  },
  locatorSummary: {
    margin: "10px 0 0",
    fontSize: 16,
    color: "#78716c",
  },
  locatorControls: {
    display: "grid",
    gap: 14,
    marginTop: 18,
    marginBottom: 20,
  },
  locatorSearchInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(120, 113, 108, 0.18)",
    background: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: "14px 16px",
    fontSize: 15,
    color: "#292524",
    outline: "none",
    boxShadow: "0 8px 22px rgba(28,25,23,0.04)",
  },
  locatorFilterRow: {
    display: "flex",
    gap: 10,
        flexWrap: "wrap",
  },
  locatorChip: {
    border: "1px solid rgba(120, 113, 108, 0.18)",
    background: "rgba(255,255,255,0.7)",
    color: "#57534e",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  locatorChipActive: {
    background: "#171717",
    color: "#fff",
    border: "1px solid #171717",
  },
  locatorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },
  locatorCard: {
    padding: 0,
    overflow: "hidden",
  },
  locatorCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 18px 14px",
    borderBottom: "1px solid rgba(120, 113, 108, 0.12)",
  },
  locatorShelfTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 760,
    letterSpacing: "-0.02em",
  },
  locatorBadge: {
    borderRadius: 999,
    background: "#f2ecd9",
    color: "#9a3412",
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  locatorRackList: {
    display: "grid",
  },
  locatorRackRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 14,
    padding: "14px 18px",
    borderTop: "1px solid rgba(120, 113, 108, 0.1)",
    alignItems: "start",
  },
  locatorRackName: {
    fontSize: 14,
    fontWeight: 800,
    color: "#292524",
  },
  locatorRackItem: {
    fontSize: 14,
    color: "#57534e",
    lineHeight: 1.45,
  },
  locatorResultsHeaderCard: {
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  locatorResultsTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 760,
    letterSpacing: "-0.02em",
  },
  locatorResultsSub: {
    margin: "8px 0 0",
    fontSize: 14,
    color: "#78716c",
  },
  locatorTotalBadge: {
    borderRadius: 999,
    background: "#171717",
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  locatorResultList: {
    display: "grid",
    gap: 12,
  },
  locatorResultCard: {
    padding: 18,
  },
  locatorResultTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  locatorResultItem: {
    fontSize: 18,
    fontWeight: 760,
    color: "#292524",
    lineHeight: 1.25,
  },
  locatorQuantityBadge: {
    borderRadius: 999,
    background: "#f2ecd9",
    color: "#9a3412",
    padding: "7px 11px",
    fontSize: 13,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  locatorResultLocation: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 700,
    color: "#57534e",
  },
  emptyLocatorCard: {
    marginTop: 18,
    color: "#78716c",
    fontSize: 15,
  },
  glowOne: {
    position: "fixed",
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(237, 194, 122, 0.16), rgba(237, 194, 122, 0) 70%)",
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
    background:
      "radial-gradient(circle, rgba(190, 214, 190, 0.18), rgba(190, 214, 190, 0) 72%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  floatingMark: {
    position: "fixed",
    right: 22,
    bottom: 22,
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 24px rgba(28,25,23,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(120, 113, 108, 0.12)",
  },
  floatingLogoInner: {
    position: "relative",
    width: 40,
    height: 40,
  },
};
