import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import {
  listAccounts, createAccount, listTransactions, createTransaction, deleteTransaction,
  listBudgets, createBudget, listGoals, createGoal, dashboardOverview, listProducts
} from "../controllers/financeController.js";
import { runCalculator } from "../controllers/calculatorController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/health", (req, res) => res.json({ status: "ok", service: "finwise-api" }));

router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.get("/auth/me", requireAuth, asyncHandler(me));
router.post("/auth/logout", requireAuth, (req, res) => res.json({ message: "Logged out. Remove the access token on the client." }));

router.use(requireAuth);
router.get("/accounts", asyncHandler(listAccounts));
router.post("/accounts", asyncHandler(createAccount));
router.get("/transactions", asyncHandler(listTransactions));
router.post("/transactions", asyncHandler(createTransaction));
router.delete("/transactions/:id", asyncHandler(deleteTransaction));
router.get("/budgets", asyncHandler(listBudgets));
router.post("/budgets", asyncHandler(createBudget));
router.get("/goals", asyncHandler(listGoals));
router.post("/goals", asyncHandler(createGoal));
router.get("/dashboard/overview", asyncHandler(dashboardOverview));
router.get("/products", asyncHandler(listProducts));
router.post("/calculators/:type", asyncHandler(runCalculator));

export default router;
