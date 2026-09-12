---
title: "AWS Pricing Speedrun: Guess the Bill Before It Guesses You"
tags: [javascript, games, aws, cloud, pricing]
excerpt: A game where you guess AWS monthly costs. You'll be wrong. The architectures are real. The prices are educational. Your finance team's disappointment is immeasurable.
---

Every month, somewhere in the world, a developer opens their AWS bill and whispers "how." This game simulates that experience, but as entertainment.

You'll see an architecture. You guess the monthly cost. You learn that everything costs more than you think, especially if it involves data transfer.

## The Game

Guess the monthly AWS cost. Closest estimate wins points. Being exactly right is suspicious and will be reported to FinOps.

**Features:** 💰 Real-ish pricing • 🏗️ Absurd architectures • 🌙 Dark mode • 🏆 Achievements • 📊 Track your optimism bias

<div id="game-wrapper" style="padding: 40px 20px; border-radius: 20px; margin: 20px 0; box-shadow: 0 20px 60px rgba(0,0,0,0.3); transition: background 0.5s ease; background: linear-gradient(135deg, #232f3e 0%, #1a252f 100%);">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
#pricing-game {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Space Grotesk', sans-serif;
  color: #e0e0e0;
}

#particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-header h2 {
  color: #ff9900;
  margin: 0 0 10px 0;
  font-size: 1.8em;
}

.game-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  font-size: 0.9em;
  background: rgba(255, 153, 0, 0.2);
  color: #ff9900;
  border: 2px solid rgba(255, 153, 0, 0.4);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 153, 0, 0.3);
  border-color: #ff9900;
  transform: translateY(-2px);
}

.control-btn.active {
  background: #ff9900;
  color: #232f3e;
  border-color: #ff9900;
}

#architecture-card {
  background: linear-gradient(145deg, #2d3a4a, #1e2833);
  border-radius: 16px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 153, 0, 0.2);
}

.architecture-title {
  font-size: 1.4em;
  font-weight: 700;
  color: #ff9900;
  margin-bottom: 15px;
  text-align: center;
}

.architecture-description {
  font-size: 1.1em;
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 20px;
  text-align: center;
}

.architecture-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.spec-item {
  background: rgba(255, 153, 0, 0.1);
  padding: 12px 15px;
  border-radius: 10px;
  border-left: 3px solid #ff9900;
}

.spec-label {
  font-size: 0.8em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spec-value {
  font-size: 1.1em;
  font-weight: 600;
  color: #e0e0e0;
  font-family: 'JetBrains Mono', monospace;
}

#guess-section {
  margin: 30px 0;
  text-align: center;
}

.guess-label {
  font-size: 1.2em;
  color: #ff9900;
  margin-bottom: 15px;
  font-weight: 600;
}

.guess-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.currency-symbol {
  font-size: 2em;
  color: #ff9900;
  font-weight: 700;
}

#guess-input {
  width: 200px;
  padding: 15px 20px;
  font-size: 2em;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(255, 153, 0, 0.4);
  border-radius: 12px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
}

#guess-input:focus {
  border-color: #ff9900;
  background: rgba(255, 255, 255, 0.15);
}

#guess-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.per-month {
  font-size: 1.2em;
  color: #888;
}

#submit-btn {
  padding: 15px 40px;
  font-size: 1.2em;
  background: linear-gradient(145deg, #ff9900, #e68a00);
  color: #232f3e;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

#submit-btn:hover:not(:disabled) {
  background: linear-gradient(145deg, #ffaa22, #ff9900);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 153, 0, 0.3);
}

#submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

#result-section {
  display: none;
  margin: 30px 0;
  text-align: center;
}

#result-section.visible {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 20px;
}

.result-header.good {
  color: #10b981;
}

.result-header.okay {
  color: #f59e0b;
}

.result-header.bad {
  color: #ef4444;
}

