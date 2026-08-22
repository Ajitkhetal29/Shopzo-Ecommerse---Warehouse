"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_ENDPOINTS } from "@/lib/api";
import { whCard, whPageHeader, whSubtitle, whTitle } from "@/lib/warehouse-ui";
import { RootState } from "@/store";

type DashboardStats = {
  openCount?: number;
  inventorySkus?: number;
  pendingTransfers?: number;
  openIssues?: number;
};

const QUICK_ACTIONS = [
  { name: "Transfer Requests", href: "/transfer-requests", icon: "🔁" },
  { name: "Inventory", href: "/inventory", icon: "📦" },
  { name: "Transfer Issues", href: "/transfer-issues", icon: "⚠️" },
  { name: "Orders", href: "/orders", icon: "🧾" },
  { name: "Activity", href: "/activity", icon: "📝" },
];

export default function DashboardPage() {
  const warehouse = useSelector((state: RootState) => state.auth.warehouse);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!warehouse?._id) return;
    let cancelled = false;
    axios
      .get(API_ENDPOINTS.GET_FULFILLMENT_STATS, { withCredentials: true })
      .then((res) => {
        if (!cancelled && res.data?.success) setStats(res.data.data || {});
      })
      .catch(() => {
        if (!cancelled) setStats({});
      });
    return () => {
      cancelled = true;
    };
  }, [warehouse?._id]);

  const cards = [
    {
      name: "Transfer Requests",
      value: String(stats?.pendingTransfers ?? "—"),
      icon: "🔁",
      href: "/transfer-requests",
      iconWrap: "bg-sky-100 dark:bg-sky-500/20",
    },
    {
      name: "Inventory SKUs",
      value: String(stats?.inventorySkus ?? "—"),
      icon: "📦",
      href: "/inventory",
      iconWrap: "bg-emerald-100 dark:bg-emerald-500/20",
    },
    {
      name: "Open Orders",
      value: String(stats?.openCount ?? "—"),
      icon: "🧾",
      href: "/orders",
      iconWrap: "bg-amber-100 dark:bg-amber-500/20",
    },
    {
      name: "Open Issues",
      value: String(stats?.openIssues ?? "—"),
      icon: "📝",
      href: "/transfer-issues",
      iconWrap: "bg-violet-100 dark:bg-violet-500/20",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      <div className={whPageHeader}>
        <h1 className={whTitle}>Warehouse dashboard</h1>
        <p className={whSubtitle}>Manage transfer requests, inventory movement, and fulfillment operations.</p>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-shop-muted">Key metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className={`${whCard} p-5 transition hover:-translate-y-0.5 hover:border-shop-accent/35 hover:shadow-md`}
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.iconWrap} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg`}>
                  <span aria-hidden>{stat.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-shop-muted">{stat.name}</p>
                  <p className="mt-1 text-[2rem] font-semibold tabular-nums leading-none tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={`${whCard} p-5 sm:p-6`}>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick actions</h2>
        <p className="mb-4 mt-1 text-sm text-shop-muted">Common warehouse workflows</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex min-h-[3.25rem] items-center rounded-xl border border-shop-border px-3 py-3 transition hover:border-shop-accent/40 hover:bg-shop-accent/5 sm:px-4"
            >
              <span className="mr-3 text-xl" aria-hidden>
                {action.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
