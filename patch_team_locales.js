import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['en', 'fr', 'ht'];

const newContent = {
  en: {
    note: "Our team is continuing to grow. We already have seven dedicated professionals who will be joining the ADO Center team. Their profiles will be added to the website as they become available. Together, we are committed to providing compassionate, high-quality mental health and psychosocial support services to the people of Anse-à-Galets, La Gonâve, Haiti.",
    roles: {
      founder: "Founder & CEO"
    }
  },
  fr: {
    note: "Notre équipe continue de s'agrandir. Nous avons déjà sept professionnels dévoués qui rejoindront l'équipe du Centre ADO. Leurs profils seront ajoutés au site Web dès qu'ils seront disponibles. Ensemble, nous nous engageons à fournir des services de santé mentale et de soutien psychosocial empreints de compassion et de haute qualité à la population d'Anse-à-Galets, La Gonâve, Haïti.",
    roles: {
      founder: "Fondatrice et PDG"
    }
  },
  ht: {
    note: "Ekip nou an ap kontinye grandi. Nou deja gen sèt pwofesyonèl devwe ki pral vin jwenn ekip Sant ADO a. Y ap ajoute pwofil yo sou sit wèb la ozanviwon yo disponib. Ansanm, nou pran angajman pou nou bay popilasyon Anse-à-Galets, La Gonâve, Ayiti, sèvis sante mantal ak sipò sikososyal ki gen bon jan kalite epi ki plen konpasyon.",
    roles: {
      founder: "Fondatè ak PDG"
    }
  }
};

locales.forEach(loc => {
  const file = path.join(__dirname, 'public', 'locales', loc, 'team.json');
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  data.note = newContent[loc].note;
  data.roles = newContent[loc].roles;
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Updated ${file}`);
});
