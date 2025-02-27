import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import DocsLayout from "../../components/docs/DocsLayout";
import MDXComponents from "../../components/docs/MDXComponents";
import fs from "fs";
import path from "path";
import { getAllDocPaths } from "../../utils/docManifest";

export default function DocPage({ mdxSource }) {
  return (
    <DocsLayout>
      <div className="prose prose-invert max-w-none">
        <MDXRemote {...mdxSource} components={MDXComponents} />
      </div>
    </DocsLayout>
  );
}

export async function getStaticPaths() {
  const paths = getAllDocPaths();
  console.log("Available documentation paths:", paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  try {
    const slug = params?.slug?.join("/");
    const fullPath = path.join(process.cwd(), "data", "docs", `${slug}.mdx`);

    // Add debug logging
    console.log({
      requestedSlug: slug,
      fullPath,
      fileExists: fs.existsSync(fullPath),
      availableFiles: fs.readdirSync(
        path.join(process.cwd(), "data", "docs", "sdk")
      ),
    });

    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return { notFound: true };
    }

    const fileContent = fs.readFileSync(fullPath, "utf8");
    const mdxSource = await serialize(fileContent, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });

    return {
      props: {
        mdxSource,
        slug,
      },
    };
  } catch (error) {
    console.error(`Error loading doc: ${error}`);
    return { notFound: true };
  }
}
