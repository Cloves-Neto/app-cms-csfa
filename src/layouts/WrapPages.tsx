import type { ReactNode } from "react";

function WrapHeader({ header }: { header: ReactNode }) {
  if (!header) return null;
  return <header className="w-full shrink-0">{header}</header>;
}

function WrapActions({ actions }: { actions?: ReactNode }) {
  if (!actions) return null;
  return <section className="w-full shrink-0 flex flex-col justify-center items-stretch">{actions}</section>;
}

function WrapContent({ content }: { content: ReactNode }) {
  if (!content) return null;
  return <main className="w-full flex-1 min-h-0">{content}</main>;
}

export default function WrapPages({
  header,
  actions,
  content,
}: {
  header: ReactNode;
  actions?: ReactNode;
  content: ReactNode;
}) {
  return (
    <div className="w-full h-full p-2.5 gap-4 flex flex-col min-h-0">
      <WrapHeader header={header} />
      <WrapActions actions={actions} />
      <WrapContent content={content} />
    </div>
  );
}