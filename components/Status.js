import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiServer,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <p className="text-white font-bold">{label}</p>
        <p className="text-green-500">Uptime: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const ComponentStatus = ({ name, status, details }) => {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "healthy":
        return <FiCheckCircle />;
      case "error":
        return <FiAlertTriangle />;
      case "warning":
        return <FiAlertTriangle />;
      default:
        return <FiServer />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`${getStatusColor()} text-xl`}>{getStatusIcon()}</div>
        <div>
          <h4 className="text-sm font-medium text-white capitalize">
            {name.replace(/_/g, " ")}
          </h4>
          {details && <p className="text-xs text-gray-400 mt-1">{details}</p>}
        </div>
      </div>
      <span className={`text-sm font-semibold ${getStatusColor()} capitalize`}>
        {status}
      </span>
    </div>
  );
};

export default function SystemHealthChecker() {
  const [healthData, setHealthData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [apiKey, setApiKey] = useState("");

  // Set the API key from environment variable
  useEffect(() => {
    // In a real application, you should use environment variables
    // For testing, you can hardcode a valid API key here
    const envApiKey = process.env.NEXT_PUBLIC_SNAPJOBS_API_KEY;
    setApiKey(envApiKey);
  }, []);

  // We'll use the real historical data from the API endpoint

  // Update the fetchHealthData function to correctly fetch health status
  const fetchHealthData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch current health status using GET request
      // The test/health endpoint in your code is defined as a GET request, not POST
      const healthResponse = await fetch(
        "https://snapjobsai.com/api/v1/health",
        {
          method: "GET", // Changed from POST to GET to match the endpoint definition
          headers: {
            "X-API-Key": apiKey, // Pass the API key in headers
          },
        }
      );

      if (!healthResponse.ok) {
        throw new Error(
          `Failed to fetch health data: ${healthResponse.status} ${healthResponse.statusText}`
        );
      }

      const healthData = await healthResponse.json();

      // Check if we have actual data in the response
      if (healthData.data) {
        setHealthData(healthData.data);
      } else {
        setHealthData(healthData);
      }

      // Fetch historical data from the existing endpoint
      try {
        const historicalResponse = await fetch("/api/historical");
        if (historicalResponse.ok) {
          const historicalData = await historicalResponse.json();
          if (
            historicalData.status === "success" &&
            Array.isArray(historicalData.data)
          ) {
            setHistoricalData(historicalData.data);
          } else {
            console.warn("Unexpected historical data format:", historicalData);
            setHistoricalData([]);
          }
        } else {
          console.error(
            "Historical data fetch failed:",
            historicalResponse.status,
            historicalResponse.statusText
          );
          setHistoricalData([]);
        }
      } catch (histError) {
        console.error("Failed to fetch historical data:", histError);
        setHistoricalData([]);
      }

      setLastChecked(new Date());
      setError(null);
    } catch (err) {
      console.error("Health check error:", err);
      setError(err.message || "Failed to fetch health data");
      setHealthData(null);

      // Reset historical data on error
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    // Initial fetch
    fetchHealthData();

    // Periodic health check every minute
    const intervalId = setInterval(fetchHealthData, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchHealthData]);

  const getOverallStatus = () => {
    if (!healthData) return "error";
    return healthData.status === "healthy" ? "healthy" : "error";
  };

  const renderStatusIndicator = () => {
    const status = getOverallStatus();
    const statusClass =
      status === "healthy"
        ? "bg-green-500/20 text-green-500"
        : "bg-red-500/20 text-red-500";

    return (
      <motion.div
        className={`flex items-center space-x-2 ${statusClass} px-4 py-2 rounded-full`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {status === "healthy" ? <FiCheckCircle /> : <FiAlertTriangle />}
        <span className="text-sm font-medium">
          {status === "healthy"
            ? "System Operational"
            : "System Issues Detected"}
        </span>
      </motion.div>
    );
  };

  // Calculate overall uptime percentage
  const calculateOverallUptime = () => {
    if (!historicalData || historicalData.length === 0) return "N/A";

    // If uptime is already calculated in the data, use average
    if (typeof historicalData[0].uptime === "number") {
      const totalUptime = historicalData.reduce(
        (sum, entry) => sum + entry.uptime,
        0
      );
      return (totalUptime / historicalData.length).toFixed(2);
    }

    // Otherwise calculate based on status
    const totalEntries = historicalData.length;
    const healthyEntries = historicalData.filter(
      (entry) => entry.status === "healthy"
    ).length;

    return ((healthyEntries / totalEntries) * 100).toFixed(2);
  };

  return (
    <div className="bg-gray-900/50 border border-accent/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-accent/10">
        <div className="flex items-center space-x-3">
          <FiServer className="text-accent text-xl" />
          <h3 className="text-lg font-semibold text-white">System Health</h3>
        </div>

        {/* Status and Refresh */}
        <div className="flex items-center space-x-3">
          {renderStatusIndicator()}
          <motion.button
            onClick={fetchHealthData}
            disabled={loading}
            className="text-accent hover:bg-accent/10 p-2 rounded-full disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 mb-4">
            {error}
          </div>
        )}

        {healthData && (
          <>
            {/* Uptime Statistics */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-white">
                  System Uptime
                </h4>
                <span className="text-sm text-green-500">
                  {calculateOverallUptime()}% Total Uptime
                </span>
              </div>

              {/* Uptime Chart */}
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historicalData}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="date"
                      hide
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString()
                      }
                    />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="uptime"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: "#10B981",
                        stroke: "rgba(16, 185, 129, 0.4)",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              <ComponentStatus
                name="Overall Status"
                status={healthData.status}
              />

              {expanded &&
                healthData.components &&
                Object.entries(healthData.components).map(
                  ([name, component]) => (
                    <ComponentStatus
                      key={name}
                      name={name}
                      status={component.status}
                      details={component.error}
                    />
                  )
                )}
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full mt-4 flex items-center justify-center text-accent hover:bg-accent/10 py-2 rounded-lg"
            >
              {expanded ? (
                <>
                  <FiChevronUp className="mr-2" /> Collapse Details
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-2" /> Expand Details
                </>
              )}
            </button>
          </>
        )}

        {/* Last Checked */}
        {lastChecked && (
          <div className="text-xs text-gray-500 text-center mt-4">
            Last checked: {lastChecked.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
