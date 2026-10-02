import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="2 October 2026"
      intro={
        <>
          <strong>Draft.</strong> This is an honest summary of how Reprieve handles data today, not a final policy. It
          will be replaced by a reviewed privacy policy before public sign-up opens.
        </>
      }
      sections={[
        {
          id: "what-we-store",
          title: "What we store",
          body: (
            <ul>
              <li>Account details from sign-in: email address, name, and verification status (handled by Clerk).</li>
              <li>Workspace data you add: services, people, teams, controls, exceptions, reviews and notes.</li>
              <li>An audit log of changes, and Steward conversations for up to 90 days.</li>
            </ul>
          ),
        },
        {
          id: "llm",
          title: "What is sent to AI providers",
          body: (
            <>
              <p>
                When AI is on, the Steward sends entity IDs, names and short excerpts needed to answer a question. It does
                not send whole documents. Scores and detections never require AI.
              </p>
              <p>Admins can turn AI off for a workspace in Settings.</p>
            </>
          ),
        },
        {
          id: "processors",
          title: "Service providers",
          body: (
            <ul>
              <li>Clerk for authentication.</li>
              <li>A managed graph database host for workspace data.</li>
              <li>An LLM provider when AI is on.</li>
              <li>Hosting providers for the web app and API.</li>
            </ul>
          ),
        },
        {
          id: "retention",
          title: "Retention and deletion",
          body: (
            <p>
              Deleting a workspace removes its graphs. Deleting your account removes your user record once you no longer
              solely own a workspace. Steward sessions are kept for 90 days.
            </p>
          ),
        },
        {
          id: "security",
          title: "Security",
          body: (
            <p>
              Every API request is authenticated and scoped to workspaces you belong to. Early access runs on free-tier
              infrastructure, so please avoid sensitive data for now.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: <p>Privacy questions can be sent to the project owner through the contact listed in the repository.</p>,
        },
      ]}
    />
  );
}
