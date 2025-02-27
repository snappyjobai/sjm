import { FiExternalLink } from "react-icons/fi";
import CodeHighlight from "./CodeHighlight";
import FuturisticCard from "./FuturisticCard";

export default function FeaturedExample({
  title,
  description,
  code,
  language = "javascript",
  demoUrl,
}) {
  return (
    <FuturisticCard>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:text-accent-light"
            >
              <span>Live Demo</span>
              <FiExternalLink />
            </a>
          )}
        </div>

        <div className="relative">
          <CodeHighlight code={code} language={language} />
        </div>
      </div>
    </FuturisticCard>
  );
}
