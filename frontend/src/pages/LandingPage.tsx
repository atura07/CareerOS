import { HeroSection } from '../components/hero/HeroSection'
import { TrustedCompanies } from '../components/trusted/TrustedCompanies'
import { Features } from '../components/features/Features'
import { DashboardPreview } from '../components/dashboard/DashboardPreview'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <Features />
      <DashboardPreview />
    </>
  )
}

