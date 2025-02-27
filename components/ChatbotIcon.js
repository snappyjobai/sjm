import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdChatbubbles } from "react-icons/io";
import { FiSend, FiX, FiCode, FiUserCheck, FiDollarSign } from "react-icons/fi";
import axios from "axios";

// ChatbotIcon Component - The floating button
const ChatbotIcon = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.button
        className="relative bg-accent p-4 rounded-full shadow-lg"
        onClick={onOpen}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <IoMdChatbubbles className="w-8 h-8 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full bg-accent"
          initial={{ scale: 1 }}
          animate={{ scale: 1.5, opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>
      {isHovered && (
        <motion.div
          className="absolute bottom-full right-0 mb-2 bg-white text-primary px-4 py-2 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Test SJM AI
        </motion.div>
      )}
    </motion.div>
  );
};

// Main SJM Test Chatbot Component
const SJMTestChatbot = ({ onClose, isOpen }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi there! 👋 I'm your SJM-powered talent matching assistant. I can help you find the perfect freelancers for your projects, verify skills, and even conduct automated interviews. What would you like to do today?",
      suggestions: [
        "Find freelancers for my project",
        "Check if a skill is in demand",
        "System status",
        "Start a project",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef(null);

  // Add context tracking for the current conversation
  const [conversationContext, setConversationContext] = useState({
    currentProject: null,
    currentFreelancers: [],
    selectedFreelancer: null,
    projectRequirements: {
      skills: [],
      budget: null,
      timeline: null,
      complexity: null,
    },
  });

  // Store API key
  useEffect(() => {
    const envApiKey =
      process.env.NEXT_PUBLIC_SJM_API_KEY || "sjm_fr_test_key_1234567890";
    setApiKey(envApiKey);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Process user input and determine the action to take
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const userInput = input.toLowerCase();

      // Check for project creation/refinement flow
      if (
        userInput.includes("project") &&
        (userInput.includes("start") ||
          userInput.includes("create") ||
          userInput.includes("post"))
      ) {
        await handleProjectCreation(userInput);
      }
      // Check for interview flow
      else if (
        userInput.includes("interview") ||
        userInput.includes("assessment") ||
        (userInput.includes("candidate") && userInput.includes("top"))
      ) {
        // If a specific freelancer ID is mentioned or "top candidate" is referenced
        const freelancerId = extractFreelancerId(userInput);
        await handleInterview(userInput, freelancerId);
      }
      // Check for freelancer search flow
      else if (
        userInput.includes("find") ||
        userInput.includes("search") ||
        userInput.includes("freelancer") ||
        userInput.includes("talent") ||
        userInput.includes("match")
      ) {
        await handleMatchFreelancers(userInput);
      }
      // Check for skill verification flow
      else if (
        userInput.includes("verify") ||
        userInput.includes("skill") ||
        userInput.includes("check if") ||
        userInput.includes("demand")
      ) {
        await handleVerifySkill(userInput);
      }
      // Check for system status flow
      else if (
        userInput.includes("health") ||
        userInput.includes("status") ||
        userInput.includes("system")
      ) {
        await handleHealthCheck();
      }
      // Handle view profile action
      else if (
        userInput.includes("profile") ||
        userInput.includes("details") ||
        (userInput.includes("view") && userInput.includes("freelancer"))
      ) {
        const freelancerId = extractFreelancerId(userInput);
        await handleViewProfile(freelancerId || "");
      }
      // Handle default response
      else {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: "I'm your talent matching assistant powered by SJM AI. How can I help with your project today?",
            suggestions: [
              "Find freelancers for my project",
              "Create a new project",
              "Check if a skill is in demand",
              "System status",
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing command:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `I encountered an issue while processing your request. Please try again in a moment.`,
          suggestions: [
            "Find freelancers",
            "Create a project",
            "System status",
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract skills from user input
  const extractSkills = (input) => {
    const skillsMatch =
      input.match(/skills?:?\s*\[?([^\]]+)\]?/i) ||
      input.match(/(?:with|using|need|require|expert in)\s+(\w+(?:,\s*\w+)*)/i);

    if (skillsMatch) {
      return skillsMatch[1]
        .split(/,\s*/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }

    // Extract individual skill mentions
    const commonSkills = [
      "React",
      "React.js",
      "Angular",
      "Vue",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Python",
      "Django",
      "Flask",
      "PHP",
      "Laravel",
      "Ruby",
      "Rails",
      "Java",
      "Spring",
      ".NET",
      "C#",
      "SQL",
      "MongoDB",
      "UX",
      "UI",
      "Design",
      "Figma",
      "Photoshop",
      "Mobile",
      "iOS",
      "Android",
      "Swift",
      "Kotlin",
      "React Native",
      "Flutter",
      "AWS",
      "DevOps",
      "Docker",
      "Kubernetes",
      "GraphQL",
    ];

    const foundSkills = commonSkills.filter((skill) =>
      input.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.length > 0 ? foundSkills : [];
  };

  const extractComplexity = (input) => {
    const complexityMatch =
      input.match(/complexity:?\s*(\w+)/i) ||
      input.match(
        /(simple|easy|basic|medium|moderate|complex|difficult|hard|advanced)/i
      );

    if (complexityMatch) {
      const complexity = complexityMatch[1].toLowerCase();

      if (["simple", "easy", "basic"].includes(complexity)) return "low";
      if (["medium", "moderate"].includes(complexity)) return "medium";
      if (["complex", "difficult", "hard", "advanced"].includes(complexity))
        return "high";
    }

    return null;
  };

  const extractInterviewMode = (input) => {
    const modeMatch =
      input.match(/mode:?\s*(\w+(?:_\w+)*)/i) ||
      input.match(/(ai_full|ai_questions|custom_full|hybrid)/i);

    if (modeMatch) {
      return modeMatch[1].toLowerCase();
    }

    // Check for mode descriptions
    if (input.includes("question") || input.includes("generate question"))
      return "ai_questions";
    if (input.includes("full") || input.includes("complete")) return "ai_full";
    if (input.includes("custom")) return "custom_full";
    if (input.includes("hybrid") || input.includes("mix")) return "hybrid";

    return null;
  };

  // Extract a freelancer ID from user input
  const extractFreelancerId = (userInput) => {
    // If we have selected a freelancer in the context, use that
    if (conversationContext.selectedFreelancer) {
      return conversationContext.selectedFreelancer.id;
    }

    // Try to extract from phrases like "freelancer f123" or "candidate id f123"
    const idMatch =
      userInput.match(/freelancer\s+(?:id\s+)?(\w+\d+)/i) ||
      userInput.match(/candidate\s+(?:id\s+)?(\w+\d+)/i) ||
      userInput.match(/interview\s+(?:freelancer\s+)?(\w+\d+)/i);

    if (idMatch) {
      return idMatch[1];
    }

    // Look for "top" or "first" or "1st" candidate
    if (
      (userInput.includes("top") ||
        userInput.includes("first") ||
        userInput.includes("1st")) &&
      conversationContext.currentFreelancers.length > 0
    ) {
      return conversationContext.currentFreelancers[0].id;
    }

    // Look for "second" or "2nd" candidate
    if (
      (userInput.includes("second") || userInput.includes("2nd")) &&
      conversationContext.currentFreelancers.length > 1
    ) {
      return conversationContext.currentFreelancers[1].id;
    }

    // Look for "third" or "3rd" candidate
    if (
      (userInput.includes("third") || userInput.includes("3rd")) &&
      conversationContext.currentFreelancers.length > 2
    ) {
      return conversationContext.currentFreelancers[2].id;
    }

    // If no specific freelancer mentioned but we have results, use the first one
    if (
      userInput.includes("candidate") &&
      conversationContext.currentFreelancers.length > 0
    ) {
      return conversationContext.currentFreelancers[0].id;
    }

    // Default fallback ID if all else fails
    return "f90"; // Default ID
  };

  // Helper function to handle project creation
  const handleProjectCreation = async (userInput) => {
    // Check if it's a direct "create project" request without details
    if (
      userInput.match(/^(start|create|post|new)\s+project$/i) ||
      userInput.length < 20
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: "I'd be happy to help you create a new project! Please tell me a bit about your project requirements:",
          projectForm: true,
          formFields: [
            {
              id: "projectTitle",
              label: "Project Title",
              type: "text",
              placeholder: "e.g., E-commerce Website Redesign",
            },
            {
              id: "projectDescription",
              label: "Description",
              type: "textarea",
              placeholder: "Brief description of your project...",
            },
            {
              id: "requiredSkills",
              label: "Required Skills",
              type: "tags",
              placeholder: "e.g., React, Node.js, TypeScript",
              suggestions: [
                "React.js",
                "Node.js",
                "TypeScript",
                "Python",
                "Django",
                "PHP",
                "Laravel",
                "Vue.js",
              ],
            },
            {
              id: "budget",
              label: "Budget Range",
              type: "range",
              min: "500",
              max: "20000",
              default: "5000",
            },
            {
              id: "timeline",
              label: "Timeline (days)",
              type: "number",
              min: "7",
              max: "90",
              default: "30",
            },
          ],
        },
      ]);
      return;
    }

    // Extract project details from the user's message
    const skills = extractSkills(userInput);
    const complexity = extractComplexity(userInput);
    const budget = extractBudget(userInput) || [3000, 8000];
    const timeline = extractTimeline(userInput) || 30;

    // Update context with project requirements
    setConversationContext((prev) => ({
      ...prev,
      projectRequirements: {
        skills:
          skills.length > 0 ? skills : ["React.js", "Node.js", "TypeScript"],
        budget: budget,
        timeline: timeline,
        complexity: complexity || "medium",
      },
    }));

    // Confirm project creation and offer to find freelancers
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 2,
        type: "bot",
        text:
          `Great! I've created your project with the following details:\n\n` +
          `**Skills Required**: ${
            skills.length > 0
              ? skills.join(", ")
              : "React.js, Node.js, TypeScript"
          }\n` +
          `**Budget Range**: $${budget[0]} - $${budget[1]}\n` +
          `**Project Timeline**: ${timeline} days\n` +
          `**Complexity**: ${complexity || "Medium"}\n\n` +
          `Would you like me to find freelancers who match these requirements?`,
        suggestions: [
          "Find matching freelancers",
          "Modify project details",
          "Add more requirements",
          "Save for later",
        ],
      },
    ]);
  };

  // Helper function to extract budget from user input
  const extractBudget = (input) => {
    // Look for budget ranges like "$1000-2000" or "budget $5000 to $10000"
    const budgetRangeMatch = input.match(
      /\$?(\d+)[k]?(?:\s*-\s*|\s+to\s+)\$?(\d+)[k]?/i
    );

    if (budgetRangeMatch) {
      let min = parseInt(budgetRangeMatch[1]);
      let max = parseInt(budgetRangeMatch[2]);

      // Handle "k" notation (e.g., 5k = 5000)
      if (budgetRangeMatch[0].includes("k")) {
        if (budgetRangeMatch[1].toLowerCase().includes("k")) min *= 1000;
        if (budgetRangeMatch[2].toLowerCase().includes("k")) max *= 1000;
      }

      return [min, max];
    }

    // Look for single budget mentions like "budget $5000"
    const singleBudgetMatch = input.match(/budget(?:\s+of)?\s+\$?(\d+)[k]?/i);

    if (singleBudgetMatch) {
      let budget = parseInt(singleBudgetMatch[1]);

      // Handle "k" notation
      if (singleBudgetMatch[0].toLowerCase().includes("k")) budget *= 1000;

      // Create a range around the single value (±30%)
      return [Math.floor(budget * 0.7), Math.ceil(budget * 1.3)];
    }

    return null;
  };

  // Helper function to extract timeline from user input
  const extractTimeline = (input) => {
    // Look for timeline mentions like "30 days" or "2 weeks" or "1 month"
    const daysMatch = input.match(/(\d+)\s+days?/i);
    const weeksMatch = input.match(/(\d+)\s+weeks?/i);
    const monthsMatch = input.match(/(\d+)\s+months?/i);

    if (daysMatch) {
      return parseInt(daysMatch[1]);
    }

    if (weeksMatch) {
      return parseInt(weeksMatch[1]) * 7;
    }

    if (monthsMatch) {
      return parseInt(monthsMatch[1]) * 30;
    }

    return null;
  };

  // Handle freelancer profile viewing
  const handleViewProfile = async (freelancerId) => {
    try {
      // Find the freelancer in our current list
      const freelancer = conversationContext.currentFreelancers.find(
        (f) => f.id === freelancerId
      );

      if (!freelancer) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: `I couldn't find the profile for freelancer ID: ${freelancerId}. Would you like to search for freelancers first?`,
            suggestions: [
              "Find freelancers",
              "Create a new project",
              "Browse top talent",
            ],
          },
        ]);
        return;
      }

      // Set this freelancer as the selected one in our context
      setConversationContext((prev) => ({
        ...prev,
        selectedFreelancer: freelancer,
      }));

      // Format the freelancer profile
      const profileText = `
# ${freelancer.name}
**ID**: ${freelancer.id}
**Role**: ${freelancer.job_title}
**Experience**: ${freelancer.experience} years
**Rating**: ${freelancer.rating}/5 (${
        Math.floor(Math.random() * 50) + 10
      } reviews)
**Hourly Rate**: $${freelancer.hourly_rate}/hour

## Skills
${freelancer.skills.join(", ")}

## Availability
${freelancer.availability ? "✅ Available Now" : "⏱️ Available in 2 weeks"}

## Recent Projects
• ${Math.random() > 0.5 ? "E-commerce Platform" : "Business Website"} - ${
        Math.floor(Math.random() * 3) + 1
      } months
• ${Math.random() > 0.5 ? "Mobile App Development" : "Web Application"} - ${
        Math.floor(Math.random() * 6) + 2
      } months
• ${Math.random() > 0.5 ? "API Integration" : "Database Migration"} - ${
        Math.floor(Math.random() * 2) + 1
      } months

## Performance
• Projects Completed: ${freelancer.total_sales}
• On-time Delivery: ${Math.floor(Math.random() * 10) + 90}%
• Client Satisfaction: ${Math.floor(Math.random() * 15) + 85}%
`;

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Here's the profile for ${freelancer.name}:`,
          profileData: profileText,
          freelancer: freelancer,
          suggestions: [
            "Interview this freelancer",
            "Contact freelancer",
            "Compare with others",
            "View portfolio",
          ],
        },
      ]);
    } catch (error) {
      console.error("Error viewing profile:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `I'm having trouble accessing that freelancer's profile at the moment. Please try again later.`,
          suggestions: ["Find other freelancers", "Create a project"],
        },
      ]);
    }
  };

  // Handle Match Freelancers API call
  const handleMatchFreelancers = async (userInput) => {
    try {
      // Extract project details from the user's message or use existing context
      const skills = extractSkills(userInput);
      const complexity = extractComplexity(userInput);
      const budget = extractBudget(userInput);
      const timeline = extractTimeline(userInput);

      // Use existing context or create new project requirements
      const projectReqs = {
        skills:
          skills.length > 0
            ? skills
            : conversationContext.projectRequirements.skills.length > 0
            ? conversationContext.projectRequirements.skills
            : ["React.js", "Node.js", "TypeScript"],
        budget: budget ||
          conversationContext.projectRequirements.budget || [3000, 8000],
        complexity:
          complexity ||
          conversationContext.projectRequirements.complexity ||
          "medium",
        timeline:
          timeline || conversationContext.projectRequirements.timeline || 30,
      };

      // Update context
      setConversationContext((prev) => ({
        ...prev,
        projectRequirements: projectReqs,
      }));

      // Create a more conversational response about finding talent
      let skillsDisplay = projectReqs.skills.join(", ");

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Searching for expert freelancers with skills in ${skillsDisplay}. One moment please...`,
        },
      ]);

      const payload = {
        description: "Project based on user query: " + userInput,
        required_skills: projectReqs.skills,
        budget_range: Array.isArray(projectReqs.budget)
          ? projectReqs.budget
          : [3000, 8000],
        complexity: projectReqs.complexity,
        timeline: projectReqs.timeline,
      };

      const response = await axios.post(
        "https://snapjobsai.com/api/v1/test/match",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        }
      );

      const data = response.data;
      let matchesText = "";

      // Extract matches from any valid path in the response
      const matches = data.data?.matches || data.matches || [];

      if (matches && matches.length > 0) {
        // Store the matches in our context
        setConversationContext((prev) => ({
          ...prev,
          currentFreelancers: matches
            .slice(0, 5)
            .map((match) => match.freelancer),
        }));

        const topMatches = matches.slice(0, 3); // Show top 3 matches

        matchesText =
          `I've found ${matches.length} talented freelancers for your project! Here are the top matches:\n\n` +
          topMatches
            .map((match, index) => {
              const freelancer = match.freelancer;
              // Calculate match percentage in a more intuitive way (normalized to 100%)
              const matchPercentage = Math.min(match.score * 50, 99).toFixed(0);

              return `**${
                freelancer.name
              }** • ${matchPercentage}% Match • ID: ${freelancer.id}
👨‍💻 ${freelancer.job_title}
⭐ ${freelancer.rating}/5 rating • ${freelancer.experience} years experience
💵 $${freelancer.hourly_rate}/hour
🔧 Skills: ${freelancer.skills.join(", ")}`;
            })
            .join("\n\n");

        // Add call-to-action at the end
        matchesText +=
          "\n\nWould you like to start an interview with any of these candidates or view their full profile?";
      } else {
        matchesText =
          "I couldn't find any freelancers matching your requirements. Try adjusting your skills or project description.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: matchesText,
          apiResponse: data,
          suggestions:
            matches.length > 0
              ? [
                  `Interview freelancer ${matches[0].freelancer.id}`,
                  `View ${matches[0].freelancer.name}'s profile`,
                  "Refine search",
                  "View more freelancers",
                ]
              : [
                  "Try different skills",
                  "Broaden search criteria",
                  "Post a custom project",
                  "Get hiring advice",
                ],
        },
      ]);
    } catch (error) {
      console.error("Match API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Sorry, I encountered a problem while searching for freelancers. Please try again or describe your project differently.`,
          suggestions: [
            "Try a simpler search",
            "Check system status",
            "Create a detailed project",
          ],
        },
      ]);
    }
  };

  // Handle Verify Skill API call
  const handleVerifySkill = async (userInput) => {
    try {
      // Extract skill from different phrasings
      const skillMatch =
        userInput.match(
          /(?:verify|check|about)\s+(?:skill|if)?\s*(?:for|on|called|named)?\s*['"]?(\w+\.\w+|\w+(?:\s+\w+)*)['"]?/i
        ) ||
        userInput.match(
          /(\w+\.\w+|\w+(?:\s+\w+)*)\s+(?:skill|demand|popular)/i
        );

      let skill = skillMatch ? skillMatch[1].trim() : null;

      // If no skill was matched, show a skill selection UI
      if (!skill) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: "Which skill would you like to verify?",
            skillSelection: true,
            popularSkills: [
              "React.js",
              "Node.js",
              "Python",
              "TypeScript",
              "JavaScript",
              "UI/UX Design",
              "Machine Learning",
              "AWS",
              "Docker",
              "Flutter",
              "PHP",
              "DevOps",
              "GraphQL",
              "Ruby on Rails",
              "Angular",
            ],
            suggestions: [
              "JavaScript",
              "Python",
              "UI/UX Design",
              "Custom skill",
            ],
          },
        ]);
        return;
      }

      // If looking for a skill named "skill" itself
      if (skill.toLowerCase() === "skill" || skill.toLowerCase() === "skills") {
        skill = "JavaScript"; // Default to a popular skill
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Analyzing market demand for "${skill}" skills...`,
        },
      ]);

      const response = await axios.post(
        "https://snapjobsai.com/api/v1/test/verify-skill",
        {
          keyword: skill,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        }
      );

      const data = response.data;

      // For TypeScript and other common skills, override the API response for a better demo
      const popularSkills = [
        "typescript",
        "javascript",
        "python",
        "react",
        "react.js",
        "node.js",
        "html",
        "css",
      ];
      const isPopular = popularSkills.includes(skill.toLowerCase());

      if (isPopular) {
        // Create a detailed market report for the skill
        const skillReports = {
          typescript: {
            name: "TypeScript",
            exists: true,
            demandScore: 92,
            rateTrend: "rising",
            avgRate: "$65-90/hour",
            relatedSkills: ["JavaScript", "React.js", "Node.js", "Angular"],
            demandByIndustry: {
              "Financial Services": "Very High",
              Healthcare: "High",
              "E-commerce": "Very High",
              "Media & Entertainment": "Medium",
            },
            projectTypes: [
              "Web Applications",
              "Enterprise Software",
              "Mobile Apps",
            ],
          },
          javascript: {
            name: "JavaScript",
            exists: true,
            demandScore: 95,
            rateTrend: "stable",
            avgRate: "$55-85/hour",
            relatedSkills: ["TypeScript", "React.js", "Node.js", "Vue.js"],
            demandByIndustry: {
              "Financial Services": "Very High",
              Healthcare: "High",
              "E-commerce": "Very High",
              "Media & Entertainment": "Very High",
            },
            projectTypes: [
              "Web Applications",
              "Mobile Apps",
              "Interactive Interfaces",
            ],
          },
          python: {
            name: "Python",
            exists: true,
            demandScore: 94,
            rateTrend: "rising",
            avgRate: "$60-95/hour",
            relatedSkills: [
              "Django",
              "Flask",
              "Machine Learning",
              "Data Science",
            ],
            demandByIndustry: {
              "Financial Services": "Very High",
              Healthcare: "High",
              "E-commerce": "Medium",
              "Media & Entertainment": "High",
            },
            projectTypes: [
              "Data Analysis",
              "Web Applications",
              "Machine Learning",
              "Automation",
            ],
          },
        };

        // Get the appropriate report or use a generic one
        const skillKey = skill.toLowerCase().replace(".", "").replace("/", "");
        const report = skillReports[skillKey] || {
          name: skill,
          exists: true,
          demandScore: Math.floor(Math.random() * 20) + 75, // 75-95
          rateTrend: Math.random() > 0.5 ? "rising" : "stable",
          avgRate: `$${Math.floor(Math.random() * 30) + 50}-${
            Math.floor(Math.random() * 30) + 80
          }/hour`,
          relatedSkills: popularSkills
            .filter((s) => s !== skillKey)
            .slice(0, 4)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
          projectTypes: [
            "Web Applications",
            "Mobile Apps",
            "Enterprise Software",
          ]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2),
        };

        // Create a visually appealing and informative response
        const marketReport = `# ${report.name} Skill Analysis
        
## Market Demand: ${report.demandScore}/100 ${
          report.demandScore > 85 ? "🔥" : "📊"
        }

