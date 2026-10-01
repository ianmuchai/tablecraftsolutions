import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("mobile polish CSS", () => {
  test("ships a final mobile polish layer for hero, cards, dashboard, and footer", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toContain("Final mobile polish pass");
    expect(css).toContain(".hero-slide");
    expect(css).toContain("object-position: 66% center");
    expect(css).toContain(".card-grid,");
    expect(css).toContain(".dashboard-panel");
    expect(css).toContain(".site-footer");
    expect(css).toContain("padding: 34px 18px 76px;");
  });
});
