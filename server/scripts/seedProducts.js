import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import FinancialProduct from "../src/models/FinancialProduct.js";

await connectDB(process.env.MONGO_URI);
await FinancialProduct.deleteMany({ isDemo: true });
await FinancialProduct.insertMany([
  { name: "Illustrative Bank Fixed Deposit", provider: "Demo Bank", category: "fixed_deposit", description: "Sample catalogue entry. Not an actual offer or current rate.", indicativeRateMin: 6.0, indicativeRateMax: 7.5, isDemo: true },
  { name: "Illustrative Savings Account", provider: "Demo Bank", category: "savings", description: "Sample savings account catalogue entry.", indicativeRateMin: 2.5, indicativeRateMax: 4.0, isDemo: true },
  { name: "Illustrative Index Mutual Fund", provider: "Demo AMC", category: "mutual_fund", description: "Example fund category entry. Returns are market-linked and not guaranteed.", isDemo: true },
  { name: "Illustrative Government Bond", provider: "Government of India (example)", category: "bond", description: "Example fixed-income product category entry.", isDemo: true },
  { name: "Illustrative Education Loan", provider: "Demo Lender", category: "loan", description: "Sample loan catalogue entry. Check lender terms and eligibility.", indicativeRateMin: 8.0, indicativeRateMax: 12.0, isDemo: true }
]);
console.log("Demo catalogue seeded");
await mongoose.disconnect();
