import type { SyntheticEvent } from "react";
import { getFormData } from "../../lib/utils/getFormData";

export function LoginForm() {
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(getFormData(event.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="text" placeholder="Email" name="email" />
      </div>
      <div>
        <input type="password" placeholder="Password" name="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
