"use client";

import { Input } from "@/components/ui/input";

type CodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  // Chamado quando os 6 dígitos estão completos
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

// Campo do código de 6 dígitos do aplicativo autenticador
export function CodeInput({ id, value, onChange, onComplete, disabled, invalid, describedBy }: CodeInputProps) {
  return (
    <Input
      id={id}
      value={value}
      disabled={disabled}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="h-12 text-center font-mono text-2xl tracking-[0.5em]"
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
        onChange(digits);
        if (digits.length === 6) onComplete?.(digits);
      }}
    />
  );
}
