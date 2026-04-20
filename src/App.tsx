import { useState } from "react";
import { getStartDate } from "./services/storage";
import { OnboardingModal } from "./features/onboarding/components/OnboardingModal";
import { DashboardPage } from "./pages/DashboardPage";
import { OfflineBanner } from "./components/common/OfflineBanner";
import { UpdatePrompt } from "./components/common/UpdatePrompt";
import { InstallBanner } from "./components/common/InstallBanner";

export function App() {
  const [startDate, setStartDate] = useState<string | null>(() => getStartDate());

  function handleOnboardingComplete() {
    setStartDate(getStartDate());
  }

  return (
    <>
      <OfflineBanner />
      {startDate ? (
        <DashboardPage startDate={startDate} />
      ) : (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      <UpdatePrompt />
      <InstallBanner />
    </>
  );
}
