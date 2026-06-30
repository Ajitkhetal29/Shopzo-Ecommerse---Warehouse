"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { sellableAvailable } from "@/lib/inventoryDisplay";

type InventoryRow = {
  _id: string;
  quantity: number;
  available: number;
  reserved?: number;
  missingHold?: number;
  damagedQty?: number;
  extraHold?: number;
  variant?: {
    name?: string;
    sku?: string;
  };
  warehouse?: {
    name?: string;
  };
};

export default function InventoryPage() {
  const warehouse = useSelector((state: RootState) => state.auth.warehouse);
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInventory = async () => {
      try {
        setLoading(true);

        let warehouseId = warehouse?._id;
        if (!warehouseId) {
          const meRes = await axios.get(API_ENDPOINTS.CURRENT_USER, {
            withCredentials: true,
          });
          warehouseId = meRes.data?.warehouse?._id;
        }

        if (!warehouseId) {
          setError("Warehouse mapping not found for current user");
          setRows([]);
          return;
        }

        const res = await axios.get(API_ENDPOINTS.GET_INVENTORY, {
          params: {
            warehouseId,
          },
          withCredentials: true,
        });
        if (!isMounted) return;
        setRows(res.data?.inventory ?? []);
      } catch (loadError) {
        if (!isMounted) return;
        if (axios.isAxiosError(loadError)) {
          setError(loadError.response?.data?.message || "Failed to load inventory");
        } else {
          setError("Failed to load inventory");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInventory();
    return () => {
      isMounted = false;
    };
  }, [warehouse?._id]);

  if (loading && rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-medium text-shop-muted">Loading inventory...</p>
      </div>
    );
  }

  if (error && rows.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Inventory</h1>
        <p className="mt-1 text-sm text-shop-muted">
          Available = sellable · Damaged / extra hold are not sellable until resolved
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {rows.length === 0 && !loading ? (
        <div className="rounded-2xl border border-shop-border bg-shop-surface-raised p-12 text-center">
          <h3 className="text-sm font-medium text-foreground">No inventory</h3>
          <p className="mt-1 text-sm text-shop-muted">Nothing on this page.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-shop-border bg-shop-surface-raised">
          <table className="min-w-full divide-y divide-shop-border text-sm">
            <thead className="bg-shop-surface">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Variant
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Available
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Reserved
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Missing
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Damaged
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Extra hold
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-shop-muted">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shop-border">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-shop-surface">
                  <td className="px-4 py-3 font-mono text-foreground">{row.variant?.sku || "-"}</td>
                  <td className="px-4 py-3 text-foreground">{row.variant?.name || "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">
                    {sellableAvailable(row)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-shop-muted">{row.reserved || 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-amber-700 dark:text-amber-400">
                    {row.missingHold ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-orange-700 dark:text-orange-400">
                    {row.damagedQty ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-violet-700 dark:text-violet-400">
                    {row.extraHold ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.quantity || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
