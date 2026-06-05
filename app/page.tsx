import Link from "next/link";
import { TESTS } from "./lib/tests";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 sm:py-16 max-w-3xl mx-auto">
      <header className="mb-10 sm:mb-14 fade-up">
        <p className="text-sm tracking-[0.3em] text-[var(--muted)] mb-3">
          A QUIET PSYCHOLOGY ROOM
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-snug">
          마음 한 조각,
          <br />
          가볍게 함께 보는 검사들
        </h1>
        <p className="mt-5 text-[15px] sm:text-base text-[var(--muted)] leading-relaxed">
          처음 만난 사이에도 부담 없이 즐길 수 있도록, 그러나 학계에서 실제 쓰이는
          검사를 바탕으로 만들었습니다. 결과는 진단이 아닌, 대화를 위한 한 스푼이에요.
        </p>
      </header>

      <ul className="space-y-4">
        {TESTS.map((t, i) => (
          <li
            key={t.id}
            className="fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Link
              href={`/tests/${t.id}`}
              className="block bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 sm:p-7 transition active:scale-[0.99] hover:border-[var(--accent)]"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl sm:text-3xl text-[var(--accent)] mt-0.5 select-none">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold">{t.title}</h2>
                  <p className="text-sm text-[var(--muted)] mt-1">{t.subtitle}</p>
                  <p className="text-[13px] text-[var(--muted)] mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    <span>· {t.items.length}문항</span>
                    <span>· {t.duration}</span>
                    <span className="opacity-70">· {t.source}</span>
                  </p>
                </div>
                <div className="text-[var(--muted)] text-xl select-none">→</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-16 text-[12px] text-[var(--muted)] leading-relaxed">
        본 검사들은 모두 학술 문헌에 근거하며, 단축형/번역본으로 제공됩니다.
        임상적 진단을 대체하지 않으며, 대화와 자기이해를 돕는 용도로 즐겨주세요.
      </footer>
    </main>
  );
}
