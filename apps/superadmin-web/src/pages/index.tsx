import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Command } from "lucide-react";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/lib/utils/api";
import { UI_CONFIG } from "@/lib/config";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import {
  ConfirmLoginAccessCodeZodSchema,
  EmailLoginZodSchema,
  type ConfirmLoginAccessCodeZodSchemaType,
  type EmailLoginZodSchemaType,
} from "@/server/validation/auth";

const Home: NextPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [stage, setStage] = React.useState<"email" | "access_code">("email");

  const handleLoginStageOneComplete = (id: string) => {
    setIdentifier(id);
    setStage("access_code");
  };

  const handleLoginStageTwoComplete = () => {
    const redirect = router.query.redirect_url;

    if (!redirect) {
      router.push("/restaurants");
    }

    if (Array.isArray(redirect) && redirect.length && redirect[0]) {
      router.push(redirect[0]);
    }

    if (typeof redirect === "string") {
      router.push(redirect);
    }
  };

  const handleReset = () => {
    setIdentifier("");
    setStage("email");
  };

  return (
    <>
      <Head>
        <>
          <title>{`Admin - ${UI_CONFIG.company_name}`}</title>
          <meta name="description" content="Generated by create-t3-app" />
        </>
      </Head>
      <main
        className={cn(
          "container relative min-h-screen flex-col items-center justify-center font-sans md:grid lg:max-w-none lg:grid-cols-2 lg:px-0",
          fontSans.variable,
        )}
      >
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> {UI_CONFIG.company_name} -
            Admin
          </div>
        </div>
        <div className="pt-10 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to the admin portal
              </h1>
              {stage === "email" && (
                <p className="text-muted-foreground text-sm">
                  Enter your email below to login to the{" "}
                  {UI_CONFIG.company_name} admin portal.
                </p>
              )}

              {stage === "access_code" && (
                <p className="text-muted-foreground text-sm">
                  We just emailed you an access code. Enter it below to login to
                  the {UI_CONFIG.company_name} admin portal.
                </p>
              )}
            </div>
            {stage === "email" && (
              <EmailAuthForm onSuccess={handleLoginStageOneComplete} />
            )}
            {stage === "access_code" && (
              <AccessCodeAuthForm
                identifierTag={identifier}
                onSuccess={handleLoginStageTwoComplete}
                onGoBack={handleReset}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

interface EmailAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess: (identifier: string) => void;
}

const EmailAuthForm = ({
  className,
  onSuccess,
  ...props
}: EmailAuthFormProps) => {
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailLoginZodSchemaType>({
    resolver: zodResolver(EmailLoginZodSchema),
    defaultValues: { email: "" },
  });

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      if (data) {
        onSuccess(data?.identifier);
      }
    },
    onError: (err) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: err.message,
      });
    },
  });

  const isLoading = loginMutation.isLoading;

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={handleSubmit((values) => {
          loginMutation.mutate(values);
        })}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />

            {errors.email && (
              <p className="mb-2 text-sm text-red-500">
                Enter your email address.
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
};

interface AccessCodeAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess: () => void;
  onGoBack: () => void;
  identifierTag: string;
}

const AccessCodeAuthForm = ({
  className,
  onSuccess,
  onGoBack,
  identifierTag,
  ...props
}: AccessCodeAuthFormProps) => {
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ConfirmLoginAccessCodeZodSchemaType>({
    resolver: zodResolver(ConfirmLoginAccessCodeZodSchema),
    defaultValues: { identifier: identifierTag, accessCode: "" },
  });

  const confirmLoginMutation = api.auth.confirmLoginAccessCode.useMutation({
    onSuccess: (data) => {
      onSuccess();
    },
    onError: (err) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: err.message,
      });
    },
  });

  const isLoading = confirmLoginMutation.isLoading;

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={handleSubmit((values) => {
          confirmLoginMutation.mutate(values);
        })}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="access-code">
              Access code
            </Label>
            <Input
              id="access-code"
              placeholder="Enter the access code"
              type="text"
              autoCapitalize="none"
              autoComplete="one-time-code"
              autoCorrect="off"
              disabled={isLoading}
              {...register("accessCode")}
            />
          </div>
          {errors.accessCode && (
            <p className="mb-2 text-sm text-red-500">Enter the access code.</p>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm Access Code
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onGoBack}
            disabled={isLoading}
          >
            Go back
          </Button>
        </div>
      </form>
    </div>
  );
};
