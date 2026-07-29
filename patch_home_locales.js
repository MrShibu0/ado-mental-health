import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['en', 'fr', 'ht'];

const newContent = {
  en: {
    seo: {
      title: "ADO Mental Health Support Center | La Gonâve, Haiti",
      description: "Providing accessible psychological support, counseling services, and community-based mental health services in Anse-à-Galets, La Gonâve."
    },
    mission: {
      title: "Our Mission",
      description: "To improve psychological well-being, strengthen resilience, and expand access to high-quality mental health and psychosocial support services for individuals, families, and communities throughout La Gonâve.",
      cards: [
        { title: "Compassionate Care", desc: "Providing culturally responsive and empathetic support tailored to our community's needs." },
        { title: "Confidentiality & Trust", desc: "Ensuring a safe, secure, and stigma-free environment for all our patients." },
        { title: "Community Resilience", desc: "Strengthening local networks to build a supportive environment for mental well-being." }
      ]
    },
    servicesOverview: {
      title: "Comprehensive Mental Health Services",
      subtitle: "Professional care designed to help individuals and families thrive in a safe, confidential environment.",
      viewAll: "View All Services"
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "Hear from the individuals and community members who have experienced the positive impact of our programs.",
      items: [
        { author: "Community Member", content: "The support I received changed my life. I finally feel understood and equipped to handle my challenges." },
        { author: "Local Teacher", content: "Our school environment has completely transformed since the mental health awareness workshops." },
        { author: "Program Participant", content: "The center provides a safe haven. Their dedication to confidentiality and care is unmatched in La Gonâve." }
      ]
    }
  },
  fr: {
    seo: {
      title: "Centre de Soutien en Santé Mentale ADO | La Gonâve, Haïti",
      description: "Fournir un soutien psychologique accessible, des services de conseil et des services de santé mentale communautaires à Anse-à-Galets, La Gonâve."
    },
    mission: {
      title: "Notre Mission",
      description: "Améliorer le bien-être psychologique, renforcer la résilience et élargir l'accès à des services de santé mentale et de soutien psychosocial de haute qualité pour les individus, les familles et les communautés de La Gonâve.",
      cards: [
        { title: "Soins Compatissants", desc: "Fournir un soutien empathique et culturellement adapté aux besoins de notre communauté." },
        { title: "Confidentialité et Confiance", desc: "Garantir un environnement sûr, sécurisé et sans stigmatisation pour tous nos patients." },
        { title: "Résilience Communautaire", desc: "Renforcer les réseaux locaux pour créer un environnement favorable au bien-être mental." }
      ]
    },
    servicesOverview: {
      title: "Services Complets de Santé Mentale",
      subtitle: "Des soins professionnels conçus pour aider les individus et les familles à s'épanouir dans un environnement sûr et confidentiel.",
      viewAll: "Voir Tous les Services"
    },
    testimonials: {
      title: "Histoires de Réussite",
      subtitle: "Écoutez les individus et les membres de la communauté qui ont ressenti l'impact positif de nos programmes.",
      items: [
        { author: "Membre de la Communauté", content: "Le soutien que j'ai reçu a changé ma vie. Je me sens enfin compris et outillé pour faire face à mes défis." },
        { author: "Enseignant Local", content: "L'environnement de notre école a été complètement transformé depuis les ateliers de sensibilisation à la santé mentale." },
        { author: "Participant au Programme", content: "Le centre offre un refuge sûr. Leur dévouement à la confidentialité et aux soins est inégalé à La Gonâve." }
      ]
    }
  },
  ht: {
    seo: {
      title: "Sant Sipò pou Sante Mantal ADO | La Gonâve, Ayiti",
      description: "Bay sipò sikolojik aksesib, sèvis konsèy, ak sèvis sante mantal ki baze nan kominote a nan Anse-à-Galets, La Gonâve."
    },
    mission: {
      title: "Misyon Nou",
      description: "Pou amelyore byennèt sikolojik, ranfòse rezilyans, epi elaji aksè nan bon jan kalite sèvis sante mantal ak sipò sikososyal pou moun, fanmi, ak kominote toupatou nan La Gonâve.",
      cards: [
        { title: "Swen ak Konpasyon", desc: "Bay sipò ki adapte ak kilti nou epi ki gen senpati pou bezwen kominote nou an." },
        { title: "Konfidansyalite ak Konfyans", desc: "Asire yon anviwònman ki an sekirite, epi san prejije pou tout pasyan nou yo." },
        { title: "Rezilyans Kominotè", desc: "Ranfòse rezo lokal yo pou konstwi yon anviwònman ki bay sipò pou byennèt mantal." }
      ]
    },
    servicesOverview: {
      title: "Sèvis Sante Mantal Konplè",
      subtitle: "Swen pwofesyonèl ki fèt pou ede moun ak fanmi devlope nan yon anviwònman ki an sekirite epi ki konfidansyèl.",
      viewAll: "Wè Tout Sèvis Yo"
    },
    testimonials: {
      title: "Istwa Siksè",
      subtitle: "Tande sa moun ak manm kominote yo ki te fè eksperyans enpak pozitif pwogram nou yo ap di.",
      items: [
        { author: "Manm Kominote A", content: "Sipò mwen te resevwa a chanje lavi m. Finalman mwen santi yo konprann mwen epi mwen gen zouti pou m jere defi m yo." },
        { author: "Pwofesè Lokal", content: "Anviwònman lekòl nou an chanje nèt depi atelye sansibilizasyon sou sante mantal yo." },
        { author: "Patisipan nan Pwogram nan", content: "Sant lan se yon refij ki an sekirite. Devouman yo genyen pou konfidansyalite ak swen pa gen parèy nan La Gonâve." }
      ]
    }
  }
};

locales.forEach(loc => {
  const file = path.join(__dirname, 'public', 'locales', loc, 'home.json');
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  data.seo = newContent[loc].seo;
  data.mission = newContent[loc].mission;
  data.servicesOverview = newContent[loc].servicesOverview;
  data.testimonials = newContent[loc].testimonials;
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Updated ${file}`);
});
