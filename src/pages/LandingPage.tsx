/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Check,
  ChevronRight,
  Download,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Mandal Management",
      description:
        "Manage multiple organizations from a single platform with role-based access control.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Analytics",
      description:
        "Real-time insights and reports to track contributions, expenses, and festival performance.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description:
        "Bank-grade security with role-based permissions and data backup.",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "PDF Reports",
      description:
        "Generate professional reports with custom branding and automated receipts.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Mobile First",
      description:
        "Works perfectly on all devices with offline support for remote areas.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Easy Setup",
      description:
        "Get started in minutes with festival templates and guided onboarding.",
    },
  ];

  const testimonials = [
    {
      name: "Shree Ganesh Mandal",
      location: "Mumbai",
      quote:
        "MandalsaS has transformed how we manage our Ganesh Chaturthi celebrations. The contribution tracking is seamless!",
      rating: 5,
    },
    {
      name: "Navratri Celebration Committee",
      location: "Ahmedabad",
      quote:
        "Finally, a platform that understands our needs. The expense management and reporting features are excellent.",
      rating: 5,
    },
    {
      name: "Durga Puja Samiti",
      location: "Kolkata",
      quote:
        "The multi-festival support and role-based access has made organizing our events so much easier.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      description: "Perfect for small mandals getting started",
      features: [
        "1 Festival per year",
        "Up to 50 contributors",
        "Basic reports",
        "Email support",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Standard",
      price: "₹499",
      period: "/month",
      description: "Ideal for growing mandals",
      features: [
        "5 Festivals per year",
        "Up to 500 contributors",
        "Advanced reports",
        "Custom branding",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Premium",
      price: "₹999",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited festivals",
        "Unlimited contributors",
        "Custom PDF logos",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gray-200/50 safe-area-top bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold primary-text">MandalsaS</h1>
                <p className="text-xs muted-text">
                  Festival Management Platform
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
              >
                Reviews
              </a>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="btn-outline"
              >
                Login
              </Button>
              <Button className="btn-primary">Get Started</Button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm" className="btn-primary">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full mb-6">
                <Star className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Trusted by 500+ Mandals across India
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Modern Festival
                <span className="primary-text"> Management</span>
                <br />
                for Every Mandal
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline contributions, track expenses, and generate
                professional reports for Ganesh Chaturthi, Navratri, and all
                your festival celebrations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="btn-primary">
                  Register Your Mandal
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="btn-outline">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Free 30-day trial
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  No setup fees
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="modern-card p-8 bg-gradient-to-br from-white to-gray-50">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759253139451-e27dd04b1cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZXN0aXZhbCUyMGNlbGVicmF0aW9uJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1OTY5MTE3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Festival Celebration"
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Contributions
                    </span>
                    <span className="font-bold text-green-600">₹2,45,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Expenses
                    </span>
                    <span className="font-bold text-red-600">₹1,89,500</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Current Balance</span>
                    <span className="font-bold text-blue-600">₹55,500</span>
                  </div>
                </div>
              </div>

              {/* Floating cards for effect */}
              <div className="absolute -top-4 -right-4 w-24 h-24 gradient-primary rounded-2xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 gradient-secondary rounded-2xl opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage
              <span className="primary-text"> Festivals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From contribution tracking to expense management, we've got all
              the tools your Mandal needs for successful festival organization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="modern-card p-6 h-full">
                  <div className="primary-text mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent
              <span className="primary-text"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your Mandal. Start free and upgrade as
              you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`modern-card p-8 h-full relative ${
                    plan.popular
                      ? "border-[var(--color-primary)] shadow-lg"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular ? "btn-primary" : "btn-outline"
                    }`}
                    // onClick={onGetStarted}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              //   onClick={onViewPricing}
              className="btn-outline"
            >
              View Detailed Pricing
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Mandals
              <span className="primary-text"> Across India</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our community of festival organizers has to say about
              MandalsaS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="modern-card p-6 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-500 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.location}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your
              <span className="primary-text"> Festival Management?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of Mandals who have simplified their festival
              organization with MandalsaS. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="btn-outline">
                Login to Existing Account
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">MandalsaS</h1>
                  <p className="text-sm text-gray-400">
                    Festival Management Platform
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering Mandals across India with modern tools for festival
                management, contribution tracking, and community organization.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>
              &copy; 2024 MandalsaS. All rights reserved. Made with ❤️ for
              Indian festivals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
