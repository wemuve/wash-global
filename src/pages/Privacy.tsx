import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | WeWash Global Zambia</title>
        <meta
          name="description"
          content="How WeWash Global collects, uses, stores and protects personal data under Zambia's Data Protection Act No. 3 of 2021 when you book cleaning, car detailing or pool services."
        />
        <link rel="canonical" href="https://wewashglobal.com/privacy" />
      </Helmet>

      <section className="container-wewash py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString("en-ZM", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
            <p>
              WeWash Global ("WeWash", "we", "us") is a cleaning and property services company registered and
              operating in Zambia, with its office at D13 Antelope Close, Kabulonga, Lusaka 10101. This policy
              explains how we handle personal data in line with the Data Protection Act No. 3 of 2021 of the Laws
              of Zambia, and it applies to wewashglobal.com, our WhatsApp bookings and our phone bookings.
            </p>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Who is responsible for your data</h2>
              <p>
                WeWash Global is the data controller for the personal data described here. You can reach our data
                protection contact at{" "}
                <a href="mailto:booking@wewashglobal.com" className="text-secondary hover:underline">booking@wewashglobal.com</a>{" "}
                or <a href="tel:+260768671420" className="text-secondary hover:underline">+260 768 671 420</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">2. What we collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, phone number, email address and the address where the work will be done.</li>
                <li>Booking details: service requested, date and time, access notes and special instructions.</li>
                <li>Payment record after the job (method used, amount, date). We never store card or PIN data.</li>
                <li>Messages you send us by WhatsApp, email or the website forms.</li>
                <li>Basic website analytics (pages visited, device type) through Google Analytics.</li>
                <li>Before-and-after job photos, only where you have agreed to them being taken.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Why we use it (lawful basis)</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-foreground">Performing your contract</span> — quoting, scheduling, dispatching a crew, invoicing and follow-up.</li>
                <li><span className="text-foreground">Legitimate business interest</span> — quality control, staff safety, fraud prevention and improving our service.</li>
                <li><span className="text-foreground">Your consent</span> — marketing messages, promotional offers and use of job photos. You may withdraw consent at any time.</li>
                <li><span className="text-foreground">Legal obligation</span> — tax and accounting records required by Zambian law.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Who we share it with</h2>
              <p>
                We share only what is necessary: the vetted cleaner, detailer or technician assigned to your job;
                our payment providers (mobile money and banking partners) who process payments directly; and our
                technology providers for hosting, email and WhatsApp messaging. We do not sell your personal data
                and we do not share it for third-party advertising.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">5. Transfers outside Zambia</h2>
              <p>
                Some of our hosting and messaging providers store data on servers outside Zambia. Where that
                happens we rely on providers that apply recognised security and contractual safeguards, as required
                by the Data Protection Act.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">6. How long we keep it</h2>
              <p>
                Booking and customer records are kept for six years to meet Zambian tax and accounting
                requirements. Marketing contact details are kept until you opt out. Quotation enquiries that do not
                become bookings are deleted after 24 months.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">7. Your rights</h2>
              <p>
                Under the Data Protection Act No. 3 of 2021 you may ask us to give you a copy of your data, correct
                it, delete it, restrict or object to how we use it, or move it to another provider. Email{" "}
                <a href="mailto:booking@wewashglobal.com" className="text-secondary hover:underline">booking@wewashglobal.com</a>{" "}
                and we will respond within 30 days. If you are not satisfied, you may complain to the Data
                Protection Commissioner under the Ministry of Technology and Science in Lusaka.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">8. Security</h2>
              <p>
                Accounts and booking data are protected with encryption in transit, role-based access and
                database-level access rules, so staff only see the jobs they are assigned to. Our crews are vetted
                and sign confidentiality undertakings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">9. Cookies and analytics</h2>
              <p>
                We use essential cookies to keep you signed in, and Google Analytics and Google Ads tags to
                understand how the site is used. You can block cookies in your browser without losing access to
                bookings by WhatsApp or phone.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">10. Children</h2>
              <p>Our services are booked by adults. We do not knowingly collect data from anyone under 18.</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">11. Contact us</h2>
              <p>
                WeWash Global — D13 Antelope Close, Kabulonga, Lusaka 10101, Zambia.<br />
                Email: <a href="mailto:booking@wewashglobal.com" className="text-secondary hover:underline">booking@wewashglobal.com</a><br />
                Phone / WhatsApp: <a href="tel:+260768671420" className="text-secondary hover:underline">+260 768 671 420</a><br />
                Hours: Monday–Saturday 07:00–19:00, Sunday 08:00–16:00.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
