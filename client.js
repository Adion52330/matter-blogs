import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: "sdu7xsnt",
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: true,
  token: "sketG1L24CR4cIU0QSJVVJ0NonzRSuAtn7JmRrxHozwzVFRtVE2IZVVLivcVYCq0AprjhX3CrNKZTBdiiMUfiZObQKcA7IXxQ0sl5MswdWTbBN1WCiZgfpXkI5BuY8Rv6pGczAdFDdVlqoR9fRuAiwYagveGP4vMuwgWPHqOVM2TVWJRXQr1",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);