import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Organization</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>E-1/3 Mukund Vihar Karawal Nagar Delhi-90</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>7982970305, 9015240451</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>President: Shri Uttam Singh Chauhan</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Join our community and stay updated with our initiatives.
            </p>
            <Link href="/register-member">
              <span className="inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Register as Member
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Purvanchal Mitra Mahasabha (Regd.). All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
