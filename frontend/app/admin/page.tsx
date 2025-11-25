"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";
import {
  addAdminProductImage,
  createAdminCategory,
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminOrders,
  fetchAdminOverview,
  fetchAdminProducts,
  fetchAdminSettings,
  fetchAdminUsers,
  markAdminOrderPaid,
  saveAdminSettings,
  updateAdminOrderStatus,
  updateAdminProduct,
  updateAdminUser,
  fetchAuditLogs,
} from "@/lib/admin-api";
import type {
  AdminCategory,
  AdminOrder,
  AdminOverview,
  AdminProduct,
  AdminUser,
  AuditLogEntry,
  SettingsPayload,
  ShippingZone,
} from "@/types/admin";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

const statusTransitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED", "FULFILLED"],
  PAID: ["FULFILLED", "CANCELLED", "REFUNDED"],
  FULFILLED: ["REFUNDED"],
  REFUNDED: [],
  CANCELLED: [],
};

type ProductDraft = {
  stock: string;
  priceLKR: string;
  active: boolean;
};

type SettingsDraft = {
  codEnabled: boolean;
  payhereMerchantId: string;
  payhereMerchantSecret: string;
  payhereSandbox: boolean;
  shippingNotes: string;
  shippingZones: ShippingZone[];
};

const emptyProductForm = {
  name: "",
  sku: "",
  priceLKR: "",
  stock: "",
  description: "",
  compareAtLKR: "",
  categoryIds: [] as string[],
};

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12" />
  </svg>
);

const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

const formatUserName = (
  user?: { firstName?: string | null; lastName?: string | null; email: string } | null,
) => {
  if (!user) return "Guest";
  if (user.firstName || user.lastName) {
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  }
  return user.email;
};

const flattenRootCategories = (categories: AdminCategory[]) =>
  categories
    .filter((cat) => !cat.parentId)
    .map((cat) => ({
      ...cat,
      children: cat.children || [],
    }));

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const allowedCategoryNames = [
  "Chargers",
  "Cables",
  "Bluetooth Speakers",
  "Karaoke Speakers",
  "Smart Watches",
  "Mobile & Tablets",
  "Powerbanks",
  "Home Appliances",
];

const allowedCategoryOrder = new Map(
  allowedCategoryNames.map((name, index) => [normalizeName(name), index]),
);

const timeframeOptions = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "6m", label: "Last 6 months", days: 180 },
  { id: "1y", label: "Last year", days: 365 },
];

const metricOptions = [
  { id: "revenue", label: "Revenue" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Customers" },
];

type ConfirmDialogState = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
  onConfirm?: () => Promise<void> | void;
};

