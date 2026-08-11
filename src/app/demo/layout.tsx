import DemoShell from "./demo-shell";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoShell>{children}</DemoShell>;
}
