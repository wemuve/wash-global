import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HeartHandshake, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLeadCapture } from '@/hooks/useLeadCapture';

const helpsWith = [
  'Companionship and conversation',
  'Meal preparation',
  'Light household cleaning',
  'Laundry',
  'Keeping the home organised',
  'Shopping and errands where appropriate',
  'Practical day-to-day help',
  'Updates for family, where the person agrees',
];

const notProvided = [
  'Nursing',
  'Medical treatment or diagnosis',
  'Giving medication',
  'Clinical care',
  'Emergency medical services',
];

const ElderlySupport = () => {
  const { captureLead, isLoading } = useLeadCapture();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const res = await captureLead({
      customerName: name,
      customerPhone: phone,
      message,
      serviceInterest: ['Elderly Home Support (waitlist)'],
      source: 'elderly_support_waitlist',
    });
    if (res.success) setSent(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>Elderly Home Support Lusaka – Coming Soon | WeWash Zambia</title>
        <meta name="description" content="WeWash is developing elderly home support in Lusaka: companionship, meals, light cleaning and practical help at home. Not a medical or nursing service. Join the interest list." />
        <link rel="canonical" href="https://wewashglobal.com/elderly-home-support-lusaka" />
        <meta property="og:title" content="Elderly Home Support in Lusaka – Coming Soon" />
        <meta property="og:description" content="Companionship and practical home help for older people in Lusaka. Join the interest list." />
        <meta property="og:url" content="https://wewashglobal.com/elderly-home-support-lusaka" />
      </Helmet>

      <section className="section-spacing">
        <div className="container-wewash max-w-3xl">
          <span className="badge-gold mb-6">Coming soon</span>
          <h1 className="text-foreground text-4xl md:text-5xl font-bold mb-6">
            Elderly home support in Lusaka
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            WeWash is developing an elderly home-support service in Lusaka focused on companionship,
            practical household help and day-to-day support. It isn't running yet.
          </p>
          <p className="text-lg text-muted-foreground">
            Where specialist care is needed, we intend to work with properly qualified elderly-care
            professionals so families can get the right level of support.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wewash max-w-3xl grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <HeartHandshake className="h-6 w-6 text-secondary mb-3" />
            <h2 className="text-xl font-semibold text-foreground mb-4">What we plan to help with</h2>
            <ul className="space-y-2">
              {helpsWith.map((i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <ShieldAlert className="h-6 w-6 text-secondary mb-3" />
            <h2 className="text-xl font-semibold text-foreground mb-4">What we don't provide</h2>
            <ul className="space-y-2 mb-4">
              {notProvided.map((i) => (
                <li key={i} className="text-sm text-muted-foreground">— {i}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              WeWash is not a medical or nursing provider. For health needs, please speak to a
              qualified care provider or doctor.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-wewash max-w-xl">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Join the interest list</h2>
          <p className="text-muted-foreground mb-6">
            Tell us a little about what your family needs. We'll contact you when the service opens.
            Families living abroad are welcome too.
          </p>
          {sent ? (
            <p className="rounded-xl bg-secondary/10 p-4 text-foreground">
              Thank you — we've got your details and will be in touch.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              <Input placeholder="Phone or WhatsApp number" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} />
              <Textarea placeholder="What kind of help would be useful? (optional)" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
              <Button type="submit" className="btn-gold" disabled={isLoading}>
                {isLoading ? 'Sending…' : 'Add me to the list'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ElderlySupport;
