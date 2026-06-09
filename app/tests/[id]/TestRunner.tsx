"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TestDef, Item } from "../../lib/tests";
import { likert5, likert7, getTest } from "../../lib/tests";

type Stage = "intro" | "questions" | "result";

export default function TestRunner({ testId }: { testId: string }) {
  const test = getTest(testId)!;
  const [stage, setStage] = useState<Stage>("intro");
  const [idx, setIdx] = useState(0);
  // answers[i] : likert → number(1~5 or 1~7), choice → trait string
  const [answers, setAnswers] = useState<Array<number | string | null>>(
    () => Array(test.items.length).fill(null)
  );

  const total = test.items.length;
  const current = test.items[idx];
  const progress = stage === "questions" ? (idx / total) * 100 : stage === "result" ? 100 : 0;

  function setAnswer(v: number | string) {
    const next = [...answers];
    next[idx] = v;
    setAnswers(next);
    // 짧은 지연 후 다음 문항으로
    setTimeout(() => {
      if (idx < total - 1) setIdx(idx + 1);
      else setStage("result");
    }, 180);
  }

  function back() {
    if (idx > 0) setIdx(idx - 1);
    else setStage("intro");
  }

  const scores = useMemo(() => {
    if (stage !== "result") return {};
    const s: Record<string, number> = {};
    test.items.forEach((it, i) => {
      const a = answers[i];
      if (a == null) return;
      if (it.kind === "likert") {
        const raw = a as number;
        const max = it.scale;
        const value = it.reverse ? max + 1 - raw : raw;
        // 1~scale → 0 기반으로 누적해도 되지만, 원점수 누적 (학계 표준)
        s[it.trait] = (s[it.trait] ?? 0) + value;
      } else {
        const trait = a as string;
        s[trait] = (s[trait] ?? 0) + 1;
      }
    });
    return s;
  }, [stage, answers, test]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Top bar with progress */}
      <div className="sticky top-0 z-10 bg-[var(--bg-90)] backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-4">
          {stage === "intro" ? (
            <Link
              href="/"
              className="text-[var(--muted)] text-sm py-2 -ml-2 pl-2 pr-3"
              aria-label="처음으로"
            >
              ← 목록
            </Link>
          ) : (
            <button
              onClick={back}
              className="text-[var(--muted)] text-sm py-2 -ml-2 pl-2 pr-3"
              aria-label="이전"
            >
              ← 이전
            </button>
          )}
          <div className="flex-1">
            <div className="h-[3px] bg-[var(--line)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-[12px] tabular-nums text-[var(--muted)] w-12 text-right">
            {stage === "questions" ? `${idx + 1}/${total}` : stage === "result" ? "완료" : `0/${total}`}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {stage === "intro" && <Intro test={test} onStart={() => setStage("questions")} />}
        {stage === "questions" && (
          <Question
            key={idx}
            item={current}
            value={answers[idx]}
            onAnswer={setAnswer}
          />
        )}
        {stage === "result" && (
          <Result
            test={test}
            scores={scores}
            onRestart={() => {
              setIdx(0);
              setAnswers(Array(total).fill(null));
              setStage("intro");
            }}
          />
        )}
      </div>
    </main>
  );
}

function Intro({ test, onStart }: { test: TestDef; onStart: () => void }) {
  return (
    <section className="flex-1 px-6 py-10 sm:py-14 max-w-2xl mx-auto w-full fade-up">
      <div className="text-3xl text-[var(--accent)] mb-5">{test.emoji}</div>
      <h1 className="text-2xl sm:text-3xl font-semibold leading-snug">
        {test.title}
      </h1>
      <p className="text-sm text-[var(--muted)] mt-2">{test.subtitle}</p>

      <p className="mt-8 text-[15px] sm:text-base leading-relaxed">
        {test.intro}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-[var(--muted)]">문항 수</dt>
        <dd>{test.items.length} 문항</dd>
        <dt className="text-[var(--muted)]">소요 시간</dt>
        <dd>{test.duration}</dd>
        <dt className="text-[var(--muted)]">근거</dt>
        <dd className="text-[13px] leading-relaxed">{test.source}</dd>
      </dl>

      <button
        onClick={onStart}
        className="mt-10 w-full bg-[var(--ink)] text-[var(--bg)] rounded-2xl py-4 text-base font-medium active:scale-[0.99] transition"
      >
        시작하기
      </button>

      <p className="mt-6 text-[12px] text-[var(--muted)] leading-relaxed">
        정답은 없습니다. 깊이 고민하지 말고 떠오르는 대로 골라주세요.
      </p>
    </section>
  );
}

function Question({
  item,
  value,
  onAnswer,
}: {
  item: Item;
  value: number | string | null;
  onAnswer: (v: number | string) => void;
}) {
  return (
    <section className="flex-1 px-6 py-8 sm:py-12 max-w-2xl mx-auto w-full flex flex-col fade-up">
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[13px] tracking-widest text-[var(--muted)] mb-4">
          QUESTION
        </p>
        <h2 className="text-xl sm:text-2xl leading-relaxed font-medium">
          {item.text}
        </h2>
      </div>

      <div className="mt-8 sm:mt-12">
        {item.kind === "likert" ? (
          <LikertChoices
            scale={item.scale}
            value={value as number | null}
            onPick={onAnswer}
          />
        ) : (
          <BinaryChoices
            options={item.options}
            value={value as string | null}
            onPick={onAnswer}
          />
        )}
      </div>
    </section>
  );
}

