import { useState } from "react";
import { actions } from "astro:actions";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignOut() {
    setIsSubmitting(true);

    const res = await actions.signout();

    if (res.error) {
      setIsSubmitting(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <button
      type="button"
      className={className}
      disabled={isSubmitting}
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
}
