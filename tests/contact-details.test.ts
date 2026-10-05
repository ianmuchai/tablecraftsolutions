import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { contactDetails } from "../src/content/contactDetails";

describe("contactDetails", () => {
  test("contains the public TableCraft location, WhatsApp contact, email, Facebook, and TikTok link", () => {
    expect(contactDetails.location).toBe("Nairobi, Kilimani, Woodvale Ave");
    expect(contactDetails.phoneDisplay).toBe("0794 446 707");
    expect(contactDetails.email).toBe("tablecraftsolutions@gmail.com");
    expect(contactDetails.emailHref).toBe("mailto:tablecraftsolutions@gmail.com");
    expect(contactDetails.whatsappUrl).toBe("https://wa.me/254794446707");
    expect(contactDetails.whatsappLabel).toBe("WhatsApp");
    expect(contactDetails.facebookUrl).toBe("https://www.facebook.com/share/14u6g5cQWWN/?mibextid=wwXIfr");
    expect(contactDetails.tiktokUrl).toBe("https://vt.tiktok.com/ZSbAq38wV/");
  });

  test("renders accessible Facebook, TikTok, and email links", () => {
    const layout = readFileSync("src/components/layout.tsx", "utf8");
    const contactPage = readFileSync("src/pages/ContactPage.tsx", "utf8");

    expect(layout).toContain("contactDetails.tiktokUrl");
    expect(layout).toContain("aria-label=\"TikTok\"");
    expect(layout).toContain("contactDetails.facebookUrl");
    expect(layout).toContain("aria-label=\"Facebook\"");
    expect(layout).toContain("contactDetails.emailHref");
    expect(contactPage).toContain("contactDetails.emailHref");
    expect(contactPage).toContain("contactDetails.facebookUrl");
    expect(layout).toContain("footer-social-link");
  });
});
