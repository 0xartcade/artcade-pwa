import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useAuth } from "@/utils/auth-context";
import Image from "next/image";

export const UserLink = () => {
  const [code, setCode] = useState("");
  const { initialized, link } = useAuth();

  return initialized ? (
    <div className="min-h-screen pt-20 px-6">
      <div className="flex flex-col items-center">
        <div className="relative max-w-full h-auto px-4">
          <Image
            src="/images/0xartcade_logo_type.png"
            alt="0xArtcade"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-base text-center text-white/80 max-w-[280px] mt-4 mb-10">
          Enter the six digit code from 0xArtcade to link your account
        </p>

        <div className="w-full px-4 mb-16">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => setCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSeparator />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          className="w-full max-w-[420px] h-[60px] bg-gradient-to-r from-artcade-purple to-artcade-pink 
            hover:from-artcade-purple/80 hover:to-artcade-pink/80 active:scale-95
            text-white border-2 border-white/20 shadow-lg 
            font-['Orbitron'] font-bold text-lg rounded-2xl retro-button
            transition-all duration-200"
          onClick={() => link(code)}
        >
          LINK ACCOUNT
        </button>
      </div>
    </div>
  ) : null;
};
