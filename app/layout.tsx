import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "마음 한 조각 — 가볍게 함께 보는 심리 검사",
  description:
    "처음 만난 사이에도 가볍게 즐길 수 있는, 그러나 학계에서 실제 사용되는 검사 기반의 심리 테스트 모음.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7f5f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
