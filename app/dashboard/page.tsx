"use client";

import Link from "next/link";
import { whCard, whPageHeader, whSubtitle, whTitle } from "@/lib/warehouse-ui";

const STATS = [
  { name: "Transfer Requests", value: "0", icon: "🔁", href: "/transfer-requests", iconWrap: "bg-sky-100 dark:bg-sky-500/20" },
  { name: "Inventory SKUs", value: "0", icon: "📦", href: "/inventory", iconWrap: "bg-emerald-100 dark:bg-emerald-500/20" },
  { name: "Open Orders", value: "0", icon: "🧾", href: "/orders", iconWrap: "bg-amber-100 dark:bg-amber-500/20" },
  { name: "Activity Logs", value: "0", icon: "📝", href: "/activity", iconWrap: "bg-violet-100 dark:bg-violet-500/20" },
];

const QUICK_ACTIONS = [
  { name: "Transfer Requests", href: "/transfer-requests", icon: "🔁" },
  { name: "Inventory", href: "/inventory", icon: "📦" },
  { name: "Transfer Issues", href: "/transfer-issues", icon: "⚠️" },
  { name: "Orders", href: "/orders", icon: "🧾" },
  { name: "Activity", href: "/activity", icon: "📝" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <div className={whPageHeader}>
        <h1 className={whTitle}>Warehouse dashboard</h1>
        <p className={whSubtitle}>Manage transfer requests, inventory movement, and fulfillment operations.</p>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-shop-muted">Key metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
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

      <div className={`${whCard} p-5 sm:p-6`}>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent activity</h2>
        <p className="mb-4 mt-1 text-sm text-shop-muted">Latest warehouse operations</p>
        <div className="rounded-xl border border-dashed border-shop-border py-14 text-center">
          <p className="text-sm font-medium text-shop-muted">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
