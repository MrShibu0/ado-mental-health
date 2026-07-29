import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";

const DonateSuccess = () => {
  const { t } = useTranslation("donate");
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <>
      <Helmet>
        <title>{t("success.seo_title")}</title>
      </Helmet>
      <main className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100"
        >
          <div className="mx-auto w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mb-6 text-teal">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">
            {t("success.title")}
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {t("success.message")}
          </p>
          
          {sessionId && (
            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-500 break-all border border-slate-100">
              <span className="font-semibold text-slate-700">Transaction Reference:</span><br/>
              {sessionId}
            </div>
          )}

          <Link to="/">
            <Button className="w-full h-14 text-lg">{t("success.button")}</Button>
          </Link>
        </motion.div>
      </main>
    </>
  );
};

export default DonateSuccess;
