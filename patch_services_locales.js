import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['en', 'fr', 'ht'];

const servicesData = {
  en: {
    "psychological-assessments": { "title": "Psychological Assessments", "description": "Comprehensive evaluations to identify emotional, behavioral, developmental, and psychological concerns." },
    "psychiatric-consultations": { "title": "Psychiatric Consultations", "description": "Professional psychiatric evaluation, diagnosis, treatment planning, and medication management." },
    "individual-therapy": { "title": "Individual Therapy", "description": "Evidence-based counseling for depression, anxiety, trauma, stress, grief, and emotional challenges." },
    "family-therapy": { "title": "Family Therapy", "description": "Helping families improve communication, relationships, conflict resolution, and support systems." },
    "group-therapy": { "title": "Group Therapy", "description": "Structured therapeutic group sessions promoting healing, support, and shared learning." },
    "crisis-intervention": { "title": "Crisis Intervention", "description": "Immediate support for emotional crises, acute distress, and urgent mental health situations." },
    "substance-use-support": { "title": "Substance Use Support", "description": "Recovery-focused services for individuals affected by addiction and substance use disorders." },
    "older-adult-care": { "title": "Older Adult Mental Health Care", "description": "Specialized services addressing the psychological and emotional needs of aging populations." }
  },
  fr: {
    "psychological-assessments": { "title": "Évaluations Psychologiques", "description": "Des évaluations complètes pour identifier les préoccupations émotionnelles, comportementales, développementales et psychologiques." },
    "psychiatric-consultations": { "title": "Consultations Psychiatriques", "description": "Évaluation psychiatrique professionnelle, diagnostic, planification du traitement et gestion des médicaments." },
    "individual-therapy": { "title": "Thérapie Individuelle", "description": "Des conseils fondés sur des preuves pour la dépression, l'anxiété, les traumatismes, le stress, le deuil et les défis émotionnels." },
    "family-therapy": { "title": "Thérapie Familiale", "description": "Aider les familles à améliorer la communication, les relations, la résolution de conflits et les systèmes de soutien." },
    "group-therapy": { "title": "Thérapie de Groupe", "description": "Des séances de groupe thérapeutiques structurées favorisant la guérison, le soutien et l'apprentissage partagé." },
    "crisis-intervention": { "title": "Intervention de Crise", "description": "Un soutien immédiat en cas de crises émotionnelles, de détresse aiguë et de situations d'urgence en santé mentale." },
    "substance-use-support": { "title": "Soutien en cas de Toxicomanie", "description": "Services axés sur le rétablissement pour les personnes touchées par la dépendance et les troubles liés à l'usage de substances." },
    "older-adult-care": { "title": "Soins de Santé Mentale pour les Personnes Âgées", "description": "Des services spécialisés répondant aux besoins psychologiques et émotionnels des populations vieillissantes." }
  },
  ht: {
    "psychological-assessments": { "title": "Evalyasyon Sikolojik", "description": "Evalyasyon konplè pou idantifye pwoblèm emosyonèl, konpòtman, devlopman, ak sikolojik." },
    "psychiatric-consultations": { "title": "Konsiltasyon Sikyatrik", "description": "Evalyasyon sikyatrik pwofesyonèl, dyagnostik, planifikasyon tretman, ak jesyon medikaman." },
    "individual-therapy": { "title": "Terapi Endividyèl", "description": "Konsèy ki baze sou prèv pou depresyon, enkyetid, chòk, estrès, dèy, ak defi emosyonèl." },
    "family-therapy": { "title": "Terapi Fanmi", "description": "Ede fanmi yo amelyore kominikasyon, relasyon, rezolisyon konfli, ak sistèm sipò." },
    "group-therapy": { "title": "Terapi an Gwoup", "description": "Sesyon gwoup terapetik estriktire ki ankouraje gerizon, sipò, ak aprantisaj pataje." },
    "crisis-intervention": { "title": "Entèvansyon nan Kriz", "description": "Sipò imedya pou kriz emosyonèl, detrès egi, ak sitiyasyon ijan sante mantal." },
    "substance-use-support": { "title": "Sipò pou Moun k ap Sèvi ak Sibstans", "description": "Sèvis ki konsantre sou rekiperasyon pou moun ki afekte pa dejwe ak twoub itilizasyon sibstans." },
    "older-adult-care": { "title": "Swen Sante Mantal pou Granmoun Aje", "description": "Sèvis espesyalize ki adrese bezwen sikolojik ak emosyonèl popilasyon k ap granmoun yo." }
  }
};

locales.forEach(loc => {
  const file = path.join(__dirname, 'public', 'locales', loc, 'services.json');
  let data = {};
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  data.list = servicesData[loc];
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Updated ${file}`);
});
