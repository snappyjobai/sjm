import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DocsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Simple redirect to introduction
    router.push("/docs/introduction");
  }, [router]);

  return null;
}
