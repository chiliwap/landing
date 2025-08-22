"use client";

import { useFormStatus } from "react-dom";

export default function NewsletterForm({
  action,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  className?: string;
}) {
  return (
    <div className={`flex flex-row justify-center ${className}`}>
      <form action={action} className="flex flex-row w-full justify-center">
        <input
          className="w-1/2 focus:outline-0 mr-2 border-b-2 border-neutral-700 focus:border-neutral-500 transition-colors duration-300"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="cursor-pointer w-44 px-4 py-2 border border-neutral-700 rounded-lg bg-(--background) hover:bg-neutral-900/50 transition-colors duration-350 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Submitting…" : "Subscribe to Newsletter"}
    </button>
  );
}
