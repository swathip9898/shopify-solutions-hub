import { Solution, ContributorStats } from '@/types';

export function getContributorRankings(solutions: Solution[]): ContributorStats[] {
  const map = new Map<
    string,
    {
      name: string;
      email?: string;
      count: number;
      categories: { [cat: string]: number };
      brands: Set<string>;
      latestDate: string;
    }
  >();

  solutions.forEach((sol) => {
    const rawName = sol.authorName?.trim();
    if (!rawName) return;

    const key = rawName.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        name: rawName,
        email: sol.authorEmail?.trim() || undefined,
        count: 0,
        categories: {},
        brands: new Set<string>(),
        latestDate: sol.createdAt || new Date().toISOString().split('T')[0],
      });
    }

    const entry = map.get(key)!;
    entry.count += 1;
    if (sol.authorEmail?.trim() && !entry.email) {
      entry.email = sol.authorEmail.trim();
    }
    if (sol.category) {
      entry.categories[sol.category] = (entry.categories[sol.category] || 0) + 1;
    }
    if (sol.brandName) {
      entry.brands.add(sol.brandName);
    }
    if (sol.createdAt && new Date(sol.createdAt).getTime() > new Date(entry.latestDate).getTime()) {
      entry.latestDate = sol.createdAt;
    }
  });

  const sorted = Array.from(map.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
  });

  return sorted.map((entry, index) => {
    const rank = index + 1;
    let topCategory = 'Full-Stack';
    let maxCatCount = 0;
    Object.entries(entry.categories).forEach(([cat, c]) => {
      if (c > maxCatCount) {
        maxCatCount = c;
        topCategory = cat;
      }
    });

    let badge = 'Code Contributor';
    if (rank === 1) {
      badge = 'MVP Grand Architect';
    } else if (rank === 2) {
      badge = 'Master Builder';
    } else if (rank === 3) {
      badge = 'Lead Innovator';
    } else if (entry.count >= 5) {
      badge = 'Principal Engineer';
    } else if (entry.count >= 3) {
      badge = 'Senior Contributor';
    } else if (entry.brands.size >= 3) {
      badge = 'Multi-Brand Specialist';
    }

    return {
      name: entry.name,
      email: entry.email,
      solutionsCount: entry.count,
      rank,
      badge,
      topCategory,
      brandsHelpedCount: entry.brands.size,
      brandsHelped: Array.from(entry.brands),
      recentSolutionDate: entry.latestDate,
    };
  });
}
