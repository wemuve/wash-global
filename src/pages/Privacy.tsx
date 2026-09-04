import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | WeWash Global</title>
        <meta
          name="description"
          content="Learn how WeWash Global collects, uses, and protects your personal information when you book cleaning, car detailing, or pool services in Zambia."
        />
        <link rel="canonical" href="https://wewashglobal.com/privacy" />
      </Helmet>

      <section className="container-wewash py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString("en-ZM", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Information we collect</h2>
              <p>
                When you request a quote or book a service, we collect your name, phone number, email, address, and details about the work you need. This helps us arrange the right team, estimate travel, and confirm your booking.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">2. How we use your information</h2>
              <p>
                We use your details only to provide and improve our services — scheduling appointments, sending confirmations, coordinating with our cleaning crews, and responding to your questions. We do not sell your personal data.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Sharing with third parties</h2>
              <p>
                We share information only with the trusted staff assigned to your job. Payment details are handled directly by our secure payment partners and are never stored on our servers.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Your choices</h2>
              <p>
                You can ask us to update or delete your contact details at any time by emailing{" "}
                <a href="mailto:booking@wewashglobal.com" className="text-secondary hover:underline">
                  booking@wewashglobal.com
                </a>{" "}
                or calling{" "}
                <a href="tel:+260768671420" className="text-secondary hover:underline">
                  +260 768 671 420
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">5. Security</h2>
              <p>
                We protect your data with industry-standard security measures and restrict internal access to staff who need it to complete your service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
