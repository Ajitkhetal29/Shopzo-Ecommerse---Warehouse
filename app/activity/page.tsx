"use client";

import HubFulfillmentList from "../orders/HubFulfillmentList";

export default function ActivityPage() {
  return (
    <HubFulfillmentList
      scope="history"
      title="Order history"
      subtitle="Delivered and cancelled fulfillments"
    />
  );
}
