"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SEO_CONFIG, SYSTEM_CONFIG } from "~/app";
import { syncUser } from "~/lib/api-helpers";
import { GitHubIcon } from "~/ui/components/icons/github";
import { GoogleIcon } from "~/ui/components/icons/google";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Separator } from "~/ui/primitives/separator";

export function SignUpPageClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoaded: isSignUpLoaded, setActive, signUp } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isSignUpLoaded) {
      return;
    }
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ??
          "Registration failed. Please try again.",
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setError("Verification failed. Please try again.");
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        await syncUser();
        router.push(SYSTEM_CONFIG.redirectAfterSignUp);
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ??
          "Verification failed. Please try again.",
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignUp = () => {
    if (!isSignInLoaded) return;
    setLoading(true);
    try {
      void signIn.authenticateWithRedirect({
        redirectUrl: "/sso-callback",
        redirectUrlComplete: SYSTEM_CONFIG.redirectAfterSignUp,
        strategy: "oauth_github",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? "Failed to sign up with GitHub");
      console.error(JSON.stringify(err, null, 2));
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (!isSignInLoaded) return;
    setLoading(true);
    try {
      void signIn.authenticateWithRedirect({
        redirectUrl: "/sso-callback",
        redirectUrlComplete: SYSTEM_CONFIG.redirectAfterSignUp,
        strategy: "oauth_google",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? "Failed to sign up with Google");
      console.error(JSON.stringify(err, null, 2));
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <div
        className={`
          flex min-h-screen items-center justify-center p-4
          md:p-8
        `}
      >
        <div className="w-full max-w-md space-y-4">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={onPressVerify}>
                <h2 className="text-center text-2xl font-bold">
                  Verify your email
                </h2>
                <p className="text-center text-sm text-muted-foreground">
                  Enter the code sent to your email address.
                </p>
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    name="code"
                    onChange={(e) => setCode(e.target.value)}
                    required
                    value={code}
                  />
                </div>
                {error && (
                  <div className="text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}
                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        grid h-screen w-screen
        md:grid-cols-2
      `}
    >
      {/* Left side - Image */}
      <div
        className={`
          relative hidden
          md:block
        `}
      >
        <Image
          alt="Sign-up background image"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 0vw, 50vw"
          src="https://images.unsplash.com/photo-1719811059181-09032aef07b8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
        />
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-background/80 to-transparent
          `}
        />
        <div className="absolute bottom-8 left-8 z-10 text-white">
          <h1 className="text-3xl font-bold">{SEO_CONFIG.name}</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            {SEO_CONFIG.slogan}
          </p>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div
        className={`
          flex items-center justify-center p-4
          md:p-8
        `}
      >
        <div className="w-full max-w-md space-y-4">
          <div
            className={`
              space-y-4 text-center
              md:text-left
            `}
          >
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your details to create your account
            </p>
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="pt-2">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      onChange={handleChange}
                      placeholder="John"
                      required
                      type="text"
                      value={formData.firstName}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      type="text"
                      value={formData.lastName}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    onChange={handleChange}
                    required
                    type="password"
                    value={formData.password}
                  />
                </div>
                {error && (
                  <div className="text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}
                {/* CAPTCHA Widget placeholder */}
                <div id="clerk-captcha" />
                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                  className="flex items-center gap-2"
                  disabled={loading}
                  onClick={handleGitHubSignUp}
                  variant="outline"
                >
                  <GitHubIcon className="h-5 w-5" />
                  GitHub
                </Button>
                <Button
                  className="flex items-center gap-2"
                  disabled={loading}
                  onClick={handleGoogleSignUp}
                  variant="outline"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Google
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className={`
                    text-primary underline-offset-4
                    hover:underline
                  `}
                  href="/auth/sign-in"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
