import { createPool } from "mysql2/promise";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import crypto from "crypto";

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "snapjobs_db",
});

// Function to generate a secure API key
function generateSecureApiKey(planType) {
  const randomBytes = crypto.randomBytes(32);
  const randomStr = randomBytes.toString("hex");
  const suffix = crypto.randomBytes(4).toString("hex");

  let prefix;
  switch (planType) {
    case "free":
      prefix = "sjm_fr";
      break;
    case "pro":
      prefix = "sjm_pr";
      break;
    case "enterprise":
      prefix = "sjm_ent";
      break;
    default:
      throw new Error("Invalid plan type");
  }

  return `${prefix}_${randomStr}_${suffix}`;
}

function encryptApiKey(apiKey) {
  const algorithm = "aes-256-gcm";
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encryptedKey: encrypted,
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
  };
}

function decryptApiKey(encryptedKey, iv, authTag) {
  try {
    const algorithm = "aes-256-gcm";
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedKey, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [userRows] = await connection.query(
        "SELECT id, plan_type FROM users WHERE email = ? FOR UPDATE",
        [session.user.email]
      );

      if (!userRows.length) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ error: "User not found" });
      }

      const userId = userRows[0].id;
      const userPlanType = userRows[0].plan_type || "free";
      const planLimits = {
        free: 1,
        pro: 3,
        enterprise: 10,
      };

      switch (req.method) {
        case "GET":
          // Only return minimal info, no decrypted keys
          const [keys] = await connection.query(
            `SELECT 
              id, 
              created_at as createdAt,
              is_active as isActive, 
              revealed,
              revealed_at as revealedAt,
              last_used_at as lastUsedAt,
              plan_type
            FROM api_keys 
            WHERE user_id = ? 
            ORDER BY created_at DESC`,
            [userId]
          );
          await connection.commit();
          connection.release();
          return res.status(200).json({ keys });

        case "POST":
          const { action, keyId } = req.body;

          switch (action) {
            case "reveal":
              const [keyRows] = await connection.query(
                `SELECT api_key, iv, auth_tag, reveal_count 
                FROM api_keys 
                WHERE id = ? AND user_id = ?`,
                [keyId, userId]
              );

              if (!keyRows.length) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ error: "API key not found" });
              }

              if (keyRows[0].reveal_count > 0) {
                await connection.rollback();
                connection.release();
                return res.status(403).json({
                  error:
                    "This API key has already been revealed and can't be shown again for security reasons",
                });
              }

              // Decrypt the key for revealing
              const decryptedKey = decryptApiKey(
                keyRows[0].api_key,
                keyRows[0].iv,
                keyRows[0].auth_tag
              );

              if (!decryptedKey) {
                await connection.rollback();
                connection.release();
                return res
                  .status(500)
                  .json({ error: "Error revealing API key" });
              }

              await connection.query(
                `UPDATE api_keys 
                SET revealed = TRUE, 
                    revealed_at = CURRENT_TIMESTAMP, 
                    reveal_count = reveal_count + 1 
                WHERE id = ?`,
                [keyId]
              );

              await connection.commit();
              connection.release();
              return res.status(200).json({
                key: decryptedKey,
                message:
                  "⚠️ WARNING: This API key will only be shown ONCE. Copy it now and store it securely!",
              });

            case "toggle":
              await connection.query(
                "UPDATE api_keys SET is_active = NOT is_active WHERE id = ? AND user_id = ?",
                [keyId, userId]
              );
              await connection.commit();
              connection.release();
              return res
                .status(200)
                .json({ message: "API key status updated" });

            case "revoke":
              await connection.query(
                "DELETE FROM api_keys WHERE id = ? AND user_id = ?",
                [keyId, userId]
              );
              await connection.commit();
              connection.release();
              return res.status(200).json({ message: "API key revoked" });

            default:
              const [keyCount] = await connection.query(
                "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ? AND is_active = TRUE",
                [userId]
              );

              if (keyCount[0].count >= planLimits[userPlanType]) {
                await connection.rollback();
                connection.release();
                return res.status(403).json({
                  error: `You have reached the limit of ${
                    planLimits[userPlanType]
                  } API key${
                    planLimits[userPlanType] === 1 ? "" : "s"
                  } for your ${userPlanType} plan.`,
                });
              }

              // Generate and encrypt new key
              const apiKey = generateSecureApiKey(userPlanType);
              const encryptedData = encryptApiKey(apiKey);

              // Map full plan types to short codes
              const PLAN_TYPE_CODES = {
                free: "fr",
                pro: "pr",
                enterprise: "ent",
              };

              // Save encrypted key
              const [result] = await connection.query(
                `INSERT INTO api_keys (
                  user_id, 
                  api_key,
                  iv, 
                  auth_tag,
                  is_active,
                  revealed,
                  plan_type,
                  created_at,
                  last_used_at
                ) VALUES (?, ?, ?, ?, TRUE, FALSE, ?, NOW(), NOW())`,
                [
                  userId,
                  encryptedData.encryptedKey,
                  encryptedData.iv,
                  encryptedData.tag,
                  PLAN_TYPE_CODES[userPlanType],
                ]
              );

              await connection.commit();
              connection.release();
              return res.status(200).json({
                key: {
                  id: result.insertId,
                  value: apiKey, // Show original API key only on creation
                  createdAt: new Date(),
                  isActive: true,
                  revealed: false,
                },
                message: "Store this API key safely. It won't be shown again.",
              });
          }

        default:
          await connection.rollback();
          connection.release();
          return res.status(405).json({ error: "Method not allowed" });
      }
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
