export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { endpoint, method, params } = req.body;

  // Simulate API response
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Example response data
  const responses = {
    "/api/match": {
      matches: [
        {
          id: "freelancer_123",
          name: "John Doe",
          matchScore: 0.95,
          skills: ["React", "Node.js"],
          hourlyRate: 50,
          availability: "Within 1 week",
        },
        {
          id: "freelancer_124",
          name: "Jane Smith",
          matchScore: 0.92,
          skills: ["React Native", "JavaScript"],
          hourlyRate: 45,
          availability: "Immediate",
        },
      ],
      metadata: {
        totalMatches: 2,
        processingTime: "0.23s",
        aiConfidence: 0.97,
      },
    },
  };

  res.status(200).json(responses[endpoint] || { error: "Endpoint not found" });
}
