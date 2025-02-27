import { createPool } from "mysql2/promise";

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch plans with their features
    const [plans] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(pf.feature ORDER BY pf.feature_order) as features
      FROM plans p
      LEFT JOIN plan_features pf ON p.id = pf.plan_id
      GROUP BY p.id
      ORDER BY p.price ASC
    `);

    // Format the plans data
    const formattedPlans = plans.map((plan) => ({
      name: plan.name,
      code: plan.code,
      price: `$${plan.price}`,
      period: `/${plan.billing_period}`,
      features: plan.features.split(","),
      priceId: plan.stripe_price_id,
      color: `from-${plan.color_from} to-${plan.color_to}`,
      recommended: plan.is_recommended === 1,
      apiKeyLimit: plan.api_key_limit,
      requestLimit: plan.request_limit,
    }));

    return res.status(200).json({ plans: formattedPlans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
