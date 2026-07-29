import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export const MultiStepDonationForm = () => {
  const { t } = useTranslation("donate");
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState("one-time"); // one-time or monthly
  const [amount, setAmount] = useState(50);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  const nextStep = async () => {
    if (step === 2) {
      const isValid = await trigger();
      if (!isValid) return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          frequency: frequency,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
        }),
      });

      const result = await response.json();

      if (response.ok && result.checkoutUrl) {
        window.location.href = result.checkoutUrl; // Redirect to Stripe
      } else {
        toast.error(result.error || t("form.errors.failed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("form.errors.network"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= i ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
              )}>
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
              {i < 3 && (
                <div className={cn(
                  "w-10 h-1 transition-colors",
                  step > i ? "bg-primary" : "bg-slate-200"
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm font-semibold text-primary">
          {step === 1 && t("form.steps.amount")}
          {step === 2 && t("form.steps.details")}
          {step === 3 && t("form.steps.payment")}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 flex-grow">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: AMOUNT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Frequency Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFrequency("one-time")}
                  className={cn(
                    "flex-1 py-3 text-sm font-semibold rounded-lg transition-all",
                    frequency === "one-time" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t("form.amount.give_once")}
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("monthly")}
                  className={cn(
                    "flex-1 py-3 text-sm font-semibold rounded-lg transition-all",
                    frequency === "monthly" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t("form.amount.give_monthly")}
                </button>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-3 gap-4">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setAmount(preset); setIsCustomAmount(false); }}
                    className={cn(
                      "py-4 rounded-xl text-lg font-bold transition-all border-2",
                      amount === preset && !isCustomAmount 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    ${preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setIsCustomAmount(true); setAmount(""); }}
                  className={cn(
                    "py-4 rounded-xl text-lg font-bold transition-all border-2",
                    isCustomAmount 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {t("form.amount.custom")}
                </button>
              </div>

              {/* Custom Amount Input */}
              {isCustomAmount && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative mt-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xl font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="block w-full pl-8 pr-4 py-4 text-xl font-bold text-primary bg-slate-50 border-2 border-primary/20 rounded-xl focus:ring-0 focus:border-primary transition-colors"
                    placeholder={t("form.amount.custom_placeholder")}
                  />
                </motion.div>
              )}

              <button
                onClick={nextStep}
                disabled={!amount || amount <= 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("form.amount.next")} <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">{t("form.details.labels.fullName")}</label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName", { required: t("form.details.validation.name_required") })}
                  className="block w-full rounded-xl border-slate-200 py-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder={t("form.details.placeholders.fullName")}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t("form.details.labels.email")}</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: t("form.details.validation.email_required"),
                    pattern: { value: /^\S+@\S+$/i, message: t("form.details.validation.email_invalid") }
                  })}
                  className="block w-full rounded-xl border-slate-200 py-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder={t("form.details.placeholders.email")}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">{t("form.details.labels.phone")}</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="block w-full rounded-xl border-slate-200 py-3 focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder={t("form.details.placeholders.phone")}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">{t("form.details.labels.country")}</label>
                  <input
                    id="country"
                    type="text"
                    {...register("country")}
                    className="block w-full rounded-xl border-slate-200 py-3 focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder={t("form.details.placeholders.country")}
                    defaultValue={t("form.details.placeholders.country")}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
                >
                  {t("form.details.continue")}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT SUMMARY */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                <div className="text-slate-500 mb-2">{t("form.payment.donating")}</div>
                <div className="text-5xl font-bold text-primary mb-2">${amount}</div>
                <div className="text-slate-600 font-medium capitalize">{frequency === 'monthly' ? t("form.payment.monthly") : t("form.payment.one_time")}</div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex justify-between">
                  <span>{t("form.payment.name")}</span>
                  <span className="font-semibold text-slate-900">{getValues("fullName")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("form.payment.email")}</span>
                  <span className="font-semibold text-slate-900">{getValues("email")}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between font-bold text-base text-slate-900">
                  <span>{t("form.payment.total")}</span>
                  <span>${amount}.00 {t("form.payment.usd")}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-teal text-white rounded-xl font-bold text-lg hover:bg-teal/90 transition-colors shadow-lg shadow-teal/20 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t("form.payment.processing")}</>
                  ) : (
                    <>{t("form.payment.complete")}</>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                {t("form.payment.secure_note")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
