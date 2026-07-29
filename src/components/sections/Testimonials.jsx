import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../ui/SectionTitle";
import { Card, CardBody } from "../ui/Card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    content: "The support I received changed my life. I finally feel understood and equipped to handle my challenges.",
    author: "Community Member",
  },
  {
    content: "Our school environment has completely transformed since the mental health awareness workshops.",
    author: "Local Teacher",
  },
  {
    content: "The center provides a safe haven. Their dedication to confidentiality and care is unmatched in La Gonâve.",
    author: "Program Participant",
  }
];

export const Testimonials = () => {
  const { t } = useTranslation("home");
  return (
    <div className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle 
          title={t("testimonials.title")} 
          subtitle={t("testimonials.subtitle")}
          centered
          className="mb-16"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white relative">
                <CardBody className="pt-10 pb-8 px-8 flex flex-col h-full justify-between">
                  <Quote className="absolute top-6 left-6 w-8 h-8 text-teal/20" />
                  <p className="text-gray-700 italic relative z-10 text-lg leading-relaxed mb-6">
                    "{t(`testimonials.items.${index}.content`)}"
                  </p>
                  <p className="text-primary font-bold">{t(`testimonials.items.${index}.author`)}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
