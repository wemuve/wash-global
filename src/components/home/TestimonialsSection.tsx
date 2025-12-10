import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Grace Mwanza',
      role: 'Homeowner',
      location: 'Lusaka, Zambia',
      rating: 5,
      text: "WeWash has transformed how I manage my home. Their team is professional, punctual, and the quality of work is exceptional. I've been using them for 2 years now!",
      avatar: 'GM',
    },
    {
      name: 'David Chishimba',
      role: 'Property Manager',
      location: 'Kitwe, Zambia',
      rating: 5,
      text: "Managing multiple properties became so much easier with WeWash. Their facility management service is top-notch and their response time is incredible.",
      avatar: 'DC',
    },
    {
      name: 'Thandiwe Phiri',
      role: 'Business Owner',
      location: 'Ndola, Zambia',
      rating: 5,
      text: "Finding a reliable cleaning service was challenging until we found WeWash. The team understands our needs and always delivers excellence.",
      avatar: 'TP',
    },
    {
      name: 'Michael Banda',
      role: 'Fleet Manager',
      location: 'Lusaka, Zambia',
      rating: 5,
      text: "Our company vehicles have never looked better. The mobile car detailing service is convenient and professional. Highly recommend their business packages!",
      avatar: 'MB',
    },
    {
      name: 'Linda Tembo',
      role: 'Hotel Manager',
      location: 'Livingstone, Zambia',
      rating: 5,
      text: "WeWash handles all our hotel cleaning needs. Their trained staff and attention to detail help us maintain our 5-star standards every single day.",
      avatar: 'LT',
    },
    {
      name: 'Joseph Mukuka',
      role: 'Office Administrator',
      location: 'Kabwe, Zambia',
      rating: 5,
      text: "Excellent service from start to finish. The booking was easy, communication was great, and the results exceeded my expectations. Will definitely use again!",
      avatar: 'JM',
    },
  ];

  return (
    <section className="section-spacing bg-gradient-subtle">
      <div className="container-wewash">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-gold mb-4">Testimonials</span>
          <h2 className="text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say 
            about their experience with WeWash Global.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="card-elevated"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 text-wewash-gold fill-wewash-gold" 
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Trusted by businesses and homeowners across Zambia</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <span className="text-2xl font-bold text-foreground">🇿🇲 Lusaka</span>
            <span className="text-2xl font-bold text-foreground">🇿🇲 Copperbelt</span>
            <span className="text-2xl font-bold text-foreground">🇿🇲 Livingstone</span>
            <span className="text-muted-foreground">& expanding nationally</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;