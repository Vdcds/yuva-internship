import { Navbar } from "@/components/navbar";
import { AuthCtaButtons } from "@/components/auth-cta-buttons";
import {
  FileText,
  Calendar,
  CheckCircle,
  Building2,
  ArrowRight,
  Star,
  Shield
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Service Requests",
    description: "Submit applications for documents, certificates, and permits online"
  },
  {
    icon: Calendar,
    title: "Appointments",
    description: "Book appointments with government departments at your convenience"
  },
  {
    icon: CheckCircle,
    title: "Track Status",
    description: "Monitor your applications in real-time from submission to completion"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security"
  }
];

const stats = [
  { value: "50K+", label: "Citizens Served" },
  { value: "200+", label: "Services Available" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-primary/5">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 lg:px-8">
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
              <Star className="h-4 w-4" />
              <span>Trusted by thousands of citizens</span>
            </div>

            <h1 className="font-didot text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">E-</span>
              <span className="text-primary">Governance</span>
              <br />
              <span className="text-2xl sm:text-3xl font-sans font-normal text-muted-foreground mt-4 block">
                Simplifying Government Services for Everyone
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
              Access government services from anywhere, anytime. Submit requests,
              book appointments, and track your applications with ease.
            </p>

            <AuthCtaButtons />
          </div>
        </div>

        {/* Stats */}
        <div className="border-y bg-card/50 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary font-didot">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-didot text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Streamlined services designed to make your interaction with government
              simple, fast, and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-didot text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-didot text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get things done in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign In", description: "Create your account or sign in to access the portal" },
              { step: "02", title: "Submit Request", description: "Choose a service, fill in details, and submit your application" },
              { step: "03", title: "Track & Receive", description: "Monitor your application status and receive notifications" }
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="text-8xl font-didot font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-didot text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-primary p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/80" />
            <div className="relative">
              <Building2 className="h-16 w-16 mx-auto text-primary-foreground/20 mb-6" />
              <h2 className="font-didot text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
<p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of citizens who are already enjoying seamless
              government services online.
            </p>
            <div className="flex justify-center">
              <AuthCtaButtons />
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-didot text-lg font-semibold">E-Governance</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 E-Governance Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}