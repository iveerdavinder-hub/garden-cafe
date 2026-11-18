import faqDataJson from './faqData.json';

export interface FAQItem {
  id: string;
  category: 'all' | 'coffee' | 'reservations' | 'food' | 'space';
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = faqDataJson.faqs as FAQItem[];