function LikertChoices({
  scale,
  value,
  onPick,
}: {
  scale: 5 | 7;
  value: number | null;
  onPick: (v: number) => void;
}) {
  const labels = scale === 7 ? likert7 : likert5;
  return (
    <div className="space-y-2.5">
      {labels.map((label, i) => {
        const v = i + 1;
        const selected = value === v;
        return (
          <button
            key={v}
            onClick={() => onPick(v)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition active:scale-[0.99] flex items-center gap-4
              ${selected
                ? "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]"
                : "bg-[var(--card)] border-[var(--line)] hover:border-[var(--accent)]"
              }`}
          >
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] tabular-nums shrink-0 border
              ${selected ? "border-[var(--bg)] opacity-90" : "border-[var(--line)] text-[var(--muted)]"}`}
            >
              {v}
            </span>
            <span className="text-[15px]">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BinaryChoices({
  options,
  value,
  onPick,
}: {
  options: { label: string; trait: string }[];
  value: string | null;
  onPick: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const selected = value === opt.trait;
        return (
          <button
            key={i}
            onClick={() => onPick(opt.trait)}
            className={`w-full text-left px-5 py-5 rounded-xl border transition active:scale-[0.99]
              ${selected
                ? "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)]"
                : "bg-[var(--card)] border-[var(--line)] hover:border-[var(--accent)]"
              }`}
          >
            <span className="text-[15px] sm:text-base leading-relaxed">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Result({
  test,
  scores,
  onRestart,
}: {
  test: TestDef;
  scores: Record<string, number>;
  onRestart: () => void;
}) {
  const r = test.interpret(scores);
  return (
    <section className="flex-1 px-6 py-10 sm:py-14 max-w-2xl mx-auto w-full fade-up">
      <p className="text-[13px] tracking-widest text-[var(--muted)] mb-3">RESULT</p>
      <h1 className="text-2xl sm:text-3xl font-semibold leading-snug">
        {r.headline}
      </h1>
      {r.subHeadline && (
        <p className="mt-2 text-[14px] text-[var(--muted)]">{r.subHeadline}</p>
      )}

      {/* 종합 해석 */}
      {r.summary && (
        <div className="mt-7 bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 fade-up">
          <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] mb-2">
            OVERVIEW
          </p>
          <p className="text-[15px] leading-relaxed">{r.summary}</p>
        </div>
      )}

      {/* 차원별 점수 */}
      <h2 className="mt-10 mb-4 text-[11px] tracking-[0.3em] text-[var(--muted)]">
        BY DIMENSION
      </h2>
      <div className="space-y-4">
        {r.lines.map((line, i) => {
          const ratio = Math.min(1, line.value / line.max);
          const level = line.level;
          const badgeColor =
            level === "high"
              ? "bg-[var(--accent)] text-white"
              : level === "low"
              ? "bg-[var(--line)] text-[var(--muted)]"
              : "bg-[var(--ink-8)] text-[var(--ink)]";
          return (
            <div
              key={i}
              className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex justify-between items-baseline gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{line.label}</span>
                  {line.levelLabel && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${badgeColor}`}
                    >
                      {line.levelLabel}
                    </span>
                  )}
                </div>
                <span className="text-[12px] tabular-nums text-[var(--muted)]">
                  {line.value} / {line.max}
                </span>
              </div>
              <div className="mt-3 h-[6px] bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              <p className="mt-3 text-[14px] leading-relaxed">{line.desc}</p>
              {line.detail && (
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">
                  {line.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 인사이트 카드 */}
      {r.insights && r.insights.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-[11px] tracking-[0.3em] text-[var(--muted)]">
            INSIGHTS
          </h2>
          <div className="space-y-3">
            {r.insights.map((ins, i) => (
              <div
                key={i}
                className="border-l-2 border-[var(--accent)] pl-4 py-1 fade-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <p className="text-[13px] font-semibold mb-1">{ins.title}</p>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">
                  {ins.body}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {r.closing && (
        <p className="mt-10 text-[13px] text-[var(--muted)] leading-relaxed italic">
          {r.closing}
        </p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-3">
        <button
          onClick={onRestart}
          className="w-full border border-[var(--ink)] rounded-2xl py-4 text-base font-medium active:scale-[0.99] transition"
        >
          다시 하기
        </button>
        <Link
          href="/"
          className="w-full bg-[var(--ink)] text-[var(--bg)] rounded-2xl py-4 text-base font-medium active:scale-[0.99] transition text-center"
        >
          다른 검사
        </Link>
      </div>

      <p className="mt-6 text-[12px] text-[var(--muted)] leading-relaxed">
        근거 : {test.source}
      </p>
    </section>
  );
}
