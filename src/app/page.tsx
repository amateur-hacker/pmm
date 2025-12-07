/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import {
  Calendar,
  Heart,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getDb } from "@/lib/db";
import { events, members } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Purvanchal Mitra Mahasabha (Regd.) - Home",
  description:
    "A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India. Join our organization and contribute to social welfare programs.",
  keywords:
    "NGO, Purvanchal Mitra Mahasabha, community development, social welfare, India, membership",
  openGraph: {
    title: "Purvanchal Mitra Mahasabha (Regd.) - Home",
    description:
      "A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
    type: "website",
    url: process.env.SITE_URL || "https://purvanchalmitramahasabha.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purvanchal Mitra Mahasabha (Regd.) - Home",
    description:
      "A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
  },
  alternates: {
    canonical: "https://purvanchalmitramahasabha.org",
  },
};

export default async function Home() {
  const db = getDb();

  // Fetch counts
  const [membersResult] = await db.select({ count: count() }).from(members);
  const [eventsResult] = await db
    .select({ count: count() })
    .from(events)
    .where(eq(events.published, 1));

  const totalMembers = membersResult?.count || 0;
  const totalEvents = eventsResult?.count || 0;

  const activeMembers = totalMembers + 7300;
  const projectsCompleted = 154 + totalEvents;

  // Calculate years of experience: 13+ for 2025, +1 each year after
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = 13 + Math.max(0, currentYear - 2025);
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Purvanchal Mitra Mahasabha Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Purvanchal Mitra Mahasabha (Regd.)
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                A socially committed NGO working tirelessly for the development
                and well-being of communities across the eastern region of India
              </p>

              <div className="flex flex-col sm:flex-row justify-center sm:items-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg cursor-pointer"
                  asChild
                >
                  <Link href="/register-member">Join Our Community</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg cursor-pointer"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                <NumberTicker value={activeMembers} />
              </div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                <NumberTicker value={yearsOfExperience} />+
              </div>
              <div className="text-muted-foreground">Years of Experience</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                <NumberTicker value={projectsCompleted} />
              </div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Our Foundation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mission & Vision
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Building a stronger society through cultural preservation, social
              welfare, and community development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To create empowered communities by blending cultural
                    strength with social development. We strive to preserve
                    traditions while fostering progress, ensuring every
                    individual has the opportunity to thrive and contribute to
                    societal well-being.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-primary/5">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A society where cultural heritage and social progress
                    coexist harmoniously. We envision communities that are
                    self-reliant, inclusive, and driven by shared values of
                    compassion, unity, and sustainable development.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              What We Do
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From cultural celebrations to social welfare programs, we engage
              in diverse initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  Cultural Celebrations
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Organizing large-scale festivals like Chhath Puja, Ram Leela,
                  and community gatherings to preserve traditions.
                </p>
                <div className="flex justify-center">
                  <Badge variant="outline">Festivals</Badge>
                  <Badge variant="outline" className="ml-2">
                    Traditions
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Info className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  Social Welfare
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Running welfare programs, awareness drives, and educational
                  initiatives for community development.
                </p>
                <div className="flex justify-center">
                  <Badge variant="outline">Education</Badge>
                  <Badge variant="outline" className="ml-2">
                    Healthcare
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Mail className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  Community Support
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Supporting underprivileged families, empowering women and
                  youth, and encouraging community participation.
                </p>
                <div className="flex justify-center">
                  <Badge variant="outline">Support</Badge>
                  <Badge variant="outline" className="ml-2">
                    Empowerment
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us in our cultural celebrations and community initiatives
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>December 15, 2025</span>
                </div>
                <div className="flex items-center md:ml-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span>Patna, Bihar</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4 md:mt-0">
                Annual Chhath Puja Celebration
              </h3>
              <p className="text-muted-foreground mt-2">
                Join us for the largest Chhath Puja celebration in eastern
                India. Experience traditional rituals, cultural programs, and
                community bonding.
              </p>
              <Button
                variant="link"
                className="p-0 mt-4 text-primary hover:no-underline cursor-pointer"
                asChild
              >
                <Link href="/events">View Details</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>January 20, 2026</span>
                </div>
                <div className="flex items-center md:ml-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span>Varanasi, Uttar Pradesh</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4 md:mt-0">
                Community Health Camp
              </h3>
              <p className="text-muted-foreground mt-2">
                Free health check-ups, medical consultations, and health
                awareness programs for underprivileged communities in Varanasi.
              </p>
              <Button
                variant="link"
                className="p-0 mt-4 text-primary hover:no-underline cursor-pointer"
                asChild
              >
                <Link href="/events">View Details</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground">
            Join our mission to build stronger communities and preserve our
            cultural heritage
          </p>
          <div className="flex flex-col sm:flex-row justify-center sm:items-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg cursor-pointer"
              asChild
            >
              <Link href="/register-member">Become a Member</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg cursor-pointer"
              asChild
            >
              <Link href="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Community Voices
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from those who are part of our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Being part of Purvanchal Mitra Mahasabha has been an incredible
                journey. The organization's commitment to both cultural
                preservation and community development is truly inspiring."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <div className="font-semibold">Rajesh Kumar</div>
                  <div className="text-muted-foreground text-sm">
                    Active Member, 5 years
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "The social welfare programs have made a real impact in my
                village. From health camps to educational initiatives, this
                organization brings hope and opportunities to underprivileged
                communities."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <div className="font-semibold">Sunita Devi</div>
                  <div className="text-muted-foreground text-sm">
                    Community Volunteer
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Organizing cultural events has helped preserve our traditions
                while bringing communities together. The organization does
                remarkable work in maintaining our cultural identity while
                promoting social development."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <div className="font-semibold">Amit Singh</div>
                  <div className="text-muted-foreground text-sm">
                    Cultural Coordinator
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp Button - Fixed bottom right */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg z-50 cursor-pointer"
        asChild
      >
        <a
          // href="https://api.whatsapp.com/send/?phone=9015240451&text&type=phone_number&app_absent=0"
          // href="https://web.whatsapp.com/send/?phone=9015240451&text&type=phone_number&app_absent=0"
          href="https://wa.me/9015240451"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          {/* <MessageCircle className="h-6 w-6" /> */}

          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Whatsapp Icon</title>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </a>
      </Button>
    </div>
  );
}
