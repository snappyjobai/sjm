export const docManifest = {
  // Core docs
  introduction: {
    title: "Introduction",
    path: "introduction",
  },
  installation: {
    title: "Installation",
    path: "installation",
  },
  quickstart: {
    title: "Quick Start",
    path: "quickstart",
  },

  // Features Documentation
  features: {
    aiMatching: {
      title: "AI Matching",
      path: "features/ai-matching",
    },
    skillsAnalysis: {
      title: "Skills Analysis",
      path: "features/skills-analysis",
    },
    realTime: {
      title: "Real-time Processing",
      path: "features/real-time",
    },
    interview: {
      title: "Interview System",
      path: "features/interview",
    },
  },

  // SDK Documentation
  sdk: {
    nodejs: {
      title: "Node.js SDK",
      path: "sdk/nodejs",
    },
    python: {
      title: "Python SDK",
      path: "sdk/python",
    },
    rest: {
      title: "REST API",
      path: "sdk/rest",
    },
  },

  // Core Classes
  core: {
    classes: {
      title: "Core Classes",
      path: "core/classes",
    },
  },
};

export function getAllDocPaths() {
  const paths = [];

  function traverse(obj) {
    for (const key in obj) {
      if (obj[key].path) {
        const slugs = obj[key].path.split("/");
        console.log("Processing path:", obj[key].path);
        paths.push({ params: { slug: slugs } });
      } else if (typeof obj[key] === "object") {
        traverse(obj[key]);
      }
    }
  }

  traverse(docManifest);
  console.log("Generated paths:", paths);
  return paths;
}

export function getAllRoutes() {
  const routes = [];

  function traverse(obj) {
    for (const key in obj) {
      if (obj[key].path) {
        routes.push(obj[key].path);
      } else if (typeof obj[key] === "object") {
        traverse(obj[key]);
      }
    }
  }

  traverse(docManifest);
  return routes;
}
