import React from "react";
import { Toaster } from "~/components/ui/sonner";

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

  return (
    <div className="h-full max-w-5xl m-auto flex flex-col gap-2">
      <h1>Snippets</h1>
      <div className="flex-1">
        <SnippetsList />
      </div>
      <SnippetInput />
      {/* TODO: check if Toaster can be moved to the root file */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

// list existing snippets
function SnippetsList() {
  const [snippets, setSnippets] = React.useState<SnippetType[] | null>(null);

  React.useEffect(() => {
    fetch(`${HOST}${SNIPPETS_ENDPOINT}`)
      .then((res) => {
        res.json().then((rj) => setSnippets(rj));
      })
      .catch((err) => {
        console.error("something went wrong trying to fetch all snippets!");
        console.error(err);
      });
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      {snippets && (
        snippets.map(snippet => (
          // TODO add key prop
          <li className="bg-accent rounded py-2 px-4">
            {/* <p className="text-base mb-1">{snippet.title || <span>snippet-title-placeholder</span>}</p> */}
            <p className="text-sm">{snippet.text}</p>
            <p className="text-xs text-right">last updated: {snippet.updated_dt}</p>
          </li>
        )))
      }
    </ul>
  );
}

function SnippetInput() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.firstChild.value);
    // TODO send the text to the backend to be saved
    // TODO clear the text input
    // TODO re render the snippets list
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col items-end">
      <textarea className="w-full border p-1 text-sm" rows={5} id="input" />
      <button type="submit" className="border px-2 py-1 rounded">save</button>
    </form>
  );
}