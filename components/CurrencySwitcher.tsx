"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "GBP" | "USD" | "EUR" | "AED";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInGBP: number) => string;
}

const rates: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  GBP: { rate: 1.0, symbol: "£", prefix: true },
  USD: { rate: 1.28, symbol: "$", prefix: true },
  EUR: { rate: 1.17, symbol: "€", prefix: true },
  AED: { rate: 4.70, symbol: "AED ", prefix: true },
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "GBP",
  setCurrency: () => {},
  formatPrice: (amount) => `£${amount.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GBP");

  useEffect(() => {
    const saved = localStorage.getItem("valmont_currency") as Currency;
    if (saved && rates[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("valmont_currency", c);
  };

  const formatPrice = (amountInGBP: number) => {
    const config = rates[currency];
    const converted = Math.round(amountInGBP * config.rate);
    const formatted = converted.toLocaleString();
    return config.prefix ? `${config.symbol}${formatted}` : `${formatted} ${config.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const currencies: Currency[] = ["GBP", "USD", "EUR", "AED"];

  return (
    <div className="inline-flex items-center bg-[#1A1A1A] border border-[rgba(245,241,234,0.15)] rounded-[2px] p-0.5">
      {currencies.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 text-[9px] tracking-[0.2em] font-mono uppercase transition-all duration-200 ${
            currency === c
              ? "bg-[#A8895C] text-[#0D0D0D] font-semibold shadow-sm"
              : "text-[#A39E93] hover:text-[#F5F1EA]"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
