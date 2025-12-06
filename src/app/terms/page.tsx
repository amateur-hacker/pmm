import { AlertCircle, CheckCircle, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Purvanchal Mitra Mahasabha",
  description:
    "Membership eligibility requirements and terms and conditions for joining Purvanchal Mitra Mahasabha. Learn about age requirements, citizenship, and community commitment expectations.",
  keywords:
    "NGO terms and conditions, membership requirements, Purvanchal Mitra Mahasabha terms, community organization membership",
  openGraph: {
    title: "Terms and Conditions - Purvanchal Mitra Mahasabha",
    description:
      "Membership eligibility requirements and terms and conditions for joining Purvanchal Mitra Mahasabha. Learn about age requirements, citizenship, and community commitment expectations.",
    type: "website",
    url: `https://${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/terms`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - Purvanchal Mitra Mahasabha",
    description:
      "Membership eligibility requirements and terms and conditions for joining Purvanchal Mitra Mahasabha. Learn about age requirements, citizenship, and community commitment expectations.",
  },
  alternates: {
    canonical: `https://${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-muted-foreground">
            Registration Requirements
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
            <div className="max-w-none">
              <h2 className="text-2xl font-bold mb-6">
                Membership Eligibility Requirements
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Age Requirement</h3>
                    <p className="text-muted-foreground">
                      Applicant must be 18 years of age or older at the time of
                      registration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Criminal Record Check
                    </h3>
                    <p className="text-muted-foreground">
                      Applicant must have no criminal record or pending legal
                      cases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Citizenship Requirement
                    </h3>
                    <p className="text-muted-foreground">
                      Applicant must be a citizen of India as per Indian
                      nationality laws.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Community Commitment
                    </h3>
                    <p className="text-muted-foreground">
                      Applicant must commit to participating in community
                      service activities and following the organization's
                      values.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-lg border bg-warning/20 border-warning">
                <div className="flex">
                  <AlertCircle className="h-6 w-6 text-warning-foreground mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Important Notice</h3>
                    <p className="mt-2 text-warning-foreground">
                      By submitting the membership application, the applicant
                      confirms that all provided information is true and
                      accurate. Providing false information will result in
                      immediate disqualification and may lead to legal action.
                      The organization reserves the right to verify all details
                      provided in the application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Membership Benefits:</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Participation in cultural and social events</li>
                  <li>Eligibility for community support programs</li>
                  <li>Voting rights in organization matters</li>
                  <li>Access to welfare initiatives</li>
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">
                  Member Responsibilities:
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Maintain good conduct and ethical standards</li>
                  <li>Actively participate in community activities</li>
                  <li>Respect the organization's values and traditions</li>
                  <li>Contribute to the welfare of the community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
