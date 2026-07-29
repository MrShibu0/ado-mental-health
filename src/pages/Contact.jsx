import { Helmet } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { MapPin, Phone, Mail, Clock, AlertTriangle } from "lucide-react";
import contactImage from "../Images/Contact Page Banner.png";
import { toast } from "react-hot-toast";

const Contact = () => {
  const { t } = useTranslation("contact");
  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
      </Helmet>
      <main>
        <PageHeader 
          title={t("header.title")} 
          subtitle={t("header.subtitle")}
          breadcrumb={t("header.breadcrumb")}
        />
        
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img 
            src={contactImage} 
            alt="Contact Us" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              <div>
                <SectionTitle title={t("support.title")} className="mb-8" />
                <p className="text-muted mb-10 leading-relaxed">
                  {t("support.description")}
                </p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 text-teal">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{t("support.location.title")}</h4>
                      <p className="text-muted text-sm" dangerouslySetInnerHTML={{__html: t("support.location.address")}}></p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 text-teal">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{t("support.phone.title")}</h4>
                      <p className="text-muted text-sm">{t("support.phone.value")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 text-teal">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{t("support.email.title")}</h4>
                      <p className="text-muted text-sm">{t("support.email.value")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0 text-teal">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{t("support.hours.title")}</h4>
                      <p className="text-muted text-sm" dangerouslySetInnerHTML={{__html: t("support.hours.value")}}></p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-4 items-start">
                  <AlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-700 mb-1">{t("support.emergency.title")}</h4>
                    <p className="text-red-600 text-sm leading-relaxed">
                      <Trans i18nKey="support.emergency.description" t={t} components={{ strong: <strong className="font-bold" /> }} />
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <GlassCard className="bg-white">
                  <h3 className="text-2xl font-bold text-primary mb-6">{t("form.title")}</h3>
                  <form
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const name = e.target.name.value;
                      const email = e.target.email.value;
                      const phone = e.target.phone.value;
                      const subject = e.target.subject.value;
                      const message = e.target.message.value;

                      const actionToast = toast.loading("Sending your message...");
                      try {
                        const res = await fetch("/api/contact/messages", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name, email, phone, subject, message })
                        });
                        const data = await res.json();
                        if (res.ok) {
                          toast.success(data.message || "Message sent successfully!", { id: actionToast });
                          e.target.reset();
                        } else {
                          toast.error(data.error || "Failed to send message.", { id: actionToast });
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Network error. Please try again.", { id: actionToast });
                      }
                    }}
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">{t("form.labels.name")}</label>
                      <input type="text" id="name" required placeholder={t("form.placeholders.name")} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-teal focus:border-teal bg-gray-50/50" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t("form.labels.email")}</label>
                        <input type="email" id="email" required placeholder={t("form.placeholders.email")} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-teal focus:border-teal bg-gray-50/50" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{t("form.labels.phone")}</label>
                        <input type="tel" id="phone" placeholder={t("form.placeholders.phone")} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-teal focus:border-teal bg-gray-50/50" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">{t("form.labels.subject")}</label>
                      <input type="text" id="subject" placeholder={t("form.placeholders.subject")} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-teal focus:border-teal bg-gray-50/50" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">{t("form.labels.message")}</label>
                      <textarea id="message" required rows={5} placeholder={t("form.placeholders.message")} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-teal focus:border-teal bg-gray-50/50"></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full justify-center" size="lg">{t("form.submit")}</Button>
                  </form>
                </GlassCard>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
