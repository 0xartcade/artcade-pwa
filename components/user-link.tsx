import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useAuth } from "@/utils/auth-context";
import { Button } from "./ui/button";
import { Title } from "./ui/typography";

export const UserLink = () => {
  const [code, setCode] = useState("");
  const { initialized, link } = useAuth();

  return initialized ? (
    <div className="w-full flex flex-col gap-y-4 items-center text-center">
      <Title className="">0xARTCADE</Title>
      <p className="text-sm text-zinc-100">
        Please link your account using the six time passcode generated by
        0xArtcade
      </p>
      <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        className="border border-border px-2 py-1 bg-primary text-primary-foreground"
        onClick={() => link(code)}
      >
        Link Account
      </Button>
    </div>
  ) : null;
};
