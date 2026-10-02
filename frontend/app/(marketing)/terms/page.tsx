import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="2 October 2026"
      intro={
        <>
          <strong>Draft.</strong> Reprieve is in early access. These terms are a plain-language placeholder and will be
          replaced by reviewed terms before public sign-up opens. Until then, please use the sample workspace or
          non-sensitive data.
        </>
      }
      sections={[
        {
          id: "service",
          title: "The service",
          body: (
            <p>
              Reprieve helps teams track temporary exceptions, detect compound risk across them, and route reviews to the
              right people. Features may change while the product is in early access.
            </p>
          ),
        },
        {
          id: "accounts",
          title: "Your account",
          body: (
            <p>
              You need a verified email address to use Reprieve. Keep your credentials secure; you are responsible for
              activity in workspaces you own.
            </p>
          ),
        },
        {
          id: "your-data",
          title: "Your data",
          body: (
            <p>
              You keep ownership of the data you add. We process it only to run the service for you. You can delete a
              workspace, and its graphs, at any time from Settings.
            </p>
          ),
        },
        {
          id: "ai",
          title: "AI features",
          body: (
            <>
              <p>
                The Steward uses a large language model to answer questions and propose actions. It can be wrong. Scores
                and detections are computed deterministically and do not depend on AI.
              </p>
              <p>Proposed actions never take effect without explicit approval by a person with the right role.</p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          body: (
            <ul>
              <li>Do not attempt to access workspaces you are not a member of.</li>
              <li>Do not overload the service or bypass rate limits.</li>
              <li>Do not upload data you have no right to process.</li>
            </ul>
          ),
        },
        {
          id: "availability",
          title: "Availability and warranty",
          body: (
            <p>
              During early access the service runs on limited infrastructure and may be slow to wake or briefly
              unavailable. It is provided as is, without warranties.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: <p>Questions about these terms can be sent to the project owner through the contact listed in the repository.</p>,
        },
      ]}
    />
  );
}
