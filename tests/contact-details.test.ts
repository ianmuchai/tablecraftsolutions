import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { contactDetails } from "../src/content/contactDetails";

describe("contactDetails", () => {
  test("contains the public TableCraft location, WhatsApp contact, and TikTok link", () => {
    expect(contactDetails.location).toBe("Nairobi, Kilimani, Woodvale Ave");
    expect(contactDetails.phoneDisplay).toBe("0794 446 707");
    expect(contactDetails.whatsappUrl).toBe("https://wa.me/254794446707");
    expect(contactDetails.whatsappLabel).toBe("WhatsApp");
    expect(contactDetails.tiktokUrl).toBe("https://vt.tiktok.com/ZSbAq38wV/");
  });

  test("renders an accessible TikTok footer link", () => {
    const layout = readFileSync("src/components/layout.tsx", "utf8");

    expect(layout).toContain("contactDetails.tiktokUrl");
    expect(layout).toContain("aria-label=\"TikTok\"");
    expect(layout).toContain("footer-social-link");
  });
});
