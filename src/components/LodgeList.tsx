import { actions } from "astro:actions";
import type { SyntheticEvent } from "react";
import { useState } from "react";

type Lodge = {
  id: number | string;
  name: string;
};

type LodgeListProps = {
  initialLodges: Lodge[];
};

export function LodgeList({ initialLodges }: LodgeListProps) {
  const [lodges, setLodges] = useState(initialLodges);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const name = new FormData(form).get("name") as string;

    const tempId = `temp-${crypto.randomUUID()}`;
    const temporaryLodge = { id: tempId, name, pending: true };

    setLodges((currentLodges) => [...currentLodges, temporaryLodge]);

    form.reset();

    const { data, error } = await actions.createLodge({ name });

    if (error) {
      setLodges((currentLodges) =>
        currentLodges.filter((lodge) => lodge.id !== tempId),
      );
      setError(error.message || "Could not create lodge.");
    } else {
      setLodges((prev) =>
        prev.map((lodge) => (lodge.id === tempId ? data : lodge)),
      );
    }
  }

  async function handleDelete(id: number) {
    setError(null);

    const previousLodges = lodges;

    setLodges((prev) => prev.filter((lodge) => lodge.id !== id));

    const result = await actions.deleteLodge({ id });

    if (result.error) {
      setLodges(previousLodges);
      setError(result.error.message || "Could not delete lodge.");
    }
  }

  return (
    <>
      <form onSubmit={handleCreate}>
        <input type="text" name="name" placeholder="Lodge name" />
        <button type="submit">Create</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <ul>
        {lodges.map(({ id, name }) => (
          <li key={id}>
            <span>{name}</span>
            <button
              type="button"
              disabled={id.toString().startsWith("temp-")}
              onClick={() => handleDelete(id as number)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