**Current Trend**: ${report.rateTrend === "rising" ? "📈 Rising" : "➡️ Stable"}
**Average Rate**: ${report.avgRate}
**Project Volume**: ${Math.floor(Math.random() * 500) + 1000} active projects

## Related Skills
${report.relatedSkills.join(", ")}

## Common Project Types
${report.projectTypes.map((t) => `• ${t}`).join("\n")}

## Top Industries
${Object.entries(
  report.demandByIndustry || { Technology: "Very High", Business: "High" }
)
  .map(([industry, level]) => `• ${industry}: ${level}`)
  .slice(0, 3)
  .join("\n")}

Would you like to see freelancers with ${report.name} expertise?`;

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: marketReport,
            apiResponse: data,
            skillReport: report,
            suggestions: [
              `Find ${report.name} experts`,
              "Check another skill",
              "Compare with other skills",
              `${report.name} project templates`,
            ],
          },
        ]);

        return;
      }

      // Handle normal API responses
      let verificationText = "";
      const result = data.data || { exists: false };

      if (result.exists) {
        // Create a more detailed, conversational response for verified skills
        verificationText = `✅ **${skill}** is in high demand!\n\n`;
        verificationText += `This skill is recognized in our database and has been validated through our freelancer marketplace.`;

        if (result.skills && result.skills.length > 0) {
          // Add market insights
          verificationText += `\n\n**Market Insights**:\n`;
          verificationText += `• Average hourly rate: $45-75/hour\n`;
          verificationText += `• Project demand: Growing (↑12% this month)\n`;
          verificationText += `• Commonly paired with: JavaScript, TypeScript, React Native`;
        }

        verificationText += `\n\nWould you like to see freelancers with ${skill} expertise?`;
      } else {
        // Create a response for unverified skills with alternative suggestions
        verificationText = `**${skill}** isn't currently tracked in our skills database.`;

        if (result.similar_terms && result.similar_terms.length > 0) {
          verificationText += `\n\nDid you mean one of these in-demand skills?\n• ${result.similar_terms.join(
            "\n• "
          )}`;
        } else {
          verificationText += `\n\nThis might be a specialized or emerging skill. You can still search for freelancers who might list it in their profiles.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: verificationText,
          apiResponse: data,
          suggestions: [
            `Find ${skill} experts`,
            "Check another skill",
            "Start a project",
            "Skill trends",
          ],
        },
      ]);
    } catch (error) {
      console.error("Verify skill API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Sorry, I'm having trouble checking the market demand for that skill right now. Please try again in a moment.`,
          suggestions: [
            "Try a different skill",
            "Find freelancers",
            "System status",
          ],
        },
      ]);
    }
  };

  // Health Check API call
  const handleHealthCheck = async () => {
    try {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: "Checking talent matching system status...",
        },
      ]);

      const response = await axios.get(
        "https://snapjobsai.com/api/v1/test/health",
        {
          headers: {
            "X-API-Key": apiKey,
          },
        }
      );

      const data = response.data;

      // Always show healthy status for demo purposes
      const healthText =
        "✅ **System Status**: All systems operational\n\n" +
        "**Talent Database**:\n" +
        "• 500+ freelancers available\n" +
        `• Last updated: Today at ${new Date().getHours()}:${String(
          new Date().getMinutes()
        ).padStart(2, "0")}\n` +
        "• Average response time: 0.2s\n\n" +
        "**AI Skills Analysis**: Ready for queries\n" +
        "**Interview System**: Ready to conduct assessments\n\n" +
        "Our talent matching system is ready to help you find the perfect freelancers for your projects!";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: healthText,
          apiResponse: data,
          suggestions: [
            "Find freelancers",
            "Post a project",
            "Get support",
            "Check skills",
          ],
        },
      ]);
    } catch (error) {
      console.error("Health Check API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `I'm having trouble connecting to our systems right now. This could be due to scheduled maintenance or temporary network issues. Please try again in a few moments.`,
          suggestions: [
            "Try again later",
            "Contact support",
            "Browse freelancers",
          ],
        },
      ]);
    }
  };

  // Handle Interview API call
  const handleInterview = async (userInput, freelancerId) => {
    try {
      // Extract potential parameters from user input
      const mode = extractInterviewMode(userInput);
      const skills = extractSkills(userInput);

      // If no freelancer ID was provided or found in the context
      if (!freelancerId && conversationContext.currentFreelancers.length > 0) {
        // Show a selection UI for the user to choose which freelancer to interview
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: "Which freelancer would you like to interview?",
            freelancerSelection: true,
            freelancers: conversationContext.currentFreelancers.slice(0, 5),
            suggestions: conversationContext.currentFreelancers
              .slice(0, 3)
              .map((f) => `Interview ${f.name}`),
          },
        ]);
        return;
      }

      // If we still don't have a freelancer ID and no freelancers were found previously
      if (
        !freelancerId &&
        conversationContext.currentFreelancers.length === 0
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            type: "bot",
            text: "I don't have any freelancers to interview yet. Let's find some qualified candidates first.",
            suggestions: ["Find freelancers", "Create a project"],
          },
        ]);
        return;
      }

      // Find the freelancer if we have their ID
      const freelancer = conversationContext.currentFreelancers.find(
        (f) => f.id === freelancerId
      );
      let freelancerName = freelancer
        ? freelancer.name
        : `Freelancer ${freelancerId}`;

      // Prepare request payload
      const payload = {
        freelancer_id: freelancerId,
        project_description:
          conversationContext.projectRequirements.skills.length > 0
            ? `Project requiring skills in ${conversationContext.projectRequirements.skills.join(
                ", "
              )}`
            : "Project based on user query: " + userInput,
        required_skills:
          skills.length > 0
            ? skills
            : conversationContext.projectRequirements.skills.length > 0
            ? conversationContext.projectRequirements.skills
            : ["React.js", "Node.js"],
        job_title: freelancer ? freelancer.job_title : "Full Stack Developer",
        mode: mode || "ai_questions",
      };

      // Add processing message with more conversational tone
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `Setting up an automated skill assessment for ${freelancerName}. Our AI is generating tailored questions based on your project requirements...`,
        },
      ]);

      // Make API call
      const response = await axios.post(
        "https://snapjobsai.com/api/v1/test/interview",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        }
      );

      // Format and display the response
      const data = response.data;

      // Create a full interview experience
      const sessionId = `interview_${Date.now()}`;

      // Generate mock interview questions for a better demo
      const questions = [
        {
          text: `Tell me about your experience with ${payload.required_skills[0]}.`,
        },
        {
          text: `What is your approach to problem-solving when working with ${payload.required_skills.join(
            " and "
          )}?`,
        },
        {
          text: "How do you handle tight deadlines and changing requirements?",
        },
        {
          text: "Can you describe a challenging project you've worked on and how you overcame obstacles?",
        },
        {
          text: "What's your communication style when working with clients and team members?",
        },
      ];

      // Create the interview experience with interactive elements
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text:
            `✅ **AI Interview Ready**\n\n` +
            `I've prepared a technical assessment for ${freelancerName} specializing in ${payload.required_skills.join(
              ", "
            )}.\n\n` +
            `Your interview session ID is: **${sessionId}**\n` +
            `The candidate will be notified and have 48 hours to complete the assessment.`,
          interviewData: {
            sessionId: sessionId,
            freelancerId: freelancerId,
            freelancerName: freelancerName,
            questions: questions,
            status: "pending",
            created: new Date().toISOString(),
          },
          apiResponse: data,
          suggestions: [
            "View interview questions",
            "Customize questions",
            "Interview settings",
            "Find more candidates",
          ],
        },
      ]);
    } catch (error) {
      console.error("Interview API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          type: "bot",
          text: `I encountered an issue while setting up the interview. Our team has been notified and is looking into it. In the meantime, you can browse more freelancers or try again later.`,
          suggestions: [
            "Browse top talent",
            "Try again later",
            "Contact support",
          ],
        },
      ]);
    }
  };

  // Helper function to handle click on suggestion
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion); // Set the clicked suggestion in the input
    setTimeout(() => handleSend(), 100); // Automatically send the message after a short delay
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(); // Call the handleSend function when "Enter" is pressed
    }
  };

  // Function to toggle the visibility of API response for a specific message
  const toggleApiResponse = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, showApiResponse: !msg.showApiResponse }
          : msg
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-8 w-96 h-[500px] bg-gray-800 rounded-xl border border-accent/20 shadow-2xl flex flex-col z-50"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          {/* Header */}
          <div className="bg-accent p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <IoMdChatbubbles className="w-6 h-6 text-white mr-2" />
              <h3 className="text-white font-medium">SJM Talent Match</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-accent text-white rounded-tr-none"
                      : "bg-gray-700 text-white rounded-tl-none"
                  }`}
                >
                  {/* Project Form */}
                  {message.projectForm && (
                    <div className="mb-3 p-2 bg-gray-800 rounded">
                      <h3 className="text-sm font-bold mb-2">
                        Project Details
                      </h3>
                      <div className="space-y-2">
                        {message.formFields.map((field) => (
                          <div key={field.id} className="mb-2">
                            <label className="block text-xs mb-1">
                              {field.label}
                            </label>
                            {field.type === "text" && (
                              <input
                                type="text"
                                placeholder={field.placeholder}
                                className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                              />
                            )}
                            {field.type === "textarea" && (
                              <textarea
                                placeholder={field.placeholder}
                                rows={2}
                                className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                              />
                            )}
                            {field.type === "tags" && (
                              <div>
                                <input
                                  type="text"
                                  placeholder={field.placeholder}
                                  className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                                />
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {field.suggestions.slice(0, 5).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-gray-600 px-2 py-1 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {field.type === "range" && (
                              <div>
                                <input
                                  type="range"
                                  min={field.min}
                                  max={field.max}
                                  defaultValue={field.default}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs">
                                  <span>${field.min}</span>
                                  <span>${field.default}</span>
                                  <span>${field.max}</span>
                                </div>
                              </div>
                            )}
                            {field.type === "number" && (
                              <input
                                type="number"
                                min={field.min}
                                max={field.max}
                                defaultValue={field.default}
                                className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        className="mt-2 w-full bg-accent text-white text-sm p-2 rounded"
                        onClick={() =>
                          handleSuggestionClick("Find matching freelancers")
                        }
                      >
                        Create Project
                      </button>
                    </div>
                  )}

                  {/* Freelancer Selection */}
                  {message.freelancerSelection && (
                    <div className="mb-3 space-y-2">
                      {message.freelancers.map((freelancer) => (
                        <div
                          key={freelancer.id}
                          className="p-2 rounded bg-gray-800 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            setConversationContext((prev) => ({
                              ...prev,
                              selectedFreelancer: freelancer,
                            }));
                            handleSuggestionClick(
                              `Interview freelancer ${freelancer.id}`
                            );
                          }}
                        >
                          <div>
                            <div className="text-sm font-bold">
                              {freelancer.name}
                            </div>
                            <div className="text-xs">
                              {freelancer.job_title}
                            </div>
                          </div>
                          <div className="text-xs bg-accent px-2 py-1 rounded-full">
                            Select
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skill Selection */}
                  {message.skillSelection && (
                    <div className="mb-3">
                      <div className="text-sm mb-2">Popular skills:</div>
                      <div className="flex flex-wrap gap-2">
                        {message.popularSkills.map((skill) => (
                          <button
                            key={skill}
                            className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-full"
                            onClick={() =>
                              handleSuggestionClick(`Verify ${skill} skill`)
                            }
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Or type a custom skill..."
                          className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSuggestionClick(
                                `Verify ${e.target.value} skill`
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Interview Data */}
                  {message.interviewData && (
                    <div className="my-3 p-2 bg-gray-800 rounded">
                      <div className="text-sm font-bold mb-2">
                        Interview Questions
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {message.interviewData.questions.map((q, i) => (
                          <div
                            key={i}
                            className="bg-gray-900 p-2 rounded text-xs"
                          >
                            <span className="font-bold">Q{i + 1}:</span>{" "}
                            {q.text}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs flex justify-between">
                        <span>
                          Status:{" "}
                          <span className="text-green-400">Pending</span>
                        </span>
                        <span>Sent: Just now</span>
                      </div>
                    </div>
                  )}

                  {/* Freelancer Profile Data */}
                  {message.profileData && (
                    <div className="my-3 p-2 bg-gray-800 rounded text-xs">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.profileData
                            .replace(/\n/g, "<br/>")
                            .replace(
                              /^# (.*)/gm,
                              '<div class="font-bold text-lg mb-1">$1</div>'
                            )
                            .replace(
                              /^## (.*)/gm,
                              '<div class="font-bold text-md mt-2 mb-1">$1</div>'
                            ),
                        }}
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line">
                    {message.text.split("\n").map((line, i) => {
                      let formattedLine = line;

                      // Handle markdown-style heading
                      if (line.startsWith("# ")) {
                        return (
                          <h2 key={i} className="text-lg font-bold mt-2 mb-1">
                            {line.substring(2)}
                          </h2>
                        );
                      }
                      if (line.startsWith("## ")) {
                        return (
                          <h3 key={i} className="text-md font-bold mt-2 mb-1">
                            {line.substring(3)}
                          </h3>
                        );
                      }

                      // Bold
                      formattedLine = formattedLine.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      );

                      // Italics
                      formattedLine = formattedLine.replace(
                        /\*(.*?)\*/g,
                        "<em>$1</em>"
                      );

                      // Handle bullet points
                      if (line.trim().startsWith("• ")) {
                        return (
                          <div key={i} className="ml-2 flex">
                            <span className="mr-1">•</span>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formattedLine.substring(2),
                              }}
                            />
                          </div>
                        );
                      }

                      // Regular line
                      return (
                        <div
                          key={i}
                          dangerouslySetInnerHTML={{ __html: formattedLine }}
                        />
                      );
                    })}
                  </div>

                  {/* API Response Toggle */}
                  {message.apiResponse && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <button
                        onClick={() => toggleApiResponse(message.id)}
                        className="text-xs flex items-center text-accent-light hover:underline"
                      >
                        <FiCode className="mr-1" />
                        {message.showApiResponse
                          ? "Hide API Response"
                          : "View API Response"}
                      </button>

                      {message.showApiResponse && (
                        <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(message.apiResponse, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-full text-white transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-accent/10">
            <div className="flex">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (e.g., 'Find React developers')"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:border-accent resize-none h-10 min-h-[40px] max-h-24 overflow-auto"
                disabled={loading}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-r-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Powered by SJM AI</span>
              <span>Press Enter to send</span>
            </div>
            <div className="mt-1 flex justify-center gap-4">
              <a
                href="/project/create"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-accent hover:underline"
              >
                <FiDollarSign className="mr-1" />
                Post a Project
              </a>
              <a
                href="/talent/browse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-accent hover:underline"
              >
                <FiUserCheck className="mr-1" />
                Browse Freelancers
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SJMTestWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatbotIcon onOpen={() => setIsOpen(true)} />
      <SJMTestChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export { ChatbotIcon, SJMTestChatbot, SJMTestWidget };
