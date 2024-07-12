import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "lucide-react";

const TwoFactorForm = () => {
  const [value, setValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  return (
    <div className="flex flex-col gap-5 mt-2">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        type="button"
        disabled={isValidating}
        className="flex items-center gap-2"
      >
        {isValidating ? "Validating..." : "Validate"}
        {isValidating ? <Loader size={15} className="animate-spin" /> : null}
      </Button>
    </div>
  );
};

export default TwoFactorForm;
