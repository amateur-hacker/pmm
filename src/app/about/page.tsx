import { Handshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <Handshake className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground">Purvanchal Mitra Mahasabha (Regd.)</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-lg p-8 mb-8 border bg-card text-card-foreground shadow-sm">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We are a socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India. Our foundation is built on the belief that strong culture creates strong society, and through this vision we bring people together, support local needs, and preserve the traditions that shape our identity.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              From organizing large-scale cultural celebrations like Chhath Puja, Ram Leela, and various community festivals, to running social welfare programs, awareness drives, and educational initiatives, we aim to create meaningful impact at every level. These events not only keep our heritage alive, but also give families, youth, and elders a shared space to connect, express, and celebrate.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Beyond cultural activities, we actively engage in development work—supporting underprivileged families, promoting education, empowering women and youth, and encouraging community participation in social progress. Our volunteers, members, and supporters work hand in hand to build a society where every individual feels seen, supported, and valued.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              With dedication, transparency, and a genuine desire to bring positive change, we continue to expand our efforts and reach more communities each year. Our goal is simple yet powerful: to uplift society by blending cultural strength with social development, and to create a future where tradition and progress walk together.
            </p>
          </div>

          <div className="rounded-lg p-8 border bg-secondary text-secondary-foreground">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-secondary-foreground/90">
              To create a society where cultural values and social development go hand in hand, fostering unity, progress, and well-being for all communities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}