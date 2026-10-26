export interface Brand {
  id: string;
  name: string;
  shopifyDomain: string;
  liveUrl?: string;
  theme: string;
  leadDeveloper: string;
  accountManager?: string;
  notes?: string;
  status: 'Active' | 'Maintenance' | 'Onboarding';
}

export type SolutionCategory =
  | 'Theme / Liquid'
  | 'Checkout UI Extension'
  | 'Shopify Functions'
  | 'Custom App (Remix/Node)'
  | 'Shopify Flow & Webhook'
  | 'Metafields & Custom Data'
  | '3rd-Party Integration'
  | 'Performance & CRO';

export type SolutionDifficulty =
  | 'Quick (< 2 hrs)'
  | 'Medium (1-2 days)'
  | 'Complex (1+ week)';

export interface Solution {
  id: string;
  brandName: string;
  title: string;
  category: SolutionCategory;
  themeUsed: string;
  problem: string;
  implementation: string;
  codeSnippet?: string;
  repoLink?: string;
  documentationLink?: string;
  tags: string[];
  authorName: string;
  authorEmail?: string;
  difficulty: SolutionDifficulty;
  createdAt: string;
}

export interface SheetConfigStatus {
  isConfigured: boolean;
  sheetId?: string;
  serviceAccountEmail?: string;
  error?: string;
}
