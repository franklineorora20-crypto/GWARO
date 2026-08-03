import type { AdminOrder } from "../lib/adminOrders";
import type { OrderStatus } from "../types";

export interface AdminKpis {
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  revenueToday: number;
  revenueThisMonth: number;
}

function isSameLocalDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);

  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function isSameLocalMonth(
  iso: string,
  ref: Date
): boolean {

  const d = new Date(iso);

  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth()
  );
}

function isPaid(order: AdminOrder): boolean {

  return order.paymentStatus === "Paid via M-Pesa";

}

const PENDING_STATUSES: OrderStatus[] = [

  "Order Received",

  "Pickup Scheduled",

];

export function computeAdminKpis(
  orders: AdminOrder[],
  now = new Date()
): AdminKpis {

  let ordersToday = 0;

  let pendingOrders = 0;

  let activeOrders = 0;

  let completedOrders = 0;

  let revenueToday = 0;

  let revenueThisMonth = 0;

  for (const order of orders) {

    if (isSameLocalDay(order.rawCreatedAt, now)) {

      ordersToday++;

    }

    if (PENDING_STATUSES.includes(order.status)) {

      pendingOrders++;

    }

    if (
      order.status === "Delivered" ||
      order.status === "Completed"
    ) {

      completedOrders++;

    } else {

      activeOrders++;

    }

    if (
      isPaid(order) &&
      isSameLocalDay(order.rawCreatedAt, now)
    ) {

      revenueToday += order.totalPrice;

    }

    if (
      isPaid(order) &&
      isSameLocalMonth(order.rawCreatedAt, now)
    ) {

      revenueThisMonth += order.totalPrice;

    }

  }

  return {

    totalOrders: orders.length,

    ordersToday,

    pendingOrders,

    activeOrders,

    completedOrders,

    revenueToday,

    revenueThisMonth,

  };

}

export function exportOrdersToCsv(
  orders: AdminOrder[],
  filename?: string
): void {

  const headers = [

    "Tracking ID",

    "Customer",

    "Phone",

    "Branch",

    "Address",

    "Status",

    "Payment",

    "Receipt",

    "Amount",

    "Checkout ID",

    "Merchant ID",

    "Total",

    "Created",

  ];

  const rows = orders.map((o) => [

    o.trackingId ?? o.id,

    o.customerName,

    o.phone,

    o.branch,

    o.address,

    o.status,

    o.paymentStatus,

    o.mpesaReceiptNumber ?? "",

    o.mpesaAmount ?? "",

    o.checkoutRequestId ?? "",

    o.merchantRequestId ?? "",

    o.totalPrice,

    o.rawCreatedAt,

  ]);

  const csv = [

    headers.join(","),

    ...rows.map((r) =>

      r.map((v) => `"${String(v ?? "")}"`).join(",")

    ),

  ].join("\n");

  const blob = new Blob([csv], {

    type: "text/csv;charset=utf-8;",

  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    filename ??
    `orders-${new Date().toISOString().slice(0,10)}.csv`;

  link.click();

  URL.revokeObjectURL(url);

}