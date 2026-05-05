import { actions } from "astro:actions";
import type { SyntheticEvent } from "react";
import { useState } from "react";

type Lodge = {
  id: string | number;
  name: string;
  pending?: boolean;
};

type LodgeListProps = {
  initialLodges: Lodge[];
};

export default function LodgeList({ initialLodges }: LodgeListProps) {
  const [lodges, setLodges] = useState(initialLodges);
  const [error, setError] = useState("");

  async function handleCreate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");

    if (typeof name !== "string" || !name.trim()) {
      return;
    }

    const trimmedName = name.trim();
    const temporaryId = `temporary-${crypto.randomUUID()}`;
    const temporaryLodge = {
      id: temporaryId,
      name: trimmedName,
      pending: true,
    };

    setLodges((currentLodges) => [...currentLodges, temporaryLodge]);
    form.reset();

    const result = await actions.createLodge({ name: trimmedName });

    if (result.error) {
      setLodges((currentLodges) =>
        currentLodges.filter((lodge) => lodge.id !== temporaryId),
      );
      setError(result.error.message || "Could not create lodge.");
      return;
    }

    setLodges((currentLodges) =>
      currentLodges.map((lodge) =>
        lodge.id === temporaryId ? result.data : lodge,
      ),
    );
  }

  async function handleDelete(lodgeToDelete: Lodge) {
    setError("");

    const previousLodges = lodges;
    setLodges((currentLodges) =>
      currentLodges.filter((lodge) => lodge.id !== lodgeToDelete.id),
    );

    const result = await actions.deleteLodge({ id: lodgeToDelete.id });

    if (result.error) {
      setLodges(previousLodges);
      setError(result.error.message || "Could not delete lodge.");
    }
  }

  return (
    <>
      <form onSubmit={handleCreate}>
        <input type="text" name="name" placeholder="Lodge name" />
        <button type="submit">Submit</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <ul>
        {lodges.map((lodge) => (
          <li key={lodge.id}>
            <span>{lodge.name}</span>
            {lodge.pending && <span> Saving...</span>}
            <button
              type="button"
              disabled={lodge.pending}
              onClick={() => handleDelete(lodge)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
