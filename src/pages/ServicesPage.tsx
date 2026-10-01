import { useEffect, useState } from "react";
import { getServices } from "../api/client";
import { PageHero, ServiceGrid } from "../components/sections";
import { editableText } from "../content/learningResources";
import { mergeManagedServices, readManagedServices } from "../content/managedContent";
import type { Service } from "../types";

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((items) => setServices(readManagedServices(mergeManagedServices(items)))).catch(() => setServices([]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={editableText("services.hero.eyebrow", "Services")}
        title={editableText("services.hero.title", "Consultancy tracks for every layer of restaurant performance.")}
        copy={editableText("services.hero.copy", "Choose a focused project or combine tracks into a deeper operational transformation.")}
        image="/hero-services.png"
      />
      <section className="section container">
        {services.length > 0 ? (
          <ServiceGrid services={services} />
        ) : (
          <p className="empty-state">Services are temporarily unavailable. Please contact us for the current consultancy menu.</p>
        )}
      </section>
    </>
  );
}
