import { useEffect, useState } from "react";
import { getServices } from "../api/client";
import { PageHero, ServiceGrid } from "../components/sections";
import type { Service } from "../types";

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices).catch(() => setServices([]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Consultancy tracks for every layer of restaurant performance."
        copy="Choose a focused project or combine tracks into a deeper operational transformation."
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


