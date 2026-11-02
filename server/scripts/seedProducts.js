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
  { name: "Illustrative Education Loan", provider: "Demo Lender", category: "loan", description: "Sample loan catalogue entry. Check lender terms and eligibility.", indicativeRateMin: 8.0, indicativeRateMax: 12.0, isDemo: true },
  { name: "Student Basic Savings Account", provider: "Illustrative Bank", category: "savings", description: "Student-focused account example. Check age limits, minimum balance, fees, debit-card charges, and required documents with a bank.", isStudentFocused: true, isDemo: true },
  { name: "Higher Education Loan", provider: "Illustrative Education Lender", category: "loan", description: "Compare tuition and living-cost coverage, interest type, co-applicant or collateral rules, study-period moratorium, fees, and repayment terms. Eligibility varies by lender and course.", isStudentFocused: true, isDemo: true },
  { name: "Scholarships and Fee Assistance", provider: "Government and institution programmes (examples)", category: "government_scheme", description: "Explore central and state scholarship programmes and your institution's fee-assistance office. Eligibility, deadlines, documents, and renewal conditions vary; verify through official sources.", isStudentFocused: true, isDemo: true },
  { name: "Student Emergency Savings Plan", provider: "Illustrative Savings Goal", category: "savings", description: "An example savings option for building a small emergency buffer for books, travel, or unexpected costs. Compare access, withdrawal rules, and fees before choosing an account.", isStudentFocused: true, isDemo: true },
  { name: "Long-Term Student Investment Starter", provider: "Illustrative Mutual Fund", category: "mutual_fund", description: "An educational example for learning about diversified, market-linked investing over a long horizon. Returns are not guaranteed; investments can lose value. Keep tuition and emergency money accessible and consider your risk tolerance.", isStudentFocused: true, isDemo: true }
]);
console.log("Demo catalogue seeded");
await mongoose.disconnect();
