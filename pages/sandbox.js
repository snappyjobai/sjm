import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiSend,
  FiCopy,
  FiBook,
  FiChevronDown,
  FiExternalLink,
  FiPlay,
} from "react-icons/fi";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import SectionHeading from "../components/SectionHeading";
import InFooter from "../components/inFooter";

// API Sandbox Page Component
const SandboxPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-primary">
      <Head>
        <title>API Sandbox | SJM.AI</title>
        <meta
          name="description"
          content="Test the SJM API directly in your browser with our interactive sandbox"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* API Sandbox Section */}
      <section className="py-20" id="sandbox">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="API Sandbox"
            subtitle="Test our API endpoints directly in your browser"
          />
          <APISandbox />
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 bg-gray-800/50" id="docs">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="API Documentation"
            subtitle="Comprehensive guides to integrate SJM into your applications"
          />
          <APIDocumentation />
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20" id="demos">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Interactive Demos"
            subtitle="See SJM in action with our pre-built integrations"
          />
          <DemoSection />
        </div>
      </section>

      {/* InFooter - import your existing InFooter */}
      <InFooter />
    </div>
  );
};

// API Sandbox Component
const APISandbox = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("match");
  const [apiKey, setApiKey] = useState("");
  const [parameters, setParameters] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [activeTab, setActiveTab] = useState("request");

  // Get API key from environment variable if available
  useEffect(() => {
    // Next.js environment variables that start with NEXT_PUBLIC_ are available on the client side
    const envApiKey = process.env.NEXT_PUBLIC_SJM_API_KEY || "";
    setApiKey(envApiKey);
  }, []);

  const endpoints = [
    {
      id: "match",
      name: "Match Freelancers",
      method: "POST",
      path: "/api/v1/match",
      description: "Find the best matched freelancers for a project",
      parameters: {
        description: "Project description",
        required_skills: "Array of required skills (comma-separated)",
        budget_range: "Budget range (min-max)",
        complexity: "Project complexity (low, medium, high)",
        timeline: "Project timeline in days",
      },
    },
    {
      id: "verify",
      name: "Verify Skill",
      method: "POST",
      path: "/api/v1/verify-skill",
      description: "Verify if a skill exists in our database",
      parameters: {
        keyword: "Skill or technology name to verify",
      },
    },
    {
      id: "interview",
      name: "AI Interview",
      method: "POST",
      path: "/api/v1/interview",
      description: "Conduct an AI-powered interview",
      parameters: {
        freelancer_id: "ID of the freelancer",
        project_description: "Project description",
        required_skills: "Array of required skills (comma-separated)",
        job_title: "Job title",
        mode: "Interview mode (ai_full, ai_questions, custom_full, hybrid)",
      },
    },
    {
      id: "health",
      name: "Health Check",
      method: "GET",
      path: "/api/v1/test/health",
      description: "Check the health status of the API",
      parameters: {},
    },
  ];

  // Get the current endpoint
  const currentEndpoint = endpoints.find((e) => e.id === selectedEndpoint);

  // Initialize default parameters when endpoint changes
  useEffect(() => {
    if (currentEndpoint) {
      const defaultParams = {};
      Object.keys(currentEndpoint.parameters).forEach((key) => {
        let defaultValue = "";

        // Set some better defaults for testing
        if (selectedEndpoint === "match") {
          if (key === "description")
            defaultValue =
              "Building a modern web application with React and Node.js";
          if (key === "required_skills")
            defaultValue = "React.js,Node.js,TypeScript";
          if (key === "budget_range") defaultValue = "3000-8000";
          if (key === "complexity") defaultValue = "medium";
          if (key === "timeline") defaultValue = "30";
        } else if (selectedEndpoint === "verify") {
          if (key === "keyword") defaultValue = "React.js";
        } else if (selectedEndpoint === "interview") {
          if (key === "freelancer_id") defaultValue = "f1";
          if (key === "project_description")
            defaultValue = "Building a modern web application";
          if (key === "required_skills") defaultValue = "React.js,Node.js";
          if (key === "job_title") defaultValue = "Full Stack Developer";
          if (key === "mode") defaultValue = "ai_questions";
        }

        defaultParams[key] = defaultValue;
      });
      setParameters(defaultParams);
    }
  }, [selectedEndpoint]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setParameters({
      ...parameters,
      [e.target.name]: e.target.value,
    });
  };

  // Format the request body
  const formatRequestBody = () => {
    const requestBody = { ...parameters };

    // Format specific parameters
    if (selectedEndpoint === "match") {
      if (requestBody.required_skills) {
        requestBody.required_skills = requestBody.required_skills
          .split(",")
          .map((s) => s.trim());
      }

      if (requestBody.budget_range) {
        const [min, max] = requestBody.budget_range.split("-");
        requestBody.budget_range = [parseInt(min), parseInt(max)];
      }

      if (requestBody.timeline) {
        requestBody.timeline = parseInt(requestBody.timeline);
      }
    }

    return requestBody;
  };

  // Execute API request
  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const url = `https://snapjobsai.com${currentEndpoint.path}`;
      const headers = {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      };

      let result;
      if (currentEndpoint.method === "GET") {
        result = await axios.get(url, { headers });
      } else {
        result = await axios.post(url, formatRequestBody(), { headers });
      }

      setResponse(result.data);
      setResponseTime(Date.now() - startTime);
      setActiveTab("response");
    } catch (err) {
      setError(err.response?.data || { error: err.message });
      setResponseTime(Date.now() - startTime);
      setActiveTab("response");
    } finally {
      setLoading(false);
    }
  };

  // Generate code samples
  const generateCodeSample = (language) => {
    const url = `https://snapjobsai.com${currentEndpoint.path}`;
    const method = currentEndpoint.method;
    const formattedBody = JSON.stringify(formatRequestBody(), null, 2);

    switch (language) {
      case "javascript":
        return `// Using fetch API
const options = {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }${
    method === "GET"
      ? ""
      : `,
  body: JSON.stringify(${formattedBody})`
  }
};

fetch('${url}', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

      case "python":
        return `import requests

url = "${url}"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY"
}${
          method === "GET"
            ? ""
            : `
payload = ${formattedBody}`
        }

response = requests.${method.toLowerCase()}(url, ${
          method === "GET" ? "headers=headers" : "json=payload, headers=headers"
        })
data = response.json()
print(data)`;

      case "curl":
        return `curl -X ${method} "${url}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY"${
    method === "GET"
      ? ""
      : ` \\
  -d '${JSON.stringify(formatRequestBody())}'`
  }`;

      default:
        return "";
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 rounded-xl overflow-hidden border border-accent/20 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-accent/10 flex justify-between items-center">
        <h3 className="text-2xl font-medium">API Sandbox</h3>
        <div className="flex items-center">
          <label className="mr-2 text-gray-400">API Key:</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm w-64"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 divide-x divide-accent/10">
        {/* Left sidebar - Endpoint selection */}
        <div className="p-4 bg-gray-800">
          <h4 className="text-lg font-medium mb-4 text-accent">Endpoints</h4>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.id}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedEndpoint === endpoint.id
                    ? "bg-accent text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedEndpoint(endpoint.id)}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-2 text-xs px-2 py-1 rounded ${
                      endpoint.method === "GET"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span>{endpoint.name}</span>
                </div>
                <div className="text-xs mt-1 opacity-70">{endpoint.path}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3 divide-y divide-accent/10">
          {/* Endpoint info */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium text-accent">
                  {currentEndpoint?.name}
                </h3>
                <div className="text-gray-400 mt-1">
                  {currentEndpoint?.description}
                </div>
              </div>
              <div
                className={`text-xs px-3 py-1 rounded ${
                  currentEndpoint?.method === "GET"
                    ? "bg-green-600/20 text-green-400"
                    : "bg-blue-600/20 text-blue-400"
                }`}
              >
                {currentEndpoint?.method} {currentEndpoint?.path}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-accent/10">
            <div className="flex">
              <button
                className={`px-6 py-3 ${
                  activeTab === "request"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("request")}
              >
                Request
              </button>
              <button
                className={`px-6 py-3 ${
                  activeTab === "response"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("response")}
              >
                Response {response && "✓"}
              </button>
              <button
                className={`px-6 py-3 ${
                  activeTab === "code"
                    ? "border-b-2 border-accent text-accent"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("code")}
              >
                Code Samples
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* Request Parameters */}
            {activeTab === "request" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(currentEndpoint?.parameters || {}).map(
                    ([key, description]) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-400 mb-1">
                          {key}
                          <span className="text-xs text-gray-500 ml-2">
                            ({description})
                          </span>
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={parameters[key] || ""}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={executeRequest}
                    disabled={loading}
                    className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        Execute Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Response */}
            {activeTab === "response" && (
              <div>
                {responseTime && (
                  <div className="text-sm text-gray-400 mb-4">
                    Response time: {responseTime}ms
                  </div>
                )}
                {(response || error) && (
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-800">
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            error
                              ? "bg-red-600/20 text-red-400"
                              : "bg-green-600/20 text-green-400"
                          }`}
                        >
                          {error ? "ERROR" : "SUCCESS"}
                        </span>
                        <span className="ml-2 text-sm text-gray-400">
                          {error ? "Request failed" : "Request succeeded"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(response || error, null, 2)
                          );
                        }}
                        className="text-gray-400 hover:text-accent transition-colors"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="p-4 text-gray-300 overflow-auto max-h-96">
                      {JSON.stringify(response || error, null, 2)}
                    </pre>
                  </div>
                )}
                {!response && !error && (
                  <div className="text-center py-16 text-gray-400">
                    <div className="mb-4">
                      <FiSend className="w-12 h-12 mx-auto opacity-30" />
                    </div>
                    No response yet. Execute a request to see results.
                  </div>
                )}
              </div>
            )}

            {/* Code Samples */}
            {activeTab === "code" && (
              <div className="space-y-6">
                <div className="border border-accent/10 rounded-lg overflow-hidden">
                  <div className="flex border-b border-accent/10">
                    <button
                      className="px-4 py-2 bg-accent text-white"
                      onClick={() => {
                        /* already active */
                      }}
                    >
                      JavaScript
                    </button>
                    <button
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-accent/10"
                      onClick={() => {
                        /* would switch to Python */
                      }}
                    >
                      Python
                    </button>
                    <button
                      className="px-4 py-2 text-gray-400 hover:text-white hover:bg-accent/10"
                      onClick={() => {
                        /* would switch to cURL */
                      }}
                    >
                      cURL
                    </button>
                  </div>
                  <div className="relative bg-gray-900 p-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generateCodeSample("javascript")
                        );
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-accent transition-colors"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 overflow-auto">
                      {generateCodeSample("javascript")}
                    </pre>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  <p>
                    For more examples and detailed documentation, check out our{" "}
                    <Link href="/docs" className="text-accent hover:underline">
                      API Reference
                    </Link>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// API Documentation Component
const APIDocumentation = () => {
  const docs = [
    {
      title: "Getting Started",
      icon: <FiPlay className="w-8 h-8" />,
      description: "Quick introduction to SJM API and authentication",
      link: "/docs/getting-started",
    },
    {
      title: "API Reference",
      icon: <FiBook className="w-8 h-8" />,
      description: "Complete reference for all API endpoints and parameters",
      link: "/docs/api-reference",
    },
    {
      title: "SDK Documentation",
      icon: <FiCode className="w-8 h-8" />,
      description:
        "Integration guides for our JavaScript, Python, and PHP SDKs",
      link: "/docs/sdks",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {docs.map((doc, index) => (
        <motion.div
          key={index}
          className="bg-gray-800/50 border border-accent/20 rounded-xl p-6 hover:border-accent/40 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="text-accent mb-4">{doc.icon}</div>
          <h3 className="text-xl font-medium mb-2">{doc.title}</h3>
          <p className="text-gray-400 mb-4">{doc.description}</p>
          <Link
            href={doc.link}
            className="inline-flex items-center text-accent hover:underline"
          >
            Learn more{" "}
            <FiChevronDown className="w-4 h-4 ml-1 transform rotate-270" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

// Demo Section Component
const DemoSection = () => {
  const demos = [
    {
      title: "Upwork Integration",
      description:
        "See how SJM integrates with Upwork to find the perfect freelancers",
      image: "/imgs/demo-upwork.jpg",
      link: "/demos/upwork",
    },
    {
      title: "Fiverr Integration",
      description:
        "Match Fiverr services to your project requirements automatically",
      image: "/imgs/demo-fiverr.jpg",
      link: "/demos/fiverr",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {demos.map((demo, index) => (
        <motion.div
          key={index}
          className="overflow-hidden rounded-xl border border-accent/20 bg-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="h-48 bg-gray-700 relative overflow-hidden">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              {/* Using Next.js Image here would be ideal, but keeping it simple for now */}
              <img
                src={demo.image}
                alt={demo.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-medium mb-2">{demo.title}</h3>
            <p className="text-gray-400 mb-4">{demo.description}</p>
            <Link
              href={demo.link}
              className="inline-flex items-center text-accent hover:underline"
            >
              View Demo <FiExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SandboxPage;
