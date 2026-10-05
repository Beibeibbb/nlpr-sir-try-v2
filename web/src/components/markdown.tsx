import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export function Markdown({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
