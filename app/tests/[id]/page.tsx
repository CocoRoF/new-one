import { notFound } from "next/navigation";
import { TESTS, getTest } from "../../lib/tests";
import TestRunner from "./TestRunner";

export function generateStaticParams() {
  return TESTS.map((t) => ({ id: t.id }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = getTest(id);
  if (!test) notFound();
  // interpret 함수는 직렬화 불가 → id만 넘기고 클라이언트에서 lookup
  return <TestRunner testId={test.id} />;
}
