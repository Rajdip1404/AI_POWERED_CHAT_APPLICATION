import { Check, X } from "lucide-react";
import React from "react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least 1 number", met: /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];
  return (
    <div className="mt-4 mb-1 flex flex-col gap-1">
      {criteria.map((criterion, index) => (
        <div key={criterion.label} className="flex items-center text-sm">
          {criterion.met ? (
            <Check className="size-4 text-blue-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-400 mr-2" />
          )}
          <span className={criterion.met ? "text-blue-500" : "text-gray-400"}>
            {criterion.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (pass.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };
  const strength = getStrength(password);

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Medium";
    if (strength === 1) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-300";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-cyan-400";
    return "bg-blue-500";
  };

  return (
    <div className="mt-0">
        <div className="flex justify-between items-center inset-ring-teal-300 mb-1.5">
            <span className="text-xs text-gray-400"> Password Strength</span>
            <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
        </div>
        <div className="flex space-x-1">
            {[...Array(4)].map((_, index) => (
                <div
                    key={index}
                    className={`w-1/4 h-1.5 rounded-full transition-colors duration-300 ${
                        strength > index ? getStrengthColor(strength) : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
        <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
