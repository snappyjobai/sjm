import { docManifest } from "./docManifest";

export const docsNav = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    title: "SDK Reference",
    items: Object.values(docManifest.sdk).map((sdk) => ({
      title: sdk.title,
      href: `/docs/${sdk.path}`, // This ensures we use the correct path from manifest
    })),
  },
  {
    title: "API Reference",
    items: Object.values(docManifest.api).map((api) => ({
      title: api.title,
      href: `/docs/${api.path}`,
    })),
  },
  {
    title: "Features",
    items: Object.values(docManifest.features).map((feature) => ({
      title: feature.title,
      href: `/docs/${feature.path}`,
    })),
  },
  {
    title: "Core Reference",
    items: Object.values(docManifest.core).map((item) => ({
      title: item.title,
      href: `/docs/${item.path}`,
    })),
  },
  {
    title: "Interview",
    items: Object.values(docManifest.interview).map((interview) => ({
      title: interview.title,
      href: `/docs/${interview.path}`,
    })),
  },
];
