import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const docsDirectory = path.join(process.cwd(), "data", "docs");

// Add this debug function
function debugDocsDirectory() {
  console.log("Docs directory:", docsDirectory);
  console.log("Directory exists:", fs.existsSync(docsDirectory));

  // List all files in the docs directory
  function listFiles(dir, indent = "") {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      console.log(
        `${indent}${item} ${stats.isDirectory() ? "(dir)" : "(file)"}`
      );
      if (stats.isDirectory()) {
        listFiles(fullPath, indent + "  ");
      }
    });
  }

  try {
    console.log("Directory contents:");
    listFiles(docsDirectory);
  } catch (error) {
    console.error("Error listing directory:", error);
  }
}

export async function getAllDocs() {
  const docs = [];

  // Recursive function to get all .mdx files
  const getFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        getFiles(filePath);
      } else if (path.extname(file) === ".mdx") {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        const slug = filePath
          .replace(docsDirectory, "")
          .replace(/\.mdx$/, "")
          .split("/")
          .filter(Boolean);

        docs.push({
          ...data,
          slug: slug.join("/"),
          breadcrumbs: slug,
        });
      }
    });
  };

  getFiles(docsDirectory);
  return docs;
}

export async function getDocBySlug(slug) {
  debugDocsDirectory(); // Add this line
  try {
    const realSlug = slug.replace(/\.mdx$/, "");
    let filePath = path.join(docsDirectory, `${realSlug}.mdx`);

    console.log("Attempting to load:", filePath);
    console.log("File exists:", fs.existsSync(filePath));

    // Try nested path if direct path doesn't exist
    if (!fs.existsSync(filePath)) {
      const parts = realSlug.split("/");
      filePath = path.join(docsDirectory, ...parts) + ".mdx";
      console.log("Trying nested path:", filePath);
      console.log("Nested file exists:", fs.existsSync(filePath));
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Doc not found: ${slug} (tried ${filePath})`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
      scope: data,
    });

    return {
      content: mdxSource,
      frontmatter: data,
      slug: realSlug,
    };
  } catch (error) {
    console.error(`Error in getDocBySlug for ${slug}:`, error);
    throw error;
  }
}

export function searchDocs(query, docs) {
  if (!query) return [];

  const searchTerm = query.toLowerCase();
  return docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.description?.toLowerCase().includes(searchTerm)
  );
}

export async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walkDir(res) : res;
    })
  );
  return files.flat().filter((file) => file.endsWith(".mdx"));
}
