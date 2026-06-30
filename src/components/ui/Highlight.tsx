/** Renders `text` with the first occurrence of `phrase` wrapped in a gradient. */
export function Highlight({
  text,
  phrase,
  className = "text-gradient",
}: {
  text: string;
  phrase?: string | null;
  className?: string;
}) {
  if (!phrase) return <>{text}</>;
  const i = text.indexOf(phrase);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={className}>{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}
