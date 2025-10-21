import React from "react";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";

const HOST = "http://localhost:8000";
const SNIPPETS_ENDPOINT = "/api/snippets/";

interface SnippetType {
  text: string;
  title: string | null;
  tag: string[];
  created_dt: string;
  updated_dt: string;
}

export default function SnippetsApp() {
  const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);

  const fetchSnippets = () => {
    fetch(`${HOST}${SNIPPETS_ENDPOINT}`)
      .then((res) => res.json())
      .then((data) => setSnippets(data))
      .catch((err) => {
        console.error("Something went wrong trying to fetch all snippets!");
        console.error(err);
        toast.error("Failed to fetch snippets");
      });
  };

  React.useEffect(() => {
    fetchSnippets();
  }, []);

  return (
    <div className="h-full max-w-5xl m-auto flex flex-col gap-2">
      <h1>Snippets</h1>
      <div className="flex-1">
        <SnippetsList snippets={snippets} />
      </div>
      <SnippetInput onSnippetSaved={fetchSnippets} />
      {/* TODO: check if Toaster can be moved to the root file */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

// List existing snippets
function SnippetsList({ snippets }: { snippets: SnippetType[] | null }) {
  return (
    <ul className="flex flex-col gap-2">
      {snippets &&
        snippets.map((snippet, idx) => (
          <li
            key={`${snippet.updated_dt}-${idx}`} // TODO: Replace with a proper ID if available
            className="bg-accent rounded py-2 px-4"
          >
            {/* <p className="text-base mb-1">{snippet.title || <span>snippet-title-placeholder</span>}</p> */}
            <p className="text-sm">{snippet.text}</p>
            <p className="text-xs text-right">
              last updated: {snippet.updated_dt}
            </p>
          </li>
        ))}
    </ul>
  );
}

// Save snippet to backend
async function saveSnippet(snippetText: string) {
  try {
    const response = await fetch(`${HOST}${SNIPPETS_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // TODO: add CSRF token if needed
      },
      body: JSON.stringify({
        text: snippetText,
        // title: null,
        // tag_names: [],
      }),
      // credentials: "include", // in case CSRF cookies are needed
    });

    if (!response.ok) {
      throw new Error("Failed to save snippet");
    }

    toast.success("Snippet saved!");
  } catch (err) {
    console.error("Failed to save snippet:", err);
    toast.error("Failed to save snippet");
  }
}

function SnippetInput({ onSnippetSaved }: { onSnippetSaved: () => void }) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const snippetText = textareaRef.current?.value.trim();
    if (!snippetText) {
      toast.warning("Please enter some text.");
      return;
    }

    await saveSnippet(snippetText);
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    onSnippetSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col items-end">
      <textarea
        className="w-full border p-1 text-sm"
        rows={5}
        ref={textareaRef}
      />
      <button type="submit" className="border px-2 py-1 rounded">
        save
      </button>
    </form>
  );
}
