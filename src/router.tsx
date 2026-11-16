import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dashboard } from '@/pages/Dashboard'
import { CreativeStudio } from '@/pages/CreativeStudio'
import { Projects } from '@/pages/Projects'
import { GenerationHistory } from '@/pages/GenerationHistory'
import { AIAgents } from '@/pages/AIAgents'
import { ModelLibrary } from '@/pages/ModelLibrary'
import { ProviderConnections } from '@/pages/ProviderConnections'
import { UsageCosts } from '@/pages/UsageCosts'
import { Settings } from '@/pages/Settings'
import { Documentation } from '@/pages/Documentation'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsAndConditions } from '@/pages/TermsAndConditions'
import { AcceptableUse } from '@/pages/AcceptableUse'
import { CopyrightTakedown } from '@/pages/CopyrightTakedown'
import { CookiePolicy } from '@/pages/CookiePolicy'
import { Disclaimer } from '@/pages/Disclaimer'
import { ContactSupport } from '@/pages/ContactSupport'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'studio', element: <CreativeStudio /> },
      { path: 'projects', element: <Projects /> },
      { path: 'history', element: <GenerationHistory /> },
      { path: 'agents', element: <AIAgents /> },
      { path: 'models', element: <ModelLibrary /> },
      { path: 'providers', element: <ProviderConnections /> },
      { path: 'usage', element: <UsageCosts /> },
      { path: 'settings', element: <Settings /> },
      { path: 'docs', element: <Documentation /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsAndConditions /> },
      { path: 'acceptable-use', element: <AcceptableUse /> },
      { path: 'copyright', element: <CopyrightTakedown /> },
      { path: 'cookies', element: <CookiePolicy /> },
      { path: 'disclaimer', element: <Disclaimer /> },
      { path: 'contact', element: <ContactSupport /> },
    ],
  },
])