import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { FiPlay, FiSave, FiCopy, FiRefreshCw } from "react-icons/fi";

export default function SJMAPIPlayground() {
  // Add endpoint selection
  const [selectedEndpoint, setSelectedEndpoint] = useState("match");

  // Memoize endpoint templates to avoid unnecessary re-renders
  const endpointTemplates = useMemo(
    () => ({
      match: {
        description: "Web development project using React and Node.js",
        required_skills: ["React.js", "Node.js", "TypeScript"],
        budget_range: [3000, 8000],
        complexity: "medium",
        timeline: 30,
      },
      "verify-skill": {
        keyword: "JavaScript",
      },
      interview: {
        freelancer_id: "f90",
        project_description:
          "Building a web application with React and Node.js",
        required_skills: ["React.js", "Node.js"],
        job_title: "Full Stack Developer",
        mode: "ai_questions",
      },
      health: {},
    }),
    [] // Empty dependency array ensures it's only created once
  );

  // State for parameter JSON
  const [paramJson, setParamJson] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update param JSON when endpoint changes
  useEffect(() => {
    const savedParams = localStorage.getItem(`sjm_${selectedEndpoint}_params`);
    if (savedParams) {
      setParamJson(savedParams);
    } else {
      setParamJson(
        JSON.stringify(endpointTemplates[selectedEndpoint], null, 2)
      );
    }
  }, [endpointTemplates, selectedEndpoint]);

  // Save parameters to localStorage
  const handleSave = () => {
    try {
      // Validate JSON before saving
      JSON.parse(paramJson);
      localStorage.setItem(`sjm_${selectedEndpoint}_params`, paramJson);
      setError(null);
      alert("Parameters saved!");
    } catch (e) {
      setError("Invalid JSON: " + e.message);
    }
  };

  // Copy parameters to clipboard
  const handleCopyParams = () => {
    navigator.clipboard.writeText(paramJson);
    alert("Parameters copied to clipboard!");
  };

  // Copy API response to clipboard
  const handleCopyResponse = () => {
    const responseString = JSON.stringify(response, null, 2);
    navigator.clipboard.writeText(responseString);
    alert("Response copied to clipboard!");
  };

  // Handle API call
  const handleTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse parameters from JSON
      const params = JSON.parse(paramJson);

      // Determine method based on endpoint
      const method = selectedEndpoint === "health" ? "GET" : "POST";

      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: selectedEndpoint,
          method,
          params,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError("Invalid JSON parameters: " + error.message);
      } else {
        setError("Request failed: " + error.message);
        setResponse({ error: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-accent/20 rounded-lg overflow-hidden">
      <div className="bg-accent/10 p-4 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-medium text-white">SJM API Playground</h3>

        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="px-3 py-2 bg-black/30 text-white rounded-lg border border-accent/20"
          >
            <option value="match">Match Freelancers</option>
            <option value="verify-skill">Verify Skill</option>
            <option value="interview">Conduct Interview</option>
            <option value="health">System Health</option>
          </select>

          <button
            onClick={handleTest}
            disabled={isLoading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
            Test API
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Save
          </button>

          <button
            onClick={handleCopyParams}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2"
          >
            <FiCopy className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-accent/20">
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-4">
            {selectedEndpoint} Parameters
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <textarea
            value={paramJson}
            onChange={(e) => setParamJson(e.target.value)}
            className="w-full h-80 font-mono text-sm bg-black/30 border border-accent/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
            spellCheck="false"
          />
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-4">Response</h4>

          {isLoading ? (
            <div className="flex items-center justify-center h-80">
              <motion.div
                className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : response ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto h-80 font-mono text-sm text-gray-300">
                {JSON.stringify(response, null, 2)}
              </pre>

              <button
                onClick={handleCopyResponse}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded hover:bg-black/70"
                title="Copy response"
              >
                <FiCopy className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              Run the API test to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
