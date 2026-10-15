/**
 * Microservice Dependency & Risk Registry Screen.
 *
 * Renders connected services ranked by PageRank centrality, avalanche failure risk,
 * active exception counts, and customer-path ingress proximity.
 */

import type { Metadata } from "next";
import { ServicesList } from "@/components/registry/registry";

export const metadata: Metadata = { title: "Services" };

export default function Page() {
  return <ServicesList />;
}
