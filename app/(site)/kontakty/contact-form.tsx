"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
};

const initialState: FormState = {
  status: "idle",
  message: null,
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);

  async function handleSubmit(formData: FormData) {
    setFormState({
      status: "loading",
      message: null,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          sourcePage: "/kontakty",
          website: formData.get("website"),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormState({
          status: "error",
          message: payload.error ?? "Не вдалося надіслати звернення. Спробуйте ще раз.",
        });

        return;
      }

      setFormState({
        status: "success",
        message: "Звернення надіслано. Ми зв’яжемося з вами найближчим часом.",
      });
    } catch {
      setFormState({
        status: "error",
        message: "Сталася помилка мережі. Спробуйте ще раз трохи пізніше.",
      });
    }
  }

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        await handleSubmit(formData);
      }}
    >
      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Ім’я
        </label>
        <Input id="contact-name" name="name" placeholder="Ваше ім’я" required minLength={2} />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-phone" className="text-sm font-medium">
          Телефон
        </label>
        <Input id="contact-phone" name="phone" placeholder="Телефон" required minLength={7} />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <Input id="contact-email" name="email" type="email" placeholder="Email, якщо зручно" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Сайт</label>
        <Input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Питання
        </label>
        <Textarea id="contact-message" name="message" placeholder="Опишіть питання коротко" required minLength={10} />
      </div>
      {formState.message ? (
        <p
          className={formState.status === "error" ? "text-sm text-red-700" : "text-sm text-[var(--muted-foreground)]"}
          role={formState.status === "error" ? "alert" : "status"}
        >
          {formState.message}
        </p>
      ) : null}
      <Button type="submit" disabled={formState.status === "loading"}>
        {formState.status === "loading" ? "Надсилаємо..." : "Надіслати звернення"}
      </Button>
    </form>
  );
}
