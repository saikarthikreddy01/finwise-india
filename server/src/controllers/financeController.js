import mongoose from "mongoose";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import Goal from "../models/Goal.js";
import FinancialProduct from "../models/FinancialProduct.js";

export async function listAccounts(req, res) {
  res.json(await Account.find({ userId: req.user._id }).sort({ createdAt: -1 }));
}
export async function createAccount(req, res) {
  const { name, type, openingBalance } = req.body;
  if (!name) return res.status(400).json({ message: "Account name is required" });
  const balance = Number(openingBalance || 0);
  if (!Number.isFinite(balance) || balance < 0) return res.status(400).json({ message: "Opening balance must be non-negative" });
  const account = await Account.create({ userId: req.user._id, name, type, openingBalancePaise: Math.round(balance * 100) });
  res.status(201).json(account);
}
export async function listTransactions(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const filter = { userId: req.user._id };
  if (["income", "expense", "transfer"].includes(req.query.type)) filter.type = req.query.type;
  if (req.query.from || req.query.to) {
    filter.transactionDate = {};
    if (req.query.from) filter.transactionDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.transactionDate.$lte = new Date(req.query.to);
  }
  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ transactionDate: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter)
  ]);
  res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
}
export async function createTransaction(req, res) {
  const { accountId, type, amount, category, description, transactionDate } = req.body;
  if (!mongoose.isValidObjectId(accountId)) return res.status(400).json({ message: "Valid accountId is required" });
  if (!["income", "expense", "transfer"].includes(type)) return res.status(400).json({ message: "Invalid transaction type" });
  const rupees = Number(amount);
  if (!Number.isFinite(rupees) || rupees <= 0 || !Number.isSafeInteger(Math.round(rupees * 100))) return res.status(400).json({ message: "Amount must be a positive valid INR amount" });
  const account = await Account.findOne({ _id: accountId, userId: req.user._id });
  if (!account) return res.status(404).json({ message: "Account not found" });
  const date = transactionDate ? new Date(transactionDate) : new Date();
  if (Number.isNaN(date.getTime())) return res.status(400).json({ message: "Invalid transaction date" });
  const transaction = await Transaction.create({
    userId: req.user._id, accountId, type, amountPaise: Math.round(rupees * 100),
    category: category || "Other", description: description || "", transactionDate: date
  });
  res.status(201).json(transaction);
}
export async function deleteTransaction(req, res) {
  const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Transaction not found" });
  res.json({ message: "Transaction deleted" });
}
export async function listBudgets(req, res) {
  res.json(await Budget.find({ userId: req.user._id }).sort({ month: -1 }));
}
export async function createBudget(req, res) {
  const { category, limit, month } = req.body;
  const amount = Number(limit);
  if (!category || !/^\d{4}-\d{2}$/.test(month || "") || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Category, YYYY-MM month and positive limit are required" });
  }
  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, category, month },
    { $set: { limitPaise: Math.round(amount * 100) } },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(201).json(budget);
}
export async function listGoals(req, res) {
  res.json(await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 }));
}
export async function createGoal(req, res) {
  const { name, targetAmount, currentAmount, targetDate, category } = req.body;
  const target = Number(targetAmount);
  const current = Number(currentAmount || 0);
  if (!name || !Number.isFinite(target) || target <= 0 || !Number.isFinite(current) || current < 0) {
    return res.status(400).json({ message: "Goal name and valid target/current amounts are required" });
  }
  const goal = await Goal.create({
    userId: req.user._id, name, targetPaise: Math.round(target * 100),
    currentPaise: Math.round(current * 100), targetDate: targetDate ? new Date(targetDate) : undefined,
    category: category || "General"
  });
  res.status(201).json(goal);
}
export async function dashboardOverview(req, res) {
  const userId = req.user._id;
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const [accounts, totals, recent, goals] = await Promise.all([
    Account.find({ userId }),
    Transaction.aggregate([
      { $match: { userId, transactionDate: { $gte: start }, type: { $in: ["income", "expense"] } } },
      { $group: { _id: "$type", total: { $sum: "$amountPaise" } } }
    ]),
    Transaction.find({ userId }).sort({ transactionDate: -1 }).limit(6).populate("accountId", "name"),
    Goal.find({ userId, status: "active" }).limit(5)
  ]);
  const income = totals.find(x => x._id === "income")?.total || 0;
  const expenses = totals.find(x => x._id === "expense")?.total || 0;
  res.json({
    accountCount: accounts.length,
    currentMonthIncome: income / 100,
    currentMonthExpenses: expenses / 100,
    currentMonthNet: (income - expenses) / 100,
    recentTransactions: recent,
    goals
  });
}
export async function listProducts(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) filter.$or = [
    { name: { $regex: String(req.query.q), $options: "i" } },
    { provider: { $regex: String(req.query.q), $options: "i" } }
  ];
  res.json(await FinancialProduct.find(filter).sort({ category: 1, name: 1 }).limit(100));
}
