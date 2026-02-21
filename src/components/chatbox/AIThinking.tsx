import { Loader2 } from "lucide-react";

const AIThinking = () => {
  return (
    <>
      <div className="space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
        </div>

        {/* AI Thoughts */}
        <div className="bg-slate-100 rounded p-2">
          <strong>AI Thoughts:</strong>
          <ul className="list-disc list-inside">
            <li>Analyse the last user input</li>
            <li>Consider context from the previous messages</li>
          </ul>
        </div>

        {/* AI Todos/Plans */}
        <div className="bg-slate-50 rounded p-2">
          <strong>AI Plans: </strong>
          <ul className="list-decimal list-inside">
            <li>Drafting response Structure</li>
            <li>Suggest relevant examples</li>
            <li>Check for clarity and brevity</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AIThinking;
