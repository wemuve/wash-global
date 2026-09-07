import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | WeWash Global Zambia</title>
        <meta
          name="description"
          content="Terms of service for WeWash Global cleaning, car detailing, fumigation and pool services in Lusaka, Zambia — quotes, bookings, payment, cancellation and liability."
        />
        <link rel="canonical" href="https://wewashglobal.com/terms" />
      </Helmet>

      <section className="container-wewash py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString("en-ZM", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-8 text-muted-foreground font-light leading-relaxed">
            <p>
              These terms apply to every service booked with WeWash Global, D13 Antelope Close, Kabulonga, Lusaka
              10101, Zambia. They are governed by the laws of Zambia. By booking with us online, on WhatsApp or by
              phone, you accept these terms.
            </p>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Quotes and estimates</h2>
              <p>
                Every price on this website and in our estimator is a starting estimate in Zambian Kwacha (ZMW),
                not a binding quotation. Estimates are calculated as: base service price × condition multiplier,
                plus any add-ons, plus transport. The final price is confirmed by our team after assessing scope,
                condition, access, labour and materials, and is agreed with you before work begins.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">2. Transport</h2>
              <p>
                For mobile services, transport is estimated as a return trip from our Kabulonga base and shown as a
                separate line. If you drop your vehicle at our base, no transport is charged.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Booking and confirmation</h2>
              <p>
                A booking is confirmed once our team accepts the request and agrees a date and time with you. We
                may propose a different slot if the requested time is fully booked. Someone aged 18 or over must be
                available to give the crew access.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Payment</h2>
              <p>
                We work on a pay-after-service basis. No payment is taken online at the time of booking. You settle
                the agreed amount once the work is complete, by mobile money (MTN or Airtel), cash or bank
                transfer. Corporate, government and large pool or facility contracts may be invoiced on agreed
                terms, payable within 14 days unless otherwise agreed in writing.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">5. Cancellation and rescheduling</h2>
              <p>
                Please give us at least 24 hours' notice to cancel or reschedule so we can reassign the crew. If
                the crew arrives and cannot get access, or the job is cancelled on site, a call-out fee covering
                transport and crew time may apply.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">6. Scope changes on site</h2>
              <p>
                If the job on the day is materially larger or dirtier than described, our supervisor will explain
                the revised price and get your approval before continuing. We never add charges after the fact
                without your agreement.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">7. Satisfaction and rework</h2>
              <p>
                If something is not right, tell us within 24 hours of the service and we will return to put it
                right at no extra cost, provided the area has not been used or altered in the meantime.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">8. Your responsibilities</h2>
              <p>
                Please secure cash, jewellery and valuables, tell us about fragile items, pets, faulty fittings or
                pre-existing damage, and make sure water and power are available where the job needs them.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">9. Liability</h2>
              <p>
                We take care in every home, vehicle and workplace, and we investigate any damage reported within 24
                hours. We are not liable for pre-existing damage, normal wear, fading or defects that only become
                visible once an area is cleaned, nor for indirect losses. Where we are liable, our liability is
                limited to the value of the service concerned or repair of the affected item.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">10. Staff</h2>
              <p>
                Our cleaners, detailers and technicians are vetted, trained and remain WeWash staff or contracted
                partners. Please do not engage them privately for work arranged outside WeWash during, or within
                six months of, an engagement made through us.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">11. Referral credit</h2>
              <p>
                Referral credit of K50 is awarded once a referred customer's first job is completed and paid. Credit
                is applied against future WeWash services and has no cash value.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">12. Privacy</h2>
              <p>
                We handle personal data as described in our{" "}
                <a href="/privacy" className="text-secondary hover:underline">Privacy Policy</a>, in line with
                Zambia's Data Protection Act No. 3 of 2021.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-2">13. Governing law and contact</h2>
              <p>
                These terms are governed by Zambian law, and disputes fall under the courts of Zambia. We will
                always try to resolve matters directly first.<br /><br />
                WeWash Global — D13 Antelope Close, Kabulonga, Lusaka 10101.<br />
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

export default Terms;
