"use client";

import { useUser } from "@clerk/nextjs";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { Skeleton } from "~/ui/primitives/skeleton";

export function TwoFactorPageClient() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [step, setStep] = useState<
    "backup" | "idle" | "setup" | "success" | "verify"
  >("idle");
  const [totp, setTotp] = useState<any>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayFormat, setDisplayFormat] = useState<"qr" | "uri">("qr");

  if (!isLoaded) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center p-4`}
      >
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }
  if (!isSignedIn || !user) return <div>not signed in</div>;

  // Handler to start TOTP setup
  const handleSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const totpObj = await user.createTOTP();
      setTotp(totpObj);
      setStep("setup");
    } catch {
      setError("failed to start TOTP setup");
    } finally {
      setLoading(false);
    }
  };

  // Handler to verify TOTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await user.verifyTOTP({ code });
      setStep("backup");
    } catch {
      setError("invalid code");
    } finally {
      setLoading(false);
    }
  };

  // Handler to disable TOTP
  const handleDisable = async () => {
    setLoading(true);
    setError("");
    try {
      await user.disableTOTP();
      setStep("idle");
    } catch {
      setError("failed to disable TOTP");
    } finally {
      setLoading(false);
    }
  };

  // Handler to generate backup codes
  const handleBackupCodes = async () => {
    setLoading(true);
    setError("");
    try {
      const backup = await user.createBackupCode();
      setBackupCodes(backup.codes);
      setStep("success");
    } catch {
      setError("failed to generate backup codes");
    } finally {
      setLoading(false);
    }
  };

  // UI
  if (step === "setup" && totp) {
    return (
      <div
        className={"flex min-h-screen flex-col items-center justify-center p-4"}
      >
        <h1 className="mb-4 text-2xl font-bold">
          Set up two-factor authentication
        </h1>
        {displayFormat === "qr" && (
          <>
            <QRCodeSVG size={200} value={totp.uri} />
            <button
              className="mt-2 underline"
              onClick={() => setDisplayFormat("uri")}
              type="button"
            >
              show as URI
            </button>
          </>
        )}
        {displayFormat === "uri" && (
          <>
            <div className="mb-2 font-mono break-all">{totp.uri}</div>
            <button
              className="underline"
              onClick={() => setDisplayFormat("qr")}
              type="button"
            >
              show as QR
            </button>
          </>
        )}
        <form className="mt-4" onSubmit={handleVerify}>
          <input
            className="mr-2 rounded border p-2"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code from app"
            required
            value={code}
          />
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            disabled={loading}
            type="submit"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </div>
    );
  }

  if (step === "backup") {
    return (
      <div
        className={"flex min-h-screen flex-col items-center justify-center p-4"}
      >
        <h1 className="mb-4 text-2xl font-bold">Backup Codes</h1>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          disabled={loading}
          onClick={handleBackupCodes}
          type="button"
        >
          {loading ? "Generating..." : "Generate Backup Codes"}
        </button>
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </div>
    );
  }

  if (step === "success") {
    return (
      <div
        className={"flex min-h-screen flex-col items-center justify-center p-4"}
      >
        <h1 className="mb-4 text-2xl font-bold">Your Backup Codes</h1>
        <div className="mb-4">Save these codes somewhere safe!</div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {backupCodes.map((code, i) => (
            <div
              className="rounded bg-gray-100 p-2 text-center font-mono"
              key={i}
            >
              {code}
            </div>
          ))}
        </div>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => setStep("idle")}
          type="button"
        >
          Done
        </button>
      </div>
    );
  }

  // Default: show current status and enable/disable
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Two-Factor Authentication</h1>
      {user.totpEnabled ? (
        <>
          <div className="mb-4">TOTP via authentication app is enabled.</div>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white"
            disabled={loading}
            onClick={handleDisable}
            type="button"
          >
            {loading ? "Disabling..." : "Disable two-factor"}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            TOTP via authentication app is not enabled.
          </div>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            disabled={loading}
            onClick={handleSetup}
            type="button"
          >
            {loading ? "Starting..." : "Enable two-factor"}
          </button>
        </>
      )}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