.price-comparison {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.price-box {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  min-width: 150px;
}

.price-box-label {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 8px;
}

.price-box-value {
  font-size: 2em;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.your-guess .price-box-value {
  color: #3b82f6;
}

.actual-price .price-box-value {
  color: #ff9900;
}

.difference {
  font-size: 1.2em;
  margin: 20px 0;
  color: #888;
}

.breakdown {
  margin-top: 25px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
}

.breakdown-title {
  font-size: 1em;
  color: #ff9900;
  margin-bottom: 15px;
  font-weight: 600;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-service {
  color: #b0b0b0;
}

.breakdown-cost {
  color: #ff9900;
}

#stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin: 30px 0;
}

.stat {
  padding: 15px;
  background: rgba(255, 153, 0, 0.1);
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 0.75em;
  color: #ff9900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5em;
  font-weight: 700;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
}

#next-btn {
  padding: 15px 40px;
  font-size: 1.2em;
  background: linear-gradient(145deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s ease;
  margin-top: 20px;
}

#next-btn:hover {
  background: linear-gradient(145deg, #059669, #047857);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

#achievement-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(145deg, #ffd700, #ffaa00);
  color: #232f3e;
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 700;
  z-index: 10001;
  animation: slideIn 0.5s ease, slideOut 0.5s ease 2.5s forwards;
  display: none;
}

#achievement-popup.visible {
  display: block;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

.difficulty-indicator {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  margin-bottom: 10px;
}

.difficulty-easy { background: #10b981; color: white; }
.difficulty-medium { background: #f59e0b; color: white; }
.difficulty-hard { background: #ef4444; color: white; }
.difficulty-nightmare { background: #7c3aed; color: white; }

.snarky-comment {
  font-style: italic;
  color: #888;
  margin-top: 15px;
  font-size: 0.95em;
}

@media (max-width: 600px) {
  #guess-input {
    width: 150px;
    font-size: 1.5em;
  }

  .currency-symbol {
    font-size: 1.5em;
  }

  .price-comparison {
    gap: 20px;
  }

  .price-box-value {
    font-size: 1.5em;
  }
}
</style>

<canvas id="particles-canvas"></canvas>

<div id="pricing-game">
  <div class="game-header">
    <h2>AWS Pricing Speedrun</h2>
    <p>How well do you know the cost of cloud regret?</p>
  </div>

  <div class="game-controls">
    <button class="control-btn" id="sound-btn">🔊 Sound: ON</button>
  </div>

  <div id="architecture-card">
    <div class="difficulty-indicator" id="difficulty-badge">Loading...</div>
    <div class="architecture-title" id="arch-title">Loading architecture...</div>
    <div class="architecture-description" id="arch-description"></div>
    <div class="architecture-specs" id="arch-specs"></div>
    <div class="snarky-comment" id="snarky-comment"></div>
  </div>

  <div id="guess-section">
    <div class="guess-label">Your estimate for monthly cost:</div>
    <div class="guess-input-container">
      <span class="currency-symbol">$</span>
      <input type="number" id="guess-input" placeholder="0" min="0" step="1">
      <span class="per-month">/mo</span>
    </div>
    <button id="submit-btn">Lock In Guess</button>
  </div>

  <div id="result-section">
    <div class="result-header" id="result-header"></div>
    <div class="price-comparison">
      <div class="price-box your-guess">
        <div class="price-box-label">Your Guess</div>
        <div class="price-box-value" id="your-guess-display">$0</div>
      </div>
      <div class="price-box actual-price">
        <div class="price-box-label">Actual Cost</div>
        <div class="price-box-value" id="actual-price-display">$0</div>
      </div>
    </div>
    <div class="difference" id="difference-text"></div>
    <div class="breakdown" id="breakdown"></div>
    <button id="next-btn">Next Architecture →</button>
  </div>

  <div id="stats">
    <div class="stat">
      <div class="stat-label">Round</div>
      <div class="stat-value" id="round-num">1</div>
    </div>
    <div class="stat">
      <div class="stat-label">Score</div>
      <div class="stat-value" id="score">0</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Off By</div>
      <div class="stat-value" id="avg-error">--</div>
    </div>
    <div class="stat">
      <div class="stat-label">Best Guess</div>
      <div class="stat-value" id="best-guess">--</div>
    </div>
  </div>
</div>

<div id="achievement-popup"></div>

<script>
const ARCHITECTURES = [
  {
    title: "The 'Hello World' Startup",
    description: "A single EC2 instance running a landing page that gets 100 visitors per month.",
    difficulty: "easy",
    specs: [
      { label: "Compute", value: "1x t3.micro EC2" },
      { label: "Storage", value: "20GB EBS gp3" },
      { label: "Traffic", value: "~5GB/month out" }
    ],
    breakdown: [
      { service: "EC2 t3.micro (750hrs)", cost: 7.59 },
      { service: "EBS gp3 20GB", cost: 1.60 },
      { service: "Data transfer out", cost: 0.45 }
    ],
    total: 9.64,
    snarky: "The only cheap thing you'll see today. Enjoy it."
  },
  {
    title: "The Overengineered Blog",
    description: "A personal blog that could handle Netflix traffic but serves 50 readers.",
    difficulty: "medium",
    specs: [
      { label: "Compute", value: "ECS Fargate (2 tasks)" },
      { label: "Database", value: "RDS PostgreSQL db.t3.small" },
      { label: "CDN", value: "CloudFront" },
      { label: "Storage", value: "S3 for images" }
    ],
    breakdown: [
      { service: "Fargate (2 tasks, 0.5vCPU, 1GB)", cost: 29.55 },
      { service: "RDS db.t3.small", cost: 24.82 },
      { service: "RDS storage 20GB", cost: 2.30 },
      { service: "CloudFront (minimal)", cost: 1.00 },
      { service: "S3 storage + requests", cost: 0.50 },
      { service: "NAT Gateway", cost: 32.85 }
    ],
    total: 91.02,
    snarky: "The NAT Gateway costs more than the content is worth."
  },
  {
    title: "The 'We Need Kubernetes' Incident",
    description: "A CRUD app that definitely needed a managed Kubernetes cluster.",
    difficulty: "medium",
    specs: [
      { label: "Orchestration", value: "EKS cluster" },
      { label: "Nodes", value: "3x t3.medium" },
      { label: "Database", value: "RDS MySQL db.t3.medium" },
      { label: "Load Balancer", value: "ALB" }
    ],
    breakdown: [
      { service: "EKS cluster", cost: 73.00 },
      { service: "EC2 t3.medium x3", cost: 90.72 },
      { service: "RDS db.t3.medium", cost: 49.64 },
      { service: "ALB + LCU", cost: 22.27 },
      { service: "EBS volumes", cost: 12.00 },
      { service: "Data transfer", cost: 8.50 }
    ],
    total: 256.13,
    snarky: "You could've used a single Lambda. But here we are."
  },
  {
    title: "The Compliance Nightmare",
    description: "HIPAA-compliant setup that makes auditors happy and CFOs cry.",
    difficulty: "hard",
    specs: [
      { label: "Compute", value: "3x m5.large (multi-AZ)" },
      { label: "Database", value: "RDS Aurora PostgreSQL" },
      { label: "Security", value: "WAF, GuardDuty, Config" },
      { label: "Logging", value: "CloudWatch + CloudTrail" }
    ],
    breakdown: [
      { service: "EC2 m5.large x3", cost: 207.36 },
      { service: "Aurora PostgreSQL (2 ACU min)", cost: 175.20 },
      { service: "WAF (rules + requests)", cost: 31.00 },
      { service: "GuardDuty", cost: 35.00 },
      { service: "AWS Config", cost: 24.00 },
      { service: "CloudWatch Logs (50GB)", cost: 25.00 },
      { service: "CloudTrail", cost: 2.00 },
      { service: "Secrets Manager", cost: 4.80 },
      { service: "ALB + NAT Gateway", cost: 67.00 }
    ],
    total: 571.36,
    snarky: "Security isn't cheap. Neither is the therapy after the audit."
  },
  {
    title: "The Data Lake That Became an Ocean",
    description: "Started as 'just a few CSV files' and evolved into a monster.",
    difficulty: "hard",
    specs: [
      { label: "Storage", value: "S3 (5TB)" },
      { label: "Processing", value: "Glue ETL jobs" },
      { label: "Query", value: "Athena" },
      { label: "Catalog", value: "Glue Data Catalog" }
    ],
    breakdown: [
      { service: "S3 storage (5TB)", cost: 115.00 },
      { service: "S3 requests (heavy)", cost: 45.00 },
      { service: "Glue ETL (100 DPU-hrs)", cost: 44.00 },
      { service: "Glue Crawlers", cost: 15.40 },
      { service: "Athena queries (500GB scanned)", cost: 2.50 },
      { service: "Data transfer", cost: 22.00 }
    ],
    total: 243.90,
    snarky: "Nobody partitioned the data. Classic."
  },
  {
    title: "The Machine Learning Experiment",
    description: "Training a model to predict churn. The only churn is your budget.",
    difficulty: "hard",
    specs: [
      { label: "Training", value: "SageMaker ml.p3.2xlarge" },
      { label: "Inference", value: "SageMaker endpoint" },
      { label: "Storage", value: "S3 (training data)" },
      { label: "Notebooks", value: "SageMaker Studio" }
    ],
    breakdown: [
      { service: "Training (40hrs p3.2xlarge)", cost: 122.40 },
      { service: "Inference endpoint (ml.t2.medium)", cost: 37.23 },
      { service: "SageMaker Studio", cost: 43.80 },
      { service: "S3 storage + transfer", cost: 18.00 },
      { service: "ECR for containers", cost: 3.00 }
    ],
    total: 224.43,
    snarky: "The model achieved 60% accuracy. A coin flip was free."
  },
  {
    title: "The Serverless Utopia",
    description: "100% serverless. Zero servers. Several existential crises about cold starts.",
    difficulty: "medium",
    specs: [
      { label: "Compute", value: "Lambda (1M invocations)" },
      { label: "API", value: "API Gateway" },
      { label: "Database", value: "DynamoDB (on-demand)" },
      { label: "Auth", value: "Cognito" }
    ],
    breakdown: [
      { service: "Lambda (1M req, 512MB, 1s avg)", cost: 8.73 },
      { service: "API Gateway (1M requests)", cost: 3.50 },
      { service: "DynamoDB (5M reads, 1M writes)", cost: 2.50 },
      { service: "Cognito (1000 MAU)", cost: 0.00 },
      { service: "CloudWatch Logs", cost: 2.50 },
      { service: "X-Ray tracing", cost: 5.00 }
    ],
    total: 22.23,
    snarky: "Serverless is cheap until you need to debug it in production."
  },
  {
    title: "The Multi-Region Paranoia",
    description: "Active-active across 3 regions because someone watched a re:Invent talk.",
    difficulty: "nightmare",
    specs: [
      { label: "Regions", value: "us-east-1, eu-west-1, ap-southeast-1" },
      { label: "Compute", value: "3x ECS clusters" },
      { label: "Database", value: "Aurora Global Database" },
      { label: "CDN", value: "CloudFront + Route 53" }
    ],
    breakdown: [
      { service: "ECS Fargate (3 regions)", cost: 266.40 },
      { service: "Aurora Global (primary + 2 replicas)", cost: 438.00 },
      { service: "ALB x3", cost: 48.60 },
      { service: "NAT Gateway x3", cost: 98.55 },
      { service: "Cross-region data transfer", cost: 180.00 },
      { service: "Route 53 health checks", cost: 15.00 },
      { service: "CloudFront", cost: 25.00 }
    ],
    total: 1071.55,
    snarky: "99.99% uptime. 0.01% budget remaining."
  },
  {
    title: "The Real-Time Analytics Pipeline",
    description: "Kinesis streams feeding Elasticsearch for dashboards nobody checks.",
    difficulty: "hard",
    specs: [
      { label: "Ingestion", value: "Kinesis Data Streams (2 shards)" },
      { label: "Processing", value: "Lambda consumers" },
      { label: "Search", value: "OpenSearch (3 nodes)" },
      { label: "Visualization", value: "OpenSearch Dashboards" }
    ],
    breakdown: [
      { service: "Kinesis (2 shards, 24hr retention)", cost: 36.79 },
      { service: "Lambda (5M invocations)", cost: 10.00 },
      { service: "OpenSearch (3x m5.large)", cost: 245.28 },
      { service: "OpenSearch storage (500GB)", cost: 57.50 },
      { service: "Data transfer", cost: 12.00 }
    ],
    total: 361.57,
    snarky: "The dashboards auto-refresh every 5 seconds. Nobody's watching."
  },
  {
    title: "The Legacy Migration",
    description: "Lift and shift of a 15-year-old monolith. It works. Nobody knows why.",
    difficulty: "nightmare",
    specs: [
      { label: "Compute", value: "2x r5.2xlarge EC2" },
      { label: "Database", value: "RDS Oracle (BYOL)" },
      { label: "Storage", value: "500GB EBS io2" },
      { label: "Networking", value: "Direct Connect" }
    ],
    breakdown: [
      { service: "EC2 r5.2xlarge x2", cost: 735.84 },
      { service: "RDS Oracle db.r5.2xlarge", cost: 1109.52 },
      { service: "EBS io2 500GB (16000 IOPS)", cost: 1102.50 },
      { service: "Direct Connect (1Gbps)", cost: 220.00 },
      { service: "Data transfer", cost: 85.00 },
      { service: "Elastic IP", cost: 3.60 }
    ],
    total: 3256.46,
    snarky: "Oracle licensing not included. The io2 IOPS pricing is the real horror story."
  },
  {
    title: "The Startup MVP",
    description: "Three founders, two weeks runway, infinite optimism.",
    difficulty: "easy",
    specs: [
      { label: "Backend", value: "Lambda + API Gateway" },
      { label: "Frontend", value: "S3 + CloudFront" },
      { label: "Database", value: "DynamoDB (free tier)" },
      { label: "Auth", value: "Cognito (free tier)" }
    ],
    breakdown: [
      { service: "Lambda (100k invocations)", cost: 0.00 },
      { service: "API Gateway (100k requests)", cost: 0.35 },
      { service: "S3 hosting", cost: 0.50 },
      { service: "CloudFront", cost: 1.00 },
      { service: "DynamoDB (free tier)", cost: 0.00 },
      { service: "Route 53 hosted zone", cost: 0.50 }
    ],
    total: 2.35,
    snarky: "Enjoy it while the free tier lasts."
  },
  {
    title: "The Video Streaming Platform",
    description: "Like Netflix, but for 500 users and a Series B that's not coming.",
    difficulty: "nightmare",
    specs: [
      { label: "Transcoding", value: "MediaConvert (100hrs)" },
      { label: "Storage", value: "S3 (10TB video)" },
      { label: "Delivery", value: "CloudFront (50TB out)" },
      { label: "Origin", value: "MediaPackage" }
    ],
    breakdown: [
      { service: "MediaConvert (100hrs SD)", cost: 150.00 },
      { service: "S3 storage (10TB)", cost: 230.00 },
      { service: "CloudFront (50TB)", cost: 4250.00 },
      { service: "MediaPackage", cost: 87.50 },
      { service: "S3 requests", cost: 45.00 }
    ],
    total: 4762.50,
    snarky: "The CloudFront bill is 90% of this. Always is."
  },
  {
    title: "The IoT Fleet",
    description: "10,000 devices sending telemetry. Half are thermostats. Half are mysteries.",
    difficulty: "hard",
    specs: [
      { label: "Connectivity", value: "IoT Core (10k devices)" },
      { label: "Messages", value: "50M messages/month" },
      { label: "Rules", value: "IoT Rules to Kinesis" },
      { label: "Storage", value: "Timestream" }
    ],
    breakdown: [
      { service: "IoT Core connectivity", cost: 80.00 },
      { service: "IoT messages (50M)", cost: 50.00 },
      { service: "IoT Rules actions", cost: 7.50 },
      { service: "Kinesis (1 shard)", cost: 18.40 },
      { service: "Timestream writes", cost: 25.00 },
      { service: "Timestream queries", cost: 35.00 },
      { service: "Lambda processing", cost: 12.00 }
    ],
    total: 227.90,
    snarky: "Nobody knows what half these devices are measuring."
  },
  {
    title: "The CI/CD Pipeline of Doom",
    description: "Every commit triggers 47 CodeBuild jobs. Most test things nobody changes.",
    difficulty: "medium",
    specs: [
      { label: "Source", value: "CodeCommit" },
      { label: "Build", value: "CodeBuild (500 builds)" },
      { label: "Registry", value: "ECR (20 images)" },
      { label: "Deploy", value: "CodeDeploy to ECS" }
    ],
    breakdown: [
      { service: "CodeCommit (5 users)", cost: 5.00 },
      { service: "CodeBuild (500 builds, small)", cost: 15.00 },
      { service: "ECR storage (50GB)", cost: 5.00 },
      { service: "CodePipeline (2 pipelines)", cost: 2.00 },
      { service: "Artifact storage S3", cost: 1.50 }
    ],
    total: 28.50,
    snarky: "The pipeline takes 45 minutes. The fix was one line."
  },
  {
    title: "The GraphQL Fever Dream",
    description: "AppSync with 100 resolvers. N+1 queries are a feature now.",
    difficulty: "medium",
    specs: [
      { label: "API", value: "AppSync" },
      { label: "Resolvers", value: "Lambda + DynamoDB direct" },
      { label: "Auth", value: "Cognito User Pools" },
      { label: "Real-time", value: "Subscriptions (1k concurrent)" }
    ],
    breakdown: [
      { service: "AppSync queries (5M)", cost: 20.00 },
      { service: "AppSync real-time (1M mins)", cost: 2.00 },
      { service: "Lambda resolvers", cost: 8.00 },
      { service: "DynamoDB", cost: 15.00 },
      { service: "Cognito (5k MAU)", cost: 27.50 }
    ],
    total: 72.50,
    snarky: "The frontend devs are happy. The DBA is not."
  }
];

// Game state
let gameState = {
  currentArchitecture: null,
  round: 1,
  score: 0,
  guesses: [],
  soundEnabled: true
};

// Audio context
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!gameState.soundEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;

  switch(type) {
    case 'submit':
      oscillator.frequency.value = 440;
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    case 'good':
      [523, 659, 784].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
      break;
    case 'bad':
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
  }
}

// Particle system
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() * -10) - 5;
    this.gravity = 0.4;
    this.life = 1;
    this.decay = 0.015;
    this.size = Math.random() * 6 + 2;
    this.color = color || '#ff9900';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    ctx.restore();
  }
}

let particles = [];

function spawnParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function animateParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw(ctx);
    return alive;
  });

  requestAnimationFrame(animateParticles);
}

