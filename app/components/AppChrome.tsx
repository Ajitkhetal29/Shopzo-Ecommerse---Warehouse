"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_ENDPOINTS } from "@/lib/api";
import type { RootState } from "@/store";
import { logout, setWarehouse } from "@/store/slices/authSlice";
import { WAREHOUSE_MENU_ITEMS } from "@/lib/menuHelper";
import AppShell from "./AppShell";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const warehouse = useSelector((s: RootState) => s.auth.warehouse);

  const isLogin = pathname === "/login";
  const [isVerifying, setIsVerifying] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) {
      setIsVerifying(false);
      return;
    }

    if (warehouse) {
      setIsVerifying(false);
      return;
    }

    let mounted = true;
    setIsVerifying(true);

    (async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CURRENT_USER, { withCredentials: true });
        if (!mounted) return;
        if (res.data?.success && res.data.warehouse) {
          dispatch(
            setWarehouse({
              _id: res.data.warehouse._id,
              name: res.data.warehouse.name,
              email: res.data.warehouse.email,
              contactNumber: res.data.warehouse.contactNumber,
              address: res.data.warehouse.address,
              isActive: res.data.warehouse.isActive,
            }),
          );
        } else {
          router.push("/login");
        }
      } catch {
        if (mounted) router.push("/login");
      } finally {
        if (mounted) setIsVerifying(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch, isLogin, router, warehouse]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
    } catch {
      /* ignore */
    }
    dispatch(logout());
    router.push("/login");
  }, [dispatch, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (isVerifying || !warehouse) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-shop-surface">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-shop-accent border-t-transparent" />
          <p className="text-sm font-medium text-shop-muted">Loading workspace…</p>
        </div>
      </div>
    );
  }

  const brandHref =
    WAREHOUSE_MENU_ITEMS.find((m) => m.label.toLowerCase() === "dashboard")?.href ?? "/dashboard";

  return (
    <AppShell menuItems={WAREHOUSE_MENU_ITEMS} warehouse={warehouse} brandHref={brandHref} onLogout={handleLogout}>
      {children}
    </AppShell>
  );
}
