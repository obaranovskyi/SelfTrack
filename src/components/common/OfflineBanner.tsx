import { useNetworkStatus } from "../../hooks/useNetworkStatus";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="w-full bg-yellow-500 text-yellow-950 text-sm text-center py-2 px-4">
      You are offline. Data is saved locally.
    </div>
  );
}
