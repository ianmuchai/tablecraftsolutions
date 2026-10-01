import { ArrowRight, ClipboardCheck, CookingPot, LineChart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices, getTestimonials } from "../api/client";
import { CtaBand, ServiceGrid, Testimonials } from "../components/sections";
import { editableText } from "../content/learningResources";
import type { Service, Testimonial } from "../types";

const metrics = [
  { value: "2018", label: editableText("home.metric.incorporation", "incorporated for hospitality excellence") },
  { value: "Vast", label: editableText("home.metric.experience", "founder-led hospitality experience") },
  { value: "6", label: "consultancy tracks for restaurant growth" }
];

const heroSlides = [
  {
    image: "/hero-carousel-restaurant.png",
    alt: "TableCraft restaurant team welcoming guests inside a modern restaurant"
  }
];

const fallbackServices: Service[] = [
  {
    slug: "restaurant-launch",
    title: "Restaurant Launch",
    eyebrow: "Concept to opening night",
    summary: "Launch with practical systems, team readiness, and opening controls.",
    description: "",
    outcomes: [],
    deliverables: []
  },
  {
    slug: "menu-engineering",
    title: "Menu Engineering",
    eyebrow: "Profit by design",
    summary: "Use pricing, costing, and layout to make the menu work harder.",
    description: "",
    outcomes: [],
    deliverables: []
  },
  {
    slug: "operations-audits",
    title: "Operations Audits",
    eyebrow: "Find the leaks",
    summary: "Diagnose daily routines that affect cost, speed, and consistency.",
    description: "",
    outcomes: [],
    deliverables: []
  }
];

export function HomePage() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    getServices().then((items) => setServices(items.slice(0, 3))).catch(() => setServices(fallbackServices));
    getTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <div className="hero-carousel">
            {heroSlides.map((slide, index) => (
              <img
                className={index === activeHeroSlide ? "hero-slide active" : "hero-slide"}
                src={slide.image}
                alt={slide.alt}
                key={slide.image}
              />
            ))}
          </div>
        </div>
        <div className="hero-content">
          <p className="eyebrow">{editableText("home.hero.eyebrow", "Restaurant consultancy")}</p>
          <h1>{editableText("home.hero.title", "TableCraft Solutions")}</h1>
          <p>{editableText("home.hero.copy", "We help restaurants launch smarter, train confident teams, tighten operations, and turn hospitality ambition into standards, systems, and measurable service excellence.")}</p>
          <div className="hero-actions">
            <Link className="button" to="/contact">
              {editableText("home.hero.primaryButton", "Book a consultation")}
            </Link>
            <Link className="button ghost" to="/services">
              {editableText("home.hero.secondaryButton", "Explore services")} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container metric-row">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="section container">
        <div className="section-heading">
          <p className="eyebrow">{editableText("home.services.eyebrow", "What we craft")}</p>
          <h2>{editableText("home.services.title", "Consulting built around the restaurant's real operating layers.")}</h2>
        </div>
        <ServiceGrid services={services} />
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">{editableText("home.process.eyebrow", "How we work")}</p>
          <h2>{editableText("home.process.title", "Strategy that reaches the pass, the floor, and the numbers.")}</h2>
          <p>{editableText("home.process.copy", "TableCraft connects brand, menu, service, staffing, purchasing, and reporting so every layer supports the same commercial goal.")}</p>
        </div>
        <div className="process-list">
          {[
            { icon: ClipboardCheck, title: "Audit", copy: "Map the current operation, opportunities, and visible constraints." },
            { icon: Sparkles, title: "Design", copy: "Shape the guest experience, service model, menu, and management rhythm." },
            { icon: CookingPot, title: "Train", copy: "Turn standards into daily team behavior through practical tools." },
            { icon: LineChart, title: "Measure", copy: "Track the numbers and habits that protect performance." }
          ].map((item) => (
            <article className="process-item" key={item.title}>
              <item.icon size={22} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section container">
          <div className="section-heading">
            <p className="eyebrow">Operator trust</p>
            <h2>Practical guidance with measurable impact.</h2>
          </div>
          <Testimonials testimonials={testimonials} />
        </section>
      )}

      <CtaBand />
    </>
  );
}
