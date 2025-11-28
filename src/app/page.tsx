import Link from "next/link";
import { Handshake, Users, Mail, Info } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <Handshake className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Purvanchal Mitra Mahasabha (Regd.)
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10">
            A socially committed NGO working tirelessly for the development and
            well-being of communities across the eastern region of India
          </p>
        </div>
      </section>

      {/* About & Mission Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                About Our Organization
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Founded with a vision to uplift society by blending cultural
                strength with social development for a better future.
              </p>
              <p className="text-lg text-muted-foreground">
                We are committed to supporting local needs, preserving
                traditions that shape our identity, and building strong
                communities across eastern India.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <Users className="h-10 w-10 text-primary mr-4" />
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground">
                Building strong communities through cultural preservation,
                social welfare, and educational initiatives that bring people
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From cultural celebrations to social welfare programs, we engage
              in diverse initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Cultural Celebrations
              </h3>
              <p className="text-muted-foreground">
                Organizing large-scale festivals like Chhath Puja, Ram Leela,
                and community gatherings to preserve traditions.
              </p>
            </div>

            <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <Info className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Social Welfare</h3>
              <p className="text-muted-foreground">
                Running welfare programs, awareness drives, and educational
                initiatives for community development.
              </p>
            </div>

            <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-muted-foreground">
                Supporting underprivileged families, empowering women and youth,
                and encouraging community participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Become a member today and contribute to our social welfare programs
            and community initiatives
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              asChild
            >
              <Link href="/form">Register as Member</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
              asChild
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Registration Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Membership Requirements</h2>
            <div className="bg-card p-8 rounded-xl shadow-sm border">
              <ul className="list-disc text-left pl-6 text-lg text-muted-foreground space-y-3 max-w-2xl mx-auto">
                <li>Applicant must be 18 years or older</li>
                <li>No criminal record</li>
                <li>Must be a citizen of India</li>
                <li>Commitment to community service</li>
                <li>Willingness to participate in organization activities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
