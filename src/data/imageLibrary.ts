// Single image register for real WeWash photos. Used by pages for alt text/captions
// and by scripts/generate-sitemap.ts for the image sitemap. Never add stock/AI images.
// location: only set when the real job location is known; otherwise 'Lusaka' (city level) or null.

export interface WeWashImage {
  id: string;
  url: string; // stable CDN path
  service: string;
  serviceSlug: string;
  location: string | null;
  alt: string;
  caption: string;
  pageUrl: string; // page where the image genuinely belongs
  isProjectPhoto: boolean;
  beforeAfter?: 'before' | 'after';
  propertyType?: 'residential' | 'commercial' | 'vehicle';
  gbpReady: boolean; // suitable for Google Business Profile posts
}

const A = '/__l5e/assets-v1';

export const imageLibrary: WeWashImage[] = [
  { id: 'home-cleaning-crew', url: `${A}/b6998544-25b2-4b08-beb7-802fc8028b1e/home-cleaning-crew.jpg`, service: 'Window Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'WeWash technician pressure washing a window at a Lusaka home', caption: 'Window and glass cleaning by the WeWash team in Lusaka.', pageUrl: '/services', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'car-detailing-team', url: `${A}/9b6bbb29-220f-444c-83bd-65c124174874/car-detailing-team.jpg`, service: 'Car Detailing', serviceSlug: 'car-detailing', location: 'Lusaka', alt: 'WeWash detailing crew working on a customer car in Lusaka', caption: 'Mobile car detailing carried out on site by WeWash.', pageUrl: '/services/car-detailing', isProjectPhoto: true, propertyType: 'vehicle', gbpReady: true },
  { id: 'car-detailing-seats', url: `${A}/3bd9ba4d-a815-471e-b783-d1e865294926/car-detailing-seats.jpg`, service: 'Interior Car Cleaning', serviceSlug: 'car-detailing', location: 'Lusaka', alt: 'Car seats being deep cleaned during a WeWash interior valet', caption: 'Interior seat cleaning during a WeWash valet.', pageUrl: '/services/car-detailing', isProjectPhoto: true, propertyType: 'vehicle', gbpReady: true },
  { id: 'car-exterior-done', url: `${A}/8936c3e3-8aeb-4e6a-8ad8-3d063bb08042/car-exterior-done.jpg`, service: 'Car Detailing', serviceSlug: 'car-detailing', location: 'Lusaka', alt: 'Car exterior after a WeWash wash and detail', caption: 'Exterior finished and handed back to the owner.', pageUrl: '/services/car-detailing', isProjectPhoto: true, beforeAfter: 'after', propertyType: 'vehicle', gbpReady: true },
  { id: 'car-interior-clean', url: `${A}/1206d8d3-97e7-4077-bf33-596f718c3d99/car-interior-clean.jpg`, service: 'Interior Car Cleaning', serviceSlug: 'car-detailing', location: 'Lusaka', alt: 'Clean car interior after a WeWash interior detail', caption: 'Interior after vacuuming and upholstery treatment.', pageUrl: '/services/car-detailing', isProjectPhoto: true, beforeAfter: 'after', propertyType: 'vehicle', gbpReady: true },
  { id: 'lounge-evening', url: `${A}/946a99e6-3718-4628-ac4a-8da2e6220336/lounge-evening.jpg`, service: 'Home Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Lounge with sofas, rug and tiled floor after a WeWash clean in Lusaka', caption: 'Lounge finished, two-bedroom flat in Lusaka.', pageUrl: '/', isProjectPhoto: true, beforeAfter: 'after', propertyType: 'residential', gbpReady: true },
  { id: 'living-room-lounge', url: `${A}/8c61eace-4cd4-47ed-b280-2b914d26b21e/living-room-lounge.jpg`, service: 'Deep Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Open-plan kitchen and living room cleaned by WeWash', caption: 'Open-plan kitchen and lounge reset.', pageUrl: '/', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'lounge-finished', url: `${A}/1b952971-ac0c-4465-9ad8-357ceda5a427/lounge-finished.jpg`, service: 'Carpet Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Living room rug and floor after a WeWash clean', caption: 'Rug and floors done before hand-back.', pageUrl: '/', isProjectPhoto: true, beforeAfter: 'after', propertyType: 'residential', gbpReady: true },
  { id: 'floor-vacuum', url: `${A}/216f8542-efc0-4cf6-9c91-10c2ee24bece/floor-vacuum.jpg`, service: 'Deep Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Industrial vacuum on a polished marble floor during a WeWash deep clean', caption: 'Floors mid-clean on a move-out job.', pageUrl: '/', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'sofa-cleaned', url: `${A}/8315ac60-4817-43d0-980f-69caac608f23/sofa-cleaned.jpg`, service: 'Sofa Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Two-seater sofa after upholstery cleaning by WeWash', caption: 'Sofa dried and re-set after cleaning.', pageUrl: '/', isProjectPhoto: true, beforeAfter: 'after', propertyType: 'residential', gbpReady: true },
  { id: 'sofa-upholstery', url: `${A}/3283937c-9a10-4e9f-9b2a-b757331fe989/sofa-upholstery.jpg`, service: 'Upholstery Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Fabric three-seater sofa being cleaned during a WeWash upholstery job', caption: 'Upholstery wash on a fabric three-seater.', pageUrl: '/', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'kitchen-units', url: `${A}/eecd2285-f6e1-4976-98a5-5b470caffbdd/kitchen-units.jpg`, service: 'Deep Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Kitchen cupboards and cooker cleaned inside and out by WeWash', caption: 'Cupboards and cooker cleaned inside and out.', pageUrl: '/', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'kitchen-blinds', url: `${A}/7e50e70c-01e7-41ea-8c2f-bcff9b6ba7c6/kitchen-blinds.jpg`, service: 'Deep Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Stained kitchen blinds and sink before a WeWash deep clean', caption: 'Kitchen blinds before treatment.', pageUrl: '/', isProjectPhoto: true, beforeAfter: 'before', propertyType: 'residential', gbpReady: false },
  { id: 'bedroom-strip', url: `${A}/921d2992-7fab-4adc-93b1-0dc04c60ccb6/bedroom-strip.jpg`, service: 'Deep Cleaning', serviceSlug: 'home-cleaning', location: 'Lusaka', alt: 'Bedroom with bedding stripped ahead of a WeWash deep clean', caption: 'Bedding stripped on day one of a deep clean.', pageUrl: '/', isProjectPhoto: true, beforeAfter: 'before', propertyType: 'residential', gbpReady: false },
  { id: 'trained-maid-ironing', url: '', service: 'Domestic Cleaning', serviceSlug: 'trained-maids', location: 'Lusaka', alt: 'WeWash trained maid ironing during practical training', caption: 'Practical training for WeWash housekeepers.', pageUrl: '/services', isProjectPhoto: true, propertyType: 'residential', gbpReady: true },
  { id: 'facility-hotel-corridor', url: '', service: 'Facility Management', serviceSlug: 'facility-management', location: 'Lusaka', alt: 'Hotel corridor with patterned carpet maintained by WeWash', caption: 'Hotel corridor kept by our facility team.', pageUrl: '/services', isProjectPhoto: true, propertyType: 'commercial', gbpReady: true },
  { id: 'facility-windows', url: '', service: 'Glass Cleaning', serviceSlug: 'facility-management', location: 'Lusaka', alt: 'Glass-walled corridor at a commercial property in Lusaka after window cleaning', caption: 'Commercial glass cleaning in Lusaka.', pageUrl: '/services', isProjectPhoto: true, propertyType: 'commercial', gbpReady: true },
];

export const imagesForPage = (pageUrl: string) =>
  imageLibrary.filter((img) => img.pageUrl === pageUrl && img.url);