function getRandomArchitecture() {
  const available = ARCHITECTURES.filter(a =>
    !gameState.guesses.find(g => g.title === a.title)
  );

  if (available.length === 0) {
    gameState.guesses = [];
    return ARCHITECTURES[Math.floor(Math.random() * ARCHITECTURES.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
}

function displayArchitecture(arch) {
  gameState.currentArchitecture = arch;

  const difficultyColors = {
    easy: 'difficulty-easy',
    medium: 'difficulty-medium',
    hard: 'difficulty-hard',
    nightmare: 'difficulty-nightmare'
  };

  document.getElementById('difficulty-badge').className = `difficulty-indicator ${difficultyColors[arch.difficulty]}`;
  document.getElementById('difficulty-badge').textContent = arch.difficulty.toUpperCase();
  document.getElementById('arch-title').textContent = arch.title;
  document.getElementById('arch-description').textContent = arch.description;

  document.getElementById('arch-specs').innerHTML = arch.specs.map(spec => `
    <div class="spec-item">
      <div class="spec-label">${spec.label}</div>
      <div class="spec-value">${spec.value}</div>
    </div>
  `).join('');

  document.getElementById('snarky-comment').textContent = '';

  // Reset UI
  document.getElementById('guess-input').value = '';
  document.getElementById('guess-input').disabled = false;
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('guess-section').style.display = 'block';
  document.getElementById('result-section').classList.remove('visible');
}

function submitGuess() {
  const input = document.getElementById('guess-input');
  const guess = parseFloat(input.value);

  if (isNaN(guess) || guess < 0) {
    input.style.borderColor = '#ef4444';
    setTimeout(() => input.style.borderColor = 'rgba(255, 153, 0, 0.4)', 500);
    return;
  }

  initAudio();
  playSound('submit');

  const arch = gameState.currentArchitecture;
  const actual = arch.total;
  const diff = Math.abs(guess - actual);
  const percentOff = (diff / actual) * 100;

  // Calculate score
  let points = 0;
  let resultClass = '';
  let resultText = '';

  if (percentOff <= 5) {
    points = 100;
    resultClass = 'good';
    resultText = '🎯 Incredible! Are you a FinOps engineer?';
    playSound('good');
  } else if (percentOff <= 15) {
    points = 75;
    resultClass = 'good';
    resultText = '✨ Nice! You actually read the pricing page.';
    playSound('good');
  } else if (percentOff <= 30) {
    points = 50;
    resultClass = 'okay';
    resultText = '😅 Not bad. Close enough for a sprint estimate.';
  } else if (percentOff <= 50) {
    points = 25;
    resultClass = 'okay';
    resultText = '🤔 You tried. The pricing calculator is your friend.';
  } else {
    points = 0;
    resultClass = 'bad';
    resultText = guess < actual ?
      '💸 Way under. Your CFO wants a word.' :
      '📈 Way over. Found the enterprise sales target!';
    playSound('bad');
  }

  gameState.score += points;
  gameState.guesses.push({
    title: arch.title,
    guess: guess,
    actual: actual,
    diff: diff,
    percentOff: percentOff
  });

  // Display results
  document.getElementById('result-header').className = `result-header ${resultClass}`;
  document.getElementById('result-header').textContent = resultText;
  document.getElementById('your-guess-display').textContent = `$${guess.toLocaleString()}`;
  document.getElementById('actual-price-display').textContent = `$${actual.toLocaleString()}`;

  const diffText = guess < actual ?
    `You were $${diff.toFixed(2)} under (${percentOff.toFixed(1)}% off)` :
    `You were $${diff.toFixed(2)} over (${percentOff.toFixed(1)}% off)`;
  document.getElementById('difference-text').textContent = diffText;

  // Show breakdown
  document.getElementById('breakdown').innerHTML = `
    <div class="breakdown-title">Cost Breakdown:</div>
    ${arch.breakdown.map(item => `
      <div class="breakdown-item">
        <span class="breakdown-service">${item.service}</span>
        <span class="breakdown-cost">$${item.cost.toFixed(2)}</span>
      </div>
    `).join('')}
  `;

  document.getElementById('snarky-comment').textContent = arch.snarky;

  // Update stats
  updateStats();

  // Particle celebration for good guesses
  if (percentOff <= 15) {
    const rect = document.getElementById('architecture-card').getBoundingClientRect();
    const colors = ['#ff9900', '#10b981', '#3b82f6', '#ffd700'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        spawnParticles(
          rect.left + Math.random() * rect.width,
          rect.top + rect.height / 2,
          3,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }, i * 20);
    }
  }

  // Check achievements
  checkAchievements(percentOff, guess, actual);

  // Show results
  document.getElementById('guess-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('result-section').classList.add('visible');
}

function updateStats() {
  document.getElementById('round-num').textContent = gameState.round;
  document.getElementById('score').textContent = gameState.score;

  if (gameState.guesses.length > 0) {
    const avgError = gameState.guesses.reduce((sum, g) => sum + g.percentOff, 0) / gameState.guesses.length;
    document.getElementById('avg-error').textContent = `${avgError.toFixed(1)}%`;

    const best = Math.min(...gameState.guesses.map(g => g.percentOff));
    document.getElementById('best-guess').textContent = `${best.toFixed(1)}%`;
  }
}

function nextRound() {
  gameState.round++;
  const arch = getRandomArchitecture();
  displayArchitecture(arch);
}

function checkAchievements(percentOff, guess, actual) {
  const achievements = JSON.parse(localStorage.getItem('aws-pricing-achievements') || '{}');

  // Perfect guess
  if (percentOff <= 1 && !achievements.perfectGuess) {
    achievements.perfectGuess = true;
    showAchievement('🎯 The Oracle - Within 1% of actual cost!');
  }

  // First game
  if (!achievements.firstGame) {
    achievements.firstGame = true;
    showAchievement('💰 Bill Shock - Completed your first estimate!');
  }

  // 10 rounds
  if (gameState.round >= 10 && !achievements.tenRounds) {
    achievements.tenRounds = true;
    showAchievement('📊 Cost Explorer - Completed 10 estimates!');
  }

  // 500 points
  if (gameState.score >= 500 && !achievements.highScore) {
    achievements.highScore = true;
    showAchievement('🏆 FinOps Champion - Reached 500 points!');
  }

  // Way over
  if (guess > actual * 3 && !achievements.wayOver) {
    achievements.wayOver = true;
    showAchievement('📈 Enterprise Pricing - Guessed 3x the actual cost!');
  }

  // Way under
  if (guess < actual * 0.1 && !achievements.wayUnder) {
    achievements.wayUnder = true;
    showAchievement('🆓 Free Tier Dreams - Guessed <10% of actual cost!');
  }

  localStorage.setItem('aws-pricing-achievements', JSON.stringify(achievements));
}

function showAchievement(text) {
  const popup = document.getElementById('achievement-popup');
  popup.textContent = text;
  popup.classList.add('visible');

  setTimeout(() => {
    popup.classList.remove('visible');
  }, 3000);
}

// Event listeners
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('next-btn').addEventListener('click', nextRound);
document.getElementById('sound-btn').addEventListener('click', () => {
  gameState.soundEnabled = !gameState.soundEnabled;
  document.getElementById('sound-btn').textContent = gameState.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
});

document.getElementById('guess-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') submitGuess();
});

// Initialize
animateParticles();
displayArchitecture(getRandomArchitecture());
</script>
</div>

## How It Works

**The Setup:** You see an AWS architecture with specs. Could be a simple EC2 instance. Could be a multi-region disaster waiting to happen.

**The Guess:** Estimate the monthly cost. No calculators. Pure vibes and trauma from previous bills.

**The Scoring:**
- Within 5%: 100 points (impossible, we're watching you)
- Within 15%: 75 points (respectable)
- Within 30%: 50 points (close enough)
- Within 50%: 25 points (participation trophy)
- Over 50% off: 0 points (your CFO is disappointed)

**The Breakdown:** After each guess, see exactly where the money goes. Spoiler: NAT Gateways and data transfer. Always.

## The Lesson

AWS pricing is simple. You just need to understand:
- Per-hour vs per-second billing
- Reserved vs On-Demand vs Spot
- Data transfer in vs out vs between AZs vs between regions
- Provisioned vs On-Demand capacity
- The 47 different EBS volume types
- Why your "serverless" function costs $400/month

See? Simple.

## Why This Game Exists

Because I've watched too many engineers deploy "just a small test cluster" and end up explaining a $12,000 bill to finance.

Because the AWS pricing calculator has more options than a Boeing 747 cockpit.

Because someone needs to normalize the trauma of discovering what NAT Gateway pricing actually is.

---

*Built with Claude Code because manually calculating AWS prices is what the pricing calculator is for, and nobody uses that either.*

*All prices are approximate and based on us-east-1. Your actual bill will be higher. It's always higher.*
