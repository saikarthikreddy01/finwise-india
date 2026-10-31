const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const positive = (n, name) => {
  const value = Number(n);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number`);
  return value;
};

export function calculate(type, input) {
  switch (type) {
    case "emi": {
      const p = positive(input.principal, "principal");
      const annualRate = positive(input.annualRate, "annualRate");
      const months = Math.floor(positive(input.months, "months"));
      if (!months) throw new Error("months must be greater than zero");
      const r = annualRate / 1200;
      const emi = r === 0 ? p / months : p * r * (1 + r) ** months / ((1 + r) ** months - 1);
      return { monthlyEmi: round2(emi), totalPayment: round2(emi * months), totalInterest: round2(emi * months - p) };
    }
    case "sip": {
      const monthly = positive(input.monthlyInvestment, "monthlyInvestment");
      const annualRate = positive(input.annualRate, "annualRate");
      const months = Math.floor(positive(input.months, "months"));
      if (!months) throw new Error("months must be greater than zero");
      const i = annualRate / 1200;
      const invested = monthly * months;
      const value = i === 0 ? invested : monthly * (((1 + i) ** months - 1) / i) * (1 + i);
      return { investedAmount: round2(invested), estimatedValue: round2(value), estimatedGain: round2(value - invested), assumption: "Beginning-of-month contributions; fixed assumed return, not a guaranteed outcome." };
    }
    case "fd": {
      const p = positive(input.principal, "principal");
      const annualRate = positive(input.annualRate, "annualRate") / 100;
      const years = positive(input.years, "years");
      const frequency = Math.max(1, Math.floor(positive(input.compoundsPerYear ?? 4, "compoundsPerYear")));
      const maturity = p * (1 + annualRate / frequency) ** (frequency * years);
      return { principal: round2(p), maturityValue: round2(maturity), interest: round2(maturity - p), assumption: "Illustrative periodic compounding; actual bank conventions may differ." };
    }
    case "compound-interest": {
      const p = positive(input.principal, "principal");
      const rate = positive(input.annualRate, "annualRate") / 100;
      const years = positive(input.years, "years");
      const value = p * (1 + rate) ** years;
      return { principal: round2(p), futureValue: round2(value), interest: round2(value - p) };
    }
    case "inflation": {
      const presentValue = positive(input.presentValue, "presentValue");
      const inflationRate = positive(input.inflationRate, "inflationRate") / 100;
      const years = positive(input.years, "years");
      const futureCost = presentValue * (1 + inflationRate) ** years;
      return { presentValue: round2(presentValue), futureCost: round2(futureCost), additionalAmount: round2(futureCost - presentValue) };
    }
    case "cagr": {
      const beginningValue = positive(input.beginningValue, "beginningValue");
      const endingValue = positive(input.endingValue, "endingValue");
      const years = positive(input.years, "years");
      if (!beginningValue || !years) throw new Error("beginningValue and years must be greater than zero");
      return { cagrPercent: round2(((endingValue / beginningValue) ** (1 / years) - 1) * 100) };
    }
    default:
      throw new Error("Unsupported calculator. Available: emi, sip, fd, compound-interest, inflation, cagr");
  }
}
