import test from "node:test";
import assert from "node:assert/strict";
import { calculate } from "./calculatorService.js";

test("calculates a zero-interest EMI without dividing by zero", () => {
  assert.deepEqual(calculate("emi", { principal: 1200, annualRate: 0, months: 12 }), {
    monthlyEmi: 100,
    totalPayment: 1200,
    totalInterest: 0
  });
});

test("calculates SIP contributions and a zero-return estimate", () => {
  assert.deepEqual(calculate("sip", { monthlyInvestment: 500, annualRate: 0, months: 12 }), {
    investedAmount: 6000,
    estimatedValue: 6000,
    estimatedGain: 0,
    assumption: "Beginning-of-month contributions; fixed assumed return, not a guaranteed outcome."
  });
});

test("rejects zero-month calculator periods", () => {
  assert.throws(
    () => calculate("emi", { principal: 1200, annualRate: 5, months: 0 }),
    /months must be greater than zero/
  );
});

test("rejects unknown calculators", () => {
  assert.throws(() => calculate("unknown", {}), /Unsupported calculator/);
});
