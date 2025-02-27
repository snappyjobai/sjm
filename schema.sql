-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password VARCHAR(255),
    plan_type ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    revealed BOOLEAN DEFAULT FALSE,
    plan_type VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revealed_at TIMESTAMP NULL,
    reveal_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(3) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    billing_period ENUM('monthly', 'yearly') NOT NULL,
    stripe_price_id VARCHAR(100),
    api_key_limit INT NOT NULL,
    request_limit INT NOT NULL,
    is_recommended BOOLEAN DEFAULT FALSE,
    color_from VARCHAR(50) NOT NULL,
    color_to VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Plan Features table
CREATE TABLE IF NOT EXISTS plan_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    feature VARCHAR(255) NOT NULL,
    feature_order INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Insert default plans
INSERT INTO plans (name, code, price, billing_period, stripe_price_id, api_key_limit, request_limit, is_recommended, color_from, color_to) VALUES
('Free', 'fr', 0.00, 'monthly', 'free_plan', 1, 100, FALSE, 'blue-400', 'blue-600'),
('Pro', 'pr', 10.00, 'monthly', 'pro_monthly', 3, 1000, TRUE, 'purple-400', 'purple-600'),
('Enterprise', 'ent', 50.00, 'monthly', 'enterprise_monthly', 10, -1, FALSE, 'accent', 'accent-dark');

-- Insert plan features
INSERT INTO plan_features (plan_id, feature, feature_order) VALUES
(1, '1 API Key', 1),
(1, '100 Requests/Month', 2),
(1, 'Basic Documentation', 3),
(1, 'Community Support', 4),

(2, '3 API Keys', 1),
(2, '1000 Requests/Month', 2),
(2, 'Client Interviews', 3),
(2, 'Priority Support', 4),
(2, 'Advanced Analytics', 5),

(3, 'Unlimited API Keys', 1),
(3, 'Unlimited Requests', 2),
(3, 'Client Interviews', 3),
(3, 'Freelancer Matching', 4),
(3, '24/7 Support', 5),
(3, 'Custom Integration', 6),
(3, 'White Labeling', 7);
