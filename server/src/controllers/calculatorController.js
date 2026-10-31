import { calculate } from "../services/calculatorService.js";

export async function runCalculator(req, res) {
  try {
    const result = calculate(req.params.type, req.body || {});
    res.json({ calculator: req.params.type, currency: "INR", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
