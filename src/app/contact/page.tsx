import { Phone, Mail, MapPin, Calendar } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">Get in touch with Purvanchal Mitra Mahasabha (Regd.)</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4 bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Registration Number</h3>
                    <p className="text-muted-foreground">S/00589NE/2012</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4 bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Address</h3>
                    <p className="text-muted-foreground">E-1/3 Mukund Vihar Karawal Nagar Delhi-90</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4 bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mobile Numbers</h3>
                    <p className="text-muted-foreground">7982970305</p>
                    <p className="text-muted-foreground">9015240451</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4 bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">President</h3>
                    <p className="text-muted-foreground">Shri Uttam Singh Chauhan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Office Hours</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-muted-foreground">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Saturday</span>
                  <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold mb-3">Visit Us</h3>
                <p className="text-muted-foreground">
                  Feel free to visit our office during working hours for any inquiries,
                  to become a member, or to learn more about our initiatives.
                  We welcome community members and volunteers who share our vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}