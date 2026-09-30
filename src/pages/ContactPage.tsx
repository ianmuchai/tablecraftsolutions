import { MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { submitContact } from "../api/client";
import { PageHero } from "../components/sections";
import { contactDetails } from "../content/contactDetails";
import type { ContactPayload } from "../types";

const initialPayload: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: ""
};

export function ContactPage() {
  const [payload, setPayload] = useState<ContactPayload>(initialPayload);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const update = (key: keyof ContactPayload, value: string) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");
    try {
      await submitContact(payload);
      setPayload(initialPayload);
      setStatus("success");
      setFeedback("Thank you. Your inquiry has been received and TableCraft Solutions will follow up.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Please check the form and try again.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what your restaurant needs next."
        copy="Share your goal, challenge, or launch timeline. We will respond with the best starting point."
        image="/hero-contact.png"
      />
      <section className="contact-layout container">
        <div className="contact-panel">
          <p className="eyebrow">Start here</p>
          <h2>Consultancy inquiry</h2>
          <p>
            Use the form for launch planning, menu engineering, operations audits, training, brand experience, or cost
            control support.
          </p>
          <div className="direct-contact-list" aria-label="Direct contact details">
            <a href={contactDetails.phoneHref}>
              <Phone size={18} /> Farhan: {contactDetails.phoneDisplay}
            </a>
            <span>
              <MapPin size={18} /> {contactDetails.location}
            </span>
          </div>
          <div className="contact-note">
            <strong>Best first message:</strong>
            <span>Tell us your restaurant type, location, current challenge, and ideal timeline.</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={payload.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={payload.email} onChange={(event) => update("email", event.target.value)} />
          </label>
          <label>
            Phone
            <input value={payload.phone} onChange={(event) => update("phone", event.target.value)} />
          </label>
          <label>
            Restaurant / Company
            <input value={payload.company} onChange={(event) => update("company", event.target.value)} />
          </label>
          <label>
            Service interest
            <select value={payload.service} onChange={(event) => update("service", event.target.value)}>
              <option value="">Choose a service</option>
              <option value="restaurant-launch">Restaurant Launch</option>
              <option value="menu-engineering">Menu Engineering</option>
              <option value="operations-audits">Operations Audits</option>
              <option value="staff-training">Staff Training</option>
              <option value="brand-guest-experience">Brand & Guest Experience</option>
              <option value="cost-control">Cost Control</option>
            </select>
          </label>
          <label className="full">
            Message
            <textarea value={payload.message} onChange={(event) => update("message", event.target.value)} rows={6} />
          </label>
          {feedback && <p className={`form-feedback ${status}`}>{feedback}</p>}
          <button className="button form-button" type="submit" disabled={status === "submitting"}>
            <Send size={18} /> {status === "submitting" ? "Sending..." : "Send inquiry"}
          </button>
        </form>
      </section>
    </>
  );
}
