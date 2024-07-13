import { useState } from "react";
import { Loader } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TwoFactorFormProps {
  id?: string;
}

const TwoFactorForm = ({ id }: TwoFactorFormProps) => {
  const [value, setValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);

    try {
      if (id) {
        const response = await fetch("/api/validateotp-signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: value,
            id,
          }),
        });

        if (response.ok) {
          const { validOTP } = await response.json();

          if (validOTP) {
            window.location.href = "/";
          } else {
            toast.error("Invalid OTP");
          }
        } else {
          toast.error("An error occurred");
        }
      } else {
        const response = await fetch("/api/validateotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: value,
          }),
        });

        if (response.ok) {
          const { validOTP } = await response.json();

          if (validOTP) {
            window.location.href = "/";
          } else {
            toast.error("Invalid OTP");
          }
        } else {
          toast.error("An error occurred");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setIsValidating(false);
    }
  };

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
        onClick={handleValidate}
        className="flex items-center gap-2"
      >
        {isValidating ? "Validating..." : "Validate"}
        {isValidating ? <Loader size={15} className="animate-spin" /> : null}
      </Button>
    </div>
  );
};

export default TwoFactorForm;
