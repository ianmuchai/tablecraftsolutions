import { describe, expect, test } from "vitest";
import { contactDetails } from "../src/content/contactDetails";

describe("contactDetails", () => {
  test("contains the public TableCraft location and WhatsApp contact", () => {
    expect(contactDetails.location).toBe("Nairobi, Kilimani, Woodvale Ave");
    expect(contactDetails.phoneDisplay).toBe("0794 446 707");
    expect(contactDetails.whatsappUrl).toBe("https://wa.me/254794446707");
    expect(contactDetails.whatsappLabel).toBe("WhatsApp");
  });
});
