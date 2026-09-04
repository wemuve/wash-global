import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | WeWash Global</title>
        <meta
          name="description"
          content="Read the terms of service for WeWash Global cleaning, car detailing, and pool services in Lusaka, Zambia."
        />
        <link rel="canonical" href="https://wewashglobal.com/terms" />
      </Helmet>

      <section className="container-wewash py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString("en-ZM", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Quotes and estimates</h2>
              <p>
                All prices shown on this website are starting estimates based on typical jobs. The final price depends on the size, condition, and location of the work. We confirm the exact cost before starting any job.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">2. Booking and cancellation</h2>
              <p>
                Bookings are confirmed once we accept your request and agree on a time. If you need to reschedule or cancel, please let us know at least 24 hours in advance so we can reassign the team.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Payment</h2>
              <p>
                We operate on a pay-after-service model for most jobs. Payment is only collected after the work is completed to your satisfaction, unless otherwise agreed in writing for large commercial or pool projects.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Satisfaction and rework</h2>
              <p>
                If something is not right, tell us within 24 hours of the service and we will return to make it right, free of charge.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">5. Limitation of liability</h2>
              <p>
                We take care in every home and workplace, but we are not liable for pre-existing damage or wear that becomes visible only after cleaning. Please let the team know about fragile or valuable items before we begin.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">6. Contact</h2>
              <p>
                For questions about these terms, email{" "}
                <a href="mailto:booking@wewashglobal.com" className="text-secondary hover:underline">
                  booking@wewashglobal.com
                </a>{" "}
                or call{" "}
                <a href="tel:+260768671420" className="text-secondary hover:underline">
                  +260 768 671 420
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
