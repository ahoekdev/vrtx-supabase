import { useState, type SyntheticEvent } from "react";
import { getFormData } from "../../lib/utils/getFormData";
import { actions } from "astro:actions";
import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

import styles from "./LoginForm.module.css";

interface LoginFormData {
  type: "login" | "register";
}

export function LoginForm({ type }: LoginFormData) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(credentials: SignInWithPasswordCredentials) {
    const res = await actions.login(credentials);

    if (res.error) {
      setMessage(res.error.message);
      return;
    }

    window.location.assign("/");
  }

  async function handleRegister(credentials: SignUpWithPasswordCredentials) {
    const res = await actions.register(credentials);

    if (res.error) {
      setMessage(res.error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = getFormData<{ email: string; password: string }>(
      event.currentTarget,
    );

    if (type === "login") {
      await handleLogin(formData);
    } else {
      await handleRegister(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Email"
        name="email"
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        className={styles.input}
      />
      <button type="submit" disabled={isSubmitting} className={styles.input}>
        {type === "login" ? "Login" : "Register"}
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