export default function AdminPage() {
  const { user, openAuth, loading: authLoading, logout } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [productDrafts, setProductDrafts] = useState<Record<string, ProductDraft>>({});
  const [productForm, setProductForm] =
    useState<typeof emptyProductForm>(emptyProductForm);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [imageUploads, setImageUploads] = useState<
    { id: string; file: File; url: string; isPrimary: boolean }[]
  >([]);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<SettingsDraft | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [audit, setAudit] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [growthMetric, setGrowthMetric] = useState<"revenue" | "orders" | "customers">(
    "revenue",
  );
  const [growthWindow, setGrowthWindow] = useState<"7d" | "30d" | "6m" | "1y">("7d");

  const ensureBaselineCategories = useCallback(
    async (existing: AdminCategory[]) => {
      const existingNames = new Set(existing.map((category) => normalizeName(category.name)));
      const missing = allowedCategoryNames
        .map((name, index) => ({ name, position: index + 1 }))
        .filter(({ name }) => !existingNames.has(normalizeName(name)));
      if (!missing.length) return existing;

      try {
        const created = await Promise.all(
          missing.map((category) =>
            createAdminCategory({
              name: category.name,
              position: category.position,
            }),
          ),
        );
        const createdCategories = created
          .map((response) => response.category)
          .filter(Boolean) as AdminCategory[];
        return [...existing, ...createdCategories];
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to sync default categories.";
        notifyError("Categories", message);
        return existing;
      }
    },
    [notifyError],
  );

  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";
  const rootCategories = useMemo(
    () => {
      const flattened = flattenRootCategories(categories);
      const filtered = flattened.filter((cat) =>
        allowedCategoryOrder.has(normalizeName(cat.name)),
      );
      return filtered.sort((a, b) => {
        const aOrder = allowedCategoryOrder.get(normalizeName(a.name)) ?? Number.MAX_SAFE_INTEGER;
        const bOrder = allowedCategoryOrder.get(normalizeName(b.name)) ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
      });
    },
    [categories],
  );
  const visibleProducts = useMemo(
    () => products.filter((product) => product.active),
    [products],
  );
  const selectedTimeframe = useMemo(
    () => timeframeOptions.find((item) => item.id === growthWindow) || timeframeOptions[0],
    [growthWindow],
  );

  const growthSeries = useMemo(() => {
    if (!orders.length) return [];
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(end.getDate() - (selectedTimeframe.days - 1));

    const buckets: {
      key: string;
      date: Date;
      revenue: number;
      orders: number;
      customers: Set<string>;
    }[] = [];

    for (let i = 0; i < selectedTimeframe.days; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      buckets.push({ key, date, revenue: 0, orders: 0, customers: new Set() });
    }
    const index = new Map(buckets.map((bucket, i) => [bucket.key, i]));

    orders.forEach((order) => {
      const day = new Date(order.createdAt);
      day.setHours(0, 0, 0, 0);
      if (day < start || day > end) return;
      const key = day.toISOString().slice(0, 10);
      const bucketIdx = index.get(key);
      if (bucketIdx === undefined) return;
      const bucket = buckets[bucketIdx];
      bucket.revenue += order.totalLKR;
      bucket.orders += 1;
      bucket.customers.add(order.user?.id || `guest-${order.id}`);
    });

    return buckets.map((bucket) => {
      const value =
        growthMetric === "revenue"
          ? bucket.revenue
          : growthMetric === "orders"
            ? bucket.orders
            : bucket.customers.size;
      const dateLabel =
        selectedTimeframe.days <= 30
          ? bucket.date.toLocaleDateString("en", { month: "short", day: "numeric" })
          : bucket.date.toLocaleDateString("en", { month: "short" });
      return { label: dateLabel, value };
    });
  }, [orders, growthMetric, selectedTimeframe.days]);

  const growthSummary = useMemo(() => {
    const total = growthSeries.reduce((sum, point) => sum + point.value, 0);
    const max = growthSeries.reduce((m, p) => Math.max(m, p.value), 0);
    const formatter =
      growthMetric === "revenue"
        ? (val: number) => currency.format(val)
        : (val: number) => val.toLocaleString();
    return {
      total: formatter(total),
      peak: formatter(max),
      formatter,
    };
  }, [growthMetric, growthSeries]);

  const chartData = useMemo(
    () => ({
      labels: growthSeries.map((point) => point.label),
      datasets: [
        {
          label: metricOptions.find((m) => m.id === growthMetric)?.label ?? "Series",
          data: growthSeries.map((point) => point.value),
          tension: 0.36,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.4,
          borderColor: "#0F172A",
          backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
            const { ctx } = context.chart;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(15, 23, 42, 0.18)");
            gradient.addColorStop(1, "rgba(15, 23, 42, 0.02)");
            return gradient;
          },
          pointBackgroundColor: "#0F172A",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 1.5,
        },
      ],
    }),
    [growthMetric, growthSeries],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0F172A",
          borderColor: "#E2E8F0",
          borderWidth: 1,
          titleColor: "#FFFFFF",
          bodyColor: "#E2E8F0",
          displayColors: false,
          callbacks: {
            label: (ctx: any) =>
              growthSummary.formatter
                ? `${growthSummary.formatter(ctx.parsed.y)}`
                : ctx.parsed.y,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748B", font: { size: 11 } },
        },
        y: {
          grid: { color: "rgba(148, 163, 184, 0.2)" },
          ticks: {
            color: "#64748B",
            font: { size: 11 },
            callback: (value: number | string) => {
              const num = Number(value);
              if (Number.isNaN(num)) return value;
              if (growthMetric === "revenue") {
                if (num >= 1_000_000) return `${Math.round(num / 1_000_000)}M`;
                if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
              }
              return num;
            },
          },
        },
      },
    }),
    [growthMetric, growthSummary.formatter],
  );

  const navItems = [
    { id: "overview", label: "Home" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "User management" },
    { id: "catalog", label: "Catalog" },
    { id: "inventory", label: "Inventory" },
    { id: "signals", label: "Signals" },
    { id: "settings", label: "Settings" },
    { id: "audit", label: "Audit" },
  ];

  const setLoadingFlag = (key: string, value: boolean) =>
    setLoadingMap((prev) => ({ ...prev, [key]: value }));

  const hydrateSettingsDraft = (data: SettingsPayload) => {
    const baseZones = data.shippingZones?.length
      ? data.shippingZones
      : [
          {
            id: `new-${Date.now()}`,
            name: "Sri Lanka",
            districts: [],
            rates: [
              { id: `rate-${Date.now()}`, label: "Standard", minSubtotalLKR: 0, priceLKR: 0 },
            ],
          },
        ];

    setSettingsDraft({
      codEnabled: data.settings.codEnabled,
      payhereMerchantId: data.settings.payhereMerchantId ?? "",
      payhereMerchantSecret: data.settings.payhereMerchantSecret ?? "",
      payhereSandbox: data.settings.payhereSandbox,
      shippingNotes: data.settings.shippingNotes ?? "",
      shippingZones: baseZones,
    });
  };

  const refreshAdminData = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setRefreshing(true);
    setLoadingFlag("refresh", true);
    setError(null);
    try {
      const [
        overviewPayload,
        productPayload,
        categoryPayload,
        orderPayload,
        settingsPayload,
        userPayload,
        auditPayload,
      ] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminProducts({ limit: 24 }),
        fetchAdminCategories(),
        fetchAdminOrders({ limit: 100 }),
        fetchAdminSettings(),
        fetchAdminUsers(),
        fetchAuditLogs({ limit: 8 }),
      ]);

      setOverview(overviewPayload.overview);
      setProducts(productPayload.data);
      const syncedCategories = await ensureBaselineCategories(categoryPayload.categories);
      setCategories(syncedCategories);
      setOrders(orderPayload.data);
      hydrateSettingsDraft(settingsPayload);
      setUsers(userPayload.data);
      setAudit(auditPayload.data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load admin data. Check your session.";
      setError(message);
      notifyError("Admin dashboard", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingFlag("refresh", false);
    }
  }, [isAdmin, notifyError, ensureBaselineCategories]);

  useEffect(() => {
    void refreshAdminData();
  }, [refreshAdminData]);

  const readImagesAsDataUrl = async (
    uploads: { file: File; isPrimary: boolean }[],
  ) => {
    if (!uploads.length) return [];
    const readers = uploads.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file.file);
        }),
    );
    return Promise.all(readers);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setImageUploads([]);
    setShowProductModal(true);
  };

  const openConfirmDialog = (config: Omit<ConfirmDialogState, "open">) => {
    setConfirmDialog({ ...config, open: true });
  };

  const closeConfirmDialog = () => {
    if (confirmLoading) return;
    setConfirmDialog(null);
  };

  const runConfirmDialog = async () => {
    if (!confirmDialog?.onConfirm) {
      setConfirmDialog(null);
      return;
    }
    setConfirmLoading(true);
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const openEditProductModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      sku: product.sku,
      priceLKR: String(product.priceLKR),
      stock: String(product.stock),
      description: product.description || "",
      compareAtLKR: product.compareAtLKR ? String(product.compareAtLKR) : "",
      categoryIds: product.categories[0] ? [product.categories[0].id] : [],
    });
    setImageUploads([]);
    setShowProductModal(true);
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      notifyError("Category", "Name is required.");
      return;
    }
    if (loadingMap["category"]) return;
    setLoadingFlag("category", true);
    try {
      await createAdminCategory({
        name: categoryForm.name.trim(),
      });
      notifySuccess("Category created", categoryForm.name.trim());
      setCategoryForm({ name: "" });
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save category.";
      notifyError("Category", message);
    } finally {
      setLoadingFlag("category", false);
    }
  };

  const handleCreateOrUpdateProduct = async () => {
    if (loadingMap["product-submit"]) return;
    setLoadingFlag("product-submit", true);
    try {
      const payload = {
        name: productForm.name.trim(),
        sku: productForm.sku.trim(),
        priceLKR: Number(productForm.priceLKR),
        stock: Number(productForm.stock || 0),
        description: productForm.description.trim(),
        compareAtLKR: productForm.compareAtLKR ? Number(productForm.compareAtLKR) : undefined,
        categoryIds: productForm.categoryIds.slice(0, 1),
      };
      const result = editingProduct
        ? await updateAdminProduct(editingProduct.id, payload)
        : await createAdminProduct(payload);

      const orderedUploads = [...imageUploads].sort((a, b) =>
        a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1,
      );
      const dataUrls = await readImagesAsDataUrl(orderedUploads);
      for (const url of dataUrls) {
        await addAdminProductImage(result.product.id, { url });
      }

      notifySuccess(
        "Product saved",
        `${result.product.name} ${editingProduct ? "updated" : "created"}`,
      );
      setProductForm(emptyProductForm);
      setEditingProduct(null);
      setShowProductModal(false);
      setImageUploads([]);
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save product.";
      notifyError("Product", message);
    } finally {
      setLoadingFlag("product-submit", false);
    }
  };

  const handleProductDraftChange = (
    id: string,
    field: keyof ProductDraft,
    value: string | boolean,
  ) => {
    setProductDrafts((prev) => ({
      ...prev,
      [id]: {
        stock: prev[id]?.stock ?? String(products.find((p) => p.id === id)?.stock ?? 0),
        priceLKR:
          prev[id]?.priceLKR ?? String(products.find((p) => p.id === id)?.priceLKR ?? 0),
        active: prev[id]?.active ?? products.find((p) => p.id === id)?.active ?? true,
        [field]: value,
      },
    }));
  };

  const handleSaveProductRow = async (product: AdminProduct) => {
    if (loadingMap[`save-${product.id}`]) return;
    setLoadingFlag(`save-${product.id}`, true);
    const draft = productDrafts[product.id] || {
      stock: String(product.stock),
      priceLKR: String(product.priceLKR),
      active: product.active,
    };
    try {
      const updates = {
        stock: Number(draft.stock),
        priceLKR: Number(draft.priceLKR),
        active: draft.active,
      };
      await updateAdminProduct(product.id, updates);
      notifySuccess("Catalog updated", `${product.name} saved`);
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update product.";
      notifyError("Product", message);
    } finally {
      setLoadingFlag(`save-${product.id}`, false);
    }
  };

  const handleDeactivateProduct = async (product: AdminProduct) => {
    if (loadingMap[`delete-${product.id}`]) return;
    setLoadingFlag(`delete-${product.id}`, true);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    try {
      await updateAdminProduct(product.id, { active: false });
      notifySuccess("Product deactivated", product.name);
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to deactivate product.";
      notifyError("Product", message);
    } finally {
      setLoadingFlag(`delete-${product.id}`, false);
    }
  };

  const promptDeactivateProduct = (product: AdminProduct) => {
    openConfirmDialog({
      title: "Deactivate product",
      body: `Hide ${product.name} from the store? Customers will no longer see it.`,
      confirmLabel: "Deactivate",
      tone: "danger",
      onConfirm: () => handleDeactivateProduct(product),
    });
  };

  const handleStatusChange = async (order: AdminOrder, nextStatus: string) => {
    if (loadingMap[`order-${order.id}`]) return;
    setLoadingFlag(`order-${order.id}`, true);
    try {
      await updateAdminOrderStatus(order.id, nextStatus);
      notifySuccess("Order updated", `${order.orderNo} → ${nextStatus}`);
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update order.";
      notifyError("Order", message);
    } finally {
      setLoadingFlag(`order-${order.id}`, false);
    }
  };

  const handleMarkPaid = async (order: AdminOrder) => {
    if (loadingMap[`mark-${order.id}`]) return;
    setLoadingFlag(`mark-${order.id}`, true);
    try {
      await markAdminOrderPaid(order.id);
      notifySuccess("Payment captured", `${order.orderNo} marked paid`);
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to mark paid.";
      notifyError("Payment", message);
    } finally {
      setLoadingFlag(`mark-${order.id}`, false);
    }
  };

  const handleSettingsChange = <K extends keyof SettingsDraft>(
    key: K,
    value: SettingsDraft[K],
  ) => {
    setSettingsDraft((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev,
    );
  };

  const updateZone = (id: string, update: Partial<ShippingZone>) => {
    setSettingsDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shippingZones: prev.shippingZones.map((zone) =>
          zone.id === id ? { ...zone, ...update } : zone,
        ),
      };
    });
  };

  const updateRate = (
    zoneId: string,
    rateId: string,
    field: keyof ShippingZone["rates"][number],
    value: string,
  ) => {
    setSettingsDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shippingZones: prev.shippingZones.map((zone) => {
          if (zone.id !== zoneId) return zone;
          return {
            ...zone,
            rates: zone.rates.map((rate) =>
              rate.id === rateId
                ? { ...rate, [field]: field === "label" ? value : Number(value) || 0 }
                : rate,
            ),
          };
        }),
      };
    });
  };

  const handleSaveSettings = async () => {
    if (!settingsDraft) return;
    if (loadingMap["settings"]) return;
    setLoadingFlag("settings", true);
    try {
      const normalizedZones = settingsDraft.shippingZones.map((zone) => ({
        id: zone.id.startsWith("new-") ? undefined : zone.id,
        name: zone.name,
        districts: zone.districts,
        rates: zone.rates.map((rate) => ({
          id: rate.id.startsWith("rate-") ? undefined : rate.id,
          label: rate.label,
          minSubtotalLKR: rate.minSubtotalLKR,
          priceLKR: rate.priceLKR,
        })),
      }));

      const payload = await saveAdminSettings({
        codEnabled: settingsDraft.codEnabled,
        payhereMerchantId: settingsDraft.payhereMerchantId || null,
        payhereMerchantSecret: settingsDraft.payhereMerchantSecret || null,
        payhereSandbox: settingsDraft.payhereSandbox,
        shippingNotes: settingsDraft.shippingNotes || null,
        shippingZones: normalizedZones,
      });
      hydrateSettingsDraft(payload);
      notifySuccess("Settings saved", "Store settings updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save settings.";
      notifyError("Settings", message);
    } finally {
      setLoadingFlag("settings", false);
    }
  };

  const handleUserUpdate = async (selectedUser: AdminUser, updates: Partial<AdminUser>) => {
    if (loadingMap[`user-${selectedUser.id}`]) return;
    setLoadingFlag(`user-${selectedUser.id}`, true);
    try {
      await updateAdminUser(selectedUser.id, updates);
      notifySuccess("User updated", formatUserName(selectedUser));
      await refreshAdminData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update user.";
      notifyError("Users", message);
    } finally {
      setLoadingFlag(`user-${selectedUser.id}`, false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          Loading
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Preparing admin console...
        </h1>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          Admin only
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Secure control center
        </h1>
        <p className="max-w-2xl text-slate-600">
          You need an admin or staff account to access catalog, orders, settings, and audit
          controls.
        </p>
        <button
          onClick={() => openAuth("login")}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl"
        >
          Sign in as admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:px-0 lg:py-14">
        <aside className="top-10 flex h-fit w-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:h-[calc(100vh-5rem)] lg:w-64">
          <p className="text-sm font-semibold text-primary">Navigation</p>
          <nav className="mt-4 space-y-2 text-left">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() =>
              openConfirmDialog({
                title: "Sign out",
                body: "You will be logged out of the admin console.",
                confirmLabel: "Log out",
                tone: "danger",
                onConfirm: () => logout(),
              })
            }
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            <LogoutIcon />
            Log out
          </button>
        </aside>

        <div className="flex-1 space-y-8">
          <header className="sticky top-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                Corn Admin
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
                Operations cockpit
              </h1>
              <p className="text-sm text-slate-600">
                Manage catalog, orders, payments, and users without the demo clutter.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => void refreshAdminData()}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                disabled={refreshing || loadingMap["refresh"]}
              >
                <span className="inline-flex items-center gap-2">
                  {refreshing || loadingMap["refresh"] ? <Spinner /> : null}
                  {refreshing ? "Refreshing..." : "Refresh data"}
                </span>
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px]"
              >
                View storefront
              </Link>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {activeSection === "overview" && (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Revenue"
                  value={overview ? currency.format(overview.revenueLKR) : "—"}
                  hint="Total gross revenue"
                />
                <StatCard
                  label="Orders"
                  value={overview ? overview.totalOrders.toLocaleString() : "—"}
                  hint="All time orders"
                />
                <StatCard
                  label="Customers"
                  value={overview ? overview.totalUsers.toLocaleString() : "—"}
                  hint="Registered accounts"
                />
                <StatCard
                  label="Low stock"
                  value={overview ? overview.lowStock.length : 0}
                  hint="Under 5 units left"
                />
              </section>

              <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Growth
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {metricOptions.find((m) => m.id === growthMetric)?.label ?? "Metric"} trend
                    </h3>
                    <p className="text-sm text-slate-600">
                      {selectedTimeframe.label} · Total {growthSummary.total} · Peak {growthSummary.peak}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs font-semibold text-slate-500">Mode</label>
                    <select
                      value={growthMetric}
                      onChange={(e) => setGrowthMetric(e.target.value as typeof growthMetric)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-primary"
                    >
                      {metricOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label className="text-xs font-semibold text-slate-500">Time</label>
                    <select
                      value={growthWindow}
                      onChange={(e) => setGrowthWindow(e.target.value as typeof growthWindow)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-primary"
                    >
                      {timeframeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  {growthSeries.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                      No orders found for this window. Try a longer range.
                    </p>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4">
                      <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Peak: {growthSummary.peak}</span>
                        <span>Points: {growthSeries.length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeSection === "catalog" && (
            <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Catalog
                    </p>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Add new product
                    </h2>
                  </div>
                  <button
                    onClick={openAddProductModal}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px]"
                  >
                    Add product
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {visibleProducts.slice(0, 8).map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {product.images[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.sku} · LKR {product.priceLKR}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => openEditProductModal(product)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => promptDeactivateProduct(product)}
                          className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loadingMap[`delete-${product.id}`]}
                        >
                          {loadingMap[`delete-${product.id}`] ? <Spinner /> : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                  {visibleProducts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No products yet. Click “Add product” to start.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Categories
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Homepage categories
                    </h3>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr,auto]">
                  <input
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="New category name"
                  />
                  <button
                    onClick={() => void handleCreateCategory()}
                    className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loadingMap["category"]}
                  >
                    {loadingMap["category"] ? <Spinner /> : "+ Category"}
                  </button>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {rootCategories.map((cat) => (
                    <li
                      key={cat.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 font-semibold"
                    >
                      {cat.name}
                    </li>
                  ))}
                  {!rootCategories.length ? (
                    <p className="text-sm text-slate-500">No categories yet.</p>
                  ) : null}
                </ul>
              </div>
            </section>
          )}

          {activeSection === "inventory" && (
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    Inventory
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Live catalog ({visibleProducts.length})
                  </h3>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {visibleProducts.map((product) => {
                  const draft = productDrafts[product.id] || {
                    stock: String(product.stock),
                    priceLKR: String(product.priceLKR),
                    active: product.active,
                  };
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {product.images[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.sku} · Stock {product.stock}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Price
                          <input
                            type="number"
                            value={draft.priceLKR}
                            onChange={(e) =>
                              handleProductDraftChange(product.id, "priceLKR", e.target.value)
                            }
                            className="w-20 rounded-full border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary"
                          />
                        </label>
                        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Stock
                          <input
                            type="number"
                            value={draft.stock}
                            onChange={(e) =>
                              handleProductDraftChange(product.id, "stock", e.target.value)
                            }
                            className="w-16 rounded-full border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary"
                          />
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={draft.active}
                            onChange={(e) =>
                              handleProductDraftChange(product.id, "active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => void handleSaveProductRow(product)}
                          className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loadingMap[`save-${product.id}`]}
                        >
                          <span className="inline-flex items-center gap-2">
                            {loadingMap[`save-${product.id}`] ? <Spinner /> : null}
                            Save
                          </span>
                        </button>
                        <button
                          onClick={() => promptDeactivateProduct(product)}
                          className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loadingMap[`delete-${product.id}`]}
                        >
                          {loadingMap[`delete-${product.id}`] ? <Spinner /> : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {visibleProducts.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No products yet. Add your first SKU using the form in Catalog.
                  </p>
                ) : null}
              </div>
            </section>
          )}

          {activeSection === "orders" && (
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    Orders
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">Manage status</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  COD + PayHere
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {orders.slice(0, 8).map((order) => {
                  const transitions = statusTransitions[order.status] ?? [];
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{order.orderNo}</p>
                        <p className="text-xs text-slate-500">
                          {formatUserName(order.user || null)} · {currency.format(order.totalLKR)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Status {order.status} · Payment {order.paymentStatus}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            void handleStatusChange(order, e.target.value.toUpperCase())
                          }
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loadingMap[`order-${order.id}`]}
                        >
                          <option value={order.status}>{order.status}</option>
                          {transitions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {order.paymentStatus !== "PAID" && order.paymentMethod === "COD" ? (
                          <button
                            onClick={() => void handleMarkPaid(order)}
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={loadingMap[`mark-${order.id}`]}
                          >
                            <span className="inline-flex items-center gap-2">
                              {loadingMap[`mark-${order.id}`] ? <Spinner /> : null}
                              Mark paid
                            </span>
                          </button>
                        ) : null}
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No orders yet. They will appear here with status controls.
                  </p>
                ) : null}
              </div>
            </section>
          )}

          {activeSection === "signals" && (
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    Signals
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">What needs love</h3>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Low stock
                  </p>
                  {overview?.lowStock?.length ? (
                    <ul className="mt-2 space-y-2 text-sm">
                      {overview.lowStock.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                        >
                          <span>{item.name}</span>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            {item.stock} left
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">All SKUs are healthy.</p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Recent orders
                  </p>
                  {overview?.recentOrders?.length ? (
                    <ul className="mt-2 space-y-2 text-sm">
                      {overview.recentOrders.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                        >
                          <span>{item.orderNo}</span>
                          <span className="text-slate-600">
                            {currency.format(item.totalLKR)} · {item.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">Waiting for first order.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === "settings" && (
            <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      Payments & shipping
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">Store settings</h3>
                  </div>
                  <button
                    onClick={() =>
                      setSettingsDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              shippingZones: [
                                ...prev.shippingZones,
                                {
                                  id: `new-${Date.now()}`,
                                  name: "New zone",
                                  districts: [],
                                  rates: [
                                    {
                                      id: `rate-${Date.now()}`,
                                      label: "Standard",
                                      minSubtotalLKR: 0,
                                      priceLKR: 0,
                                    },
                                  ],
                                },
                              ],
                            }
                          : prev,
                      )
                    }
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
                  >
                    Add zone
                  </button>
                </div>

                {settingsDraft ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        Cash on Delivery enabled
                        <input
                          type="checkbox"
                          checked={settingsDraft.codEnabled}
                          onChange={(e) => handleSettingsChange("codEnabled", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        PayHere sandbox
                        <input
                          type="checkbox"
                          checked={settingsDraft.payhereSandbox}
                          onChange={(e) => handleSettingsChange("payhereSandbox", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                          PayHere merchant ID
                        </label>
                        <input
                          value={settingsDraft.payhereMerchantId}
                          onChange={(e) =>
                            handleSettingsChange("payhereMerchantId", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                          PayHere secret
                        </label>
                        <input
                          value={settingsDraft.payhereMerchantSecret}
                          onChange={(e) =>
                            handleSettingsChange("payhereMerchantSecret", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Shipping notes (visible to ops)
                      </label>
                      <textarea
                        value={settingsDraft.shippingNotes}
                        onChange={(e) => handleSettingsChange("shippingNotes", e.target.value)}
                        className="h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                      {settingsDraft.shippingZones.map((zone) => (
                        <div key={zone.id} className="space-y-3 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <input
                              value={zone.name}
                              onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                              className="w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-primary"
                            />
                            <input
                              value={zone.districts.join(", ")}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateZone(zone.id, {
                                  districts: e.target.value
                                    .split(",")
                                    .map((entry) => entry.trim())
                                    .filter(Boolean),
                                })
                              }
                              className="w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                              placeholder="Districts comma separated"
                            />
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {zone.rates.map((rate) => (
                              <div
                                key={rate.id}
                                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                              >
                                <input
                                  value={rate.label}
                                  onChange={(e) =>
                                    updateRate(zone.id, rate.id, "label", e.target.value)
                                  }
                                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                                  placeholder="Label"
                                />
                                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2">
                                    Min subtotal
                                    <input
                                      type="number"
                                      value={rate.minSubtotalLKR}
                                      onChange={(e) =>
                                        updateRate(
                                          zone.id,
                                          rate.id,
                                          "minSubtotalLKR",
                                          e.target.value,
                                        )
                                      }
                                      className="w-20 rounded-md border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary"
                                    />
                                  </label>
                                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2">
                                    Price
                                    <input
                                      type="number"
                                      value={rate.priceLKR}
                                      onChange={(e) =>
                                        updateRate(zone.id, rate.id, "priceLKR", e.target.value)
                                      }
                                      className="w-20 rounded-md border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary"
                                    />
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => void handleSaveSettings()}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={loadingMap["settings"]}
                      >
                        {loadingMap["settings"] ? <Spinner /> : null} Save settings
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Loading settings...</p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                      People & audit
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">Users</h3>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {users.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatUserName(item)}
                        </p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={item.role}
                          onChange={(e) =>
                            void handleUserUpdate(item, {
                              role: e.target.value as AdminUser["role"],
                            })
                          }
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loadingMap[`user-${item.id}`]}
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="STAFF">Staff</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <button
                          onClick={() =>
                            void handleUserUpdate(item, { suspended: !item.suspended })
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                            item.suspended
                              ? "border border-amber-200 bg-amber-50 text-amber-700"
                              : "border border-slate-200 bg-white text-slate-700"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                          disabled={loadingMap[`user-${item.id}`]}
                        >
                          {loadingMap[`user-${item.id}`] ? <Spinner /> : null}
                          {item.suspended ? "Suspended" : "Suspend"}
                        </button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Users will appear after registrations. You can still suspend or promote from
                      here.
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">Audit trail</h4>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
                      {audit.length} recent
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    {audit.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-slate-100 bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">
                            {entry.method} {entry.route}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {entry.action ?? "Change"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {entry.user?.email ?? "system"}
                        </p>
                      </div>
                    ))}
                    {!audit.length ? (
                      <p className="text-xs text-slate-500">No audit entries yet.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "users" && (
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    People
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">User management</h3>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {users.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatUserName(item)}
                      </p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={item.role}
                        onChange={(e) =>
                          void handleUserUpdate(item, {
                            role: e.target.value as AdminUser["role"],
                          })
                        }
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={loadingMap[`user-${item.id}`]}
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        onClick={() => void handleUserUpdate(item, { suspended: !item.suspended })}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                          item.suspended
                            ? "border border-amber-200 bg-amber-50 text-amber-700"
                            : "border border-slate-200 bg-white text-slate-700"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                        disabled={loadingMap[`user-${item.id}`]}
                      >
                        {loadingMap[`user-${item.id}`] ? <Spinner /> : null}
                        {item.suspended ? "Suspended" : "Suspend"}
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Users will appear after registrations. You can still suspend or promote from
                    here.
                  </p>
                ) : null}
              </div>
            </section>
          )}

          {activeSection === "audit" && (
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Audit trail</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {audit.length} recent
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                {audit.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>
                        {entry.method} {entry.route}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {entry.action ?? "Change"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {entry.user?.email ?? "system"}
                    </p>
                  </div>
                ))}
                {!audit.length ? (
                  <p className="text-xs text-slate-500">No audit entries yet.</p>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>

      {showProductModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Catalog
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingProduct ? "Edit product" : "Add new product"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    setImageUploads([]);
                  }}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Corn Watch Pro"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Model code(SKU)</label>
                <input
                  value={productForm.sku}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="CE-WR-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Price (LKR)</label>
                <input
                  type="number"
                  value={productForm.priceLKR}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, priceLKR: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="49900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Compare-at price (optional)
                </label>
                <input
                  type="number"
                  value={productForm.compareAtLKR}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, compareAtLKR: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="52900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  value={productForm.categoryIds[0] ?? ""}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      categoryIds: e.target.value ? [e.target.value] : [],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select a category</option>
                  {rootCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const uploads = files.map((file, idx) => ({
                      id: `${file.name}-${idx}-${Date.now()}`,
                      file,
                      url: URL.createObjectURL(file),
                      isPrimary: idx === 0,
                    }));
                    setImageUploads(uploads);
                  }}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
                <p className="text-xs text-slate-500">
                  Add multiple images from your device. They will be attached when you save.
                </p>
                {imageUploads.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {imageUploads.map((img) => (
                      <div
                        key={img.id}
                        className={`relative overflow-hidden rounded-xl border ${
                          img.isPrimary ? "border-primary" : "border-slate-200"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt="Preview"
                          className="h-20 w-full object-cover"
                        />
                        <button
                          className="absolute right-1 top-1 rounded-full bg-white/80 px-2 text-xs font-semibold text-red-600 shadow"
                          onClick={() => {
                            setImageUploads((prev) => {
                              const next = prev.filter((item) => item.id !== img.id);
                              if (!next.some((item) => item.isPrimary) && next[0]) {
                                next[0].isPrimary = true;
                              }
                              return [...next];
                            });
                          }}
                        >
                          ×
                        </button>
                        {!img.isPrimary ? (
                          <button
                            className="absolute left-1 bottom-1 rounded-full bg-white/85 px-2 text-[10px] font-semibold text-slate-700 shadow"
                            onClick={() => {
                              setImageUploads((prev) =>
                                prev.map((item) => ({
                                  ...item,
                                  isPrimary: item.id === img.id,
                                })),
                              );
                            }}
                          >
                            Make primary
                          </button>
                        ) : (
                          <span className="absolute left-1 bottom-1 rounded-full bg-primary px-2 text-[10px] font-semibold text-white shadow">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="Short blurb that appears on PDP."
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setImageUploads([]);
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreateOrUpdateProduct()}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loadingMap["product-submit"]}
              >
                {loadingMap["product-submit"] ? <Spinner /> : null}
                {editingProduct ? "Save changes" : "Publish product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {confirmDialog?.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Confirm
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {confirmDialog.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{confirmDialog.body}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeConfirmDialog}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                disabled={confirmLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => void runConfirmDialog()}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition disabled:cursor-not-allowed disabled:opacity-70 ${
                  confirmDialog.tone === "danger"
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                    : "bg-slate-900 hover:-translate-y-[1px]"
                }`}
                disabled={confirmLoading}
              >
                {confirmLoading ? <Spinner /> : null}
                {confirmDialog.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{hint}</p>
    </article>
  );
}
