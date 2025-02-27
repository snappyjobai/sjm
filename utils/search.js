import { docManifest } from "./docManifest";

const searchIndex = [];

// Build search index from documentation
function buildSearchIndex() {
  function traverse(obj, parentPath = "") {
    for (const key in obj) {
      if (obj[key].path && obj[key].title) {
        searchIndex.push({
          id: obj[key].path,
          title: obj[key].title,
          path: `/docs/${obj[key].path}`,
          keywords: `${obj[key].title} ${
            obj[key].description || ""
          } ${parentPath}`.toLowerCase(),
        });
      } else if (typeof obj[key] === "object") {
        traverse(obj[key], key);
      }
    }
  }

  traverse(docManifest);
}

buildSearchIndex();

export function searchDocs(query) {
  if (!query) return [];

  const searchTerms = query.toLowerCase().split(" ");

  return searchIndex
    .filter((item) => {
      return searchTerms.every((term) => item.keywords.includes(term));
    })
    .map(({ id, title, path }) => ({
      id,
      title,
      path,
      type: path.split("/")[2] || "general",
    }))
    .sort((a, b) => a.title.length - b.title.length)
    .slice(0, 10);
}
