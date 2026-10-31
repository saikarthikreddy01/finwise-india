import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import StatCard from "./StatCard.jsx";

describe("StatCard", () => {
  it("renders its label, value, and optional note", () => {
    const markup = renderToStaticMarkup(
      <StatCard label="Monthly income" value="₹25,000" note="This month" />
    );

    expect(markup).toContain("Monthly income");
    expect(markup).toContain("₹25,000");
    expect(markup).toContain("This month");
  });
});
