"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "@/lib/api";
import { whCard, whPageHeader, whPrimaryBtn, whSubtitle, whTitle } from "@/lib/warehouse-ui";
import type { RootState } from "@/store";
import { setWarehouse } from "@/store/slices/authSlice";

export default function WarehouseProfilePage() {
  const dispatch = useDispatch();
  const warehouse = useSelector((state: RootState) => state.auth.warehouse);
  const [isLoading, setIsLoading] = useState(!warehouse);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.CURRENT_USER, { withCredentials: true });
        if (!mounted || !res.data?.success || !res.data.warehouse) return;
        dispatch(setWarehouse(res.data.warehouse));
      } catch {
        toast.error("Could not load profile");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (isLoading && !warehouse) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-shop-accent border-t-transparent" />
          <p className="text-sm font-medium text-shop-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className={`${whCard} p-6 text-sm text-shop-muted`}>Profile could not be loaded.</div>
    );
  }

  const address = warehouse.address;
  const location = warehouse.location || address?.location;
  const fullAddress = address?.formatted || address?.line1 || "No address on file";

  return (
    <div className="space-y-6 pb-10">
      <div className={`${whPageHeader} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`}>
        <div>
          <h1 className={whTitle}>Hub profile</h1>
          <p className={whSubtitle}>Contact, email, and location for this warehouse.</p>
        </div>
        <Link href="/profile/edit" className={`${whPrimaryBtn} shrink-0`}>
          Edit profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className={`${whCard} p-6 sm:p-7`}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-lg font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
              {warehouse.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold tracking-tight">{warehouse.name}</p>
              <p className="text-sm text-shop-muted">{warehouse.isActive === false ? "Inactive" : "Active warehouse"}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label="Email" value={warehouse.email || "—"} />
            <Info label="Contact number" value={warehouse.contactNumber || "—"} />
          </dl>
        </section>

        <section className={`${whCard} p-6 sm:p-7`}>
          <h2 className="text-base font-semibold">Warehouse location</h2>
          <p className="mt-3 text-sm leading-6 text-foreground">{fullAddress}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <Info label="City" value={address?.city || "—"} />
            <Info label="State" value={address?.state || "—"} />
            <Info label="Pincode" value={address?.pincode || "—"} />
            <Info label="Landmark" value={address?.landmark || "—"} />
          </dl>
          {location?.lat !== undefined && location?.lng !== undefined ? (
            <p className="mt-5 rounded-xl bg-shop-surface px-3 py-2 text-xs font-medium text-shop-muted">
              Lat {Number(location.lat).toFixed(6)}, Lng {Number(location.lng).toFixed(6)}
            </p>
          ) : (
            <p className="mt-5 text-xs text-shop-muted">Map coordinates are not set yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.12em] text-shop-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
