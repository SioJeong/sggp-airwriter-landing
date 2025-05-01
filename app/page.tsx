"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Smartphone, Type, Eye, X } from "lucide-react";
import StatCard from "@/components/stat-card";
import AnalyticsWrapper from "@/components/analytics-wrapper";
import { trackEvent } from "@/lib/analytics";
import ComparisonView from "@/components/comparison-view";
import { useState } from "react";

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await fetch("https://formspree.io/f/xkgroagy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    trackEvent("email_submitted", { location: "hero_modal" });
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after showing success message
    setTimeout(() => {
      setShowEmailModal(false);
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <AnalyticsWrapper pageEvent="home_page_view">
      <main className="flex min-h-screen flex-col bg-black text-white">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              넓은 화면에서 방해받지 않고
              <br />
              텍스트를 입력해보세요
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              AirWriter의 투명 AI 키보드로 모바일 화면을 최대한 활용하세요.
              <br />더 넓은 화면, 더 높은 생산성, 더 나은 경험을 제공합니다.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-200 transition-all"
              onClick={() => {
                trackEvent("hero_cta_click");
                setShowEmailModal(true);
              }}
            >
              지금 바로 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-12 w-full max-w-3xl">
            <ComparisonView />

            {/* <HeroAnimation /> */}
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              키보드가 가리는 화면
              <br />
              불편하지 않으셨나요?
            </h2>
            {/* <ComparisonView /> */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-800 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold mb-4">
                  기존 키보드의 한계
                </h3>
                <p className="text-gray-300 mb-6">
                  Blog, Threads, LinkedIn 같은 텍스트 기반 SNS에서 장문의
                  컨텐츠를 작성할 때, 키보드가 화면의 절반을 차지해 위아래를
                  번거롭게 확인하며 글을 작성해야 합니다. 이는 생산성 저하와
                  사용자 경험 악화로 이어집니다.
                </p>
                <ul className="space-y-3">
                  {[
                    "제한된 가시성",
                    "번거로운 스크롤",
                    "집중력 저하",
                    "생산성 감소",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="bg-zinc-700 p-1 rounded-full mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-800 p-8 rounded-2xl flex flex-col">
                <h3 className="text-2xl font-semibold mb-4">
                  AirWriter의 해결책
                </h3>
                <p className="text-gray-300 mb-6">
                  AirWriter는 투명 키보드로 화면을 가리지 않고 텍스트를 입력할
                  수 있게 해줍니다. 전체 화면을 보면서 글을 작성하므로
                  컨텍스트를 놓치지 않고 더 효율적으로 작업할 수 있습니다.
                </p>
                <Button
                  className="mt-auto w-full rounded-xl py-6 bg-white text-black hover:bg-gray-200"
                  onClick={() => {
                    trackEvent("problem_section_cta_click");
                    setShowEmailModal(true);
                  }}
                >
                  AirWriter로 넓은 화면 경험하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Correction Feature */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                오타 걱정은 AI에게 맡기세요
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                투명 키보드라 오타가 걱정되시나요?
                <br />
                걱정하지 마세요.
                <br />
                AirWriter의 AI가 오타를 자동으로 감지하고 수정해드립니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "실시간 오타 감지",
                  description: "입력 즉시 오타를 감지하고 표시합니다",
                  icon: <Eye className="h-8 w-8" />,
                },
                {
                  title: "맥락 기반 수정",
                  description:
                    "문장의 맥락을 이해하여 정확한 수정을 제안합니다",
                  icon: <Type className="h-8 w-8" />,
                },
                {
                  title: "학습형 AI",
                  description:
                    "사용자의 입력 패턴을 학습하여 점점 더 정확해집니다",
                  icon: <Smartphone className="h-8 w-8" />,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 p-8 rounded-2xl text-center"
                >
                  <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* <div className="mt-12 text-center">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-200"
                onClick={() => {
                  trackEvent("ai_feature_cta_click");
                  setShowEmailModal(true);
                }}
              >
                AI 오타 수정 체험하기
              </Button>
            </div> */}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-zinc-900" id="stats">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
              데이터로 증명된 효율성
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <StatCard
                title="5배"
                description="모바일은 데스크톱 대비 평균 5배 이상의 오타가 발생합니다"
                icon={<Smartphone className="h-8 w-8" />}
              />
              <StatCard
                title="20%"
                description="전체 키 입력의 20%가 백스페이스 키를 누르는데 사용됩니다"
                icon={<Type className="h-8 w-8" />}
              />
            </div>

            <div className="bg-zinc-800 p-8 md:p-12 rounded-2xl text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                AirWriter로 오타 수정 시간 70% 절약
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                AI 자동 수정 기능으로 백스페이스 사용 빈도가 크게 줄어들고,
                <br />
                투명 키보드로 전체 문맥을 보며 작성하여 오타 발생 자체가
                감소합니다.
              </p>
              {/* <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-200"
                onClick={() => {
                  trackEvent("stats_section_cta_click");
                  setShowEmailModal(true);
                }}
              >
                시간 절약 효과 직접 체험하기
              </Button> */}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 text-center" id="early-access">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              지금 신청하고 특별 혜택을 받으세요
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              AirWriter 앱 개발에 대한 가장 빠른 소식과
              <br />
              출시 시 무료 사용 혜택을 제공해 드립니다.
              <br />
              지금 이메일을 등록하고 얼리 액세스 기회를 놓치지 마세요.
            </p>
            <Button
              className="p-4 mb-4 w-xl rounded-full bg-white text-black hover:bg-gray-200"
              onClick={() => setShowEmailModal(true)}
            >
              얼리 액세스 신청하기
            </Button>
            <p className="text-sm text-gray-400">
              개인정보는 안전하게 보호되며, 마케팅 목적으로만 사용됩니다.
              언제든지 구독을 취소할 수 있습니다.
            </p>
          </div>
        </section>

        {/* Email Registration Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div
              className="bg-zinc-800 rounded-2xl max-w-md w-full p-6 relative animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowEmailModal(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  AirWriter 얼리 액세스
                </h3>
                <p className="text-gray-300">
                  이메일을 등록하고 출시 소식과 무료 체험 기회를 받아보세요.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      이메일 주소
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-white text-black hover:bg-gray-200 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          처리 중...
                        </span>
                      ) : (
                        "등록하기"
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    개인정보는 안전하게 보호되며, 마케팅 목적으로만 사용됩니다.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="bg-green-500 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    등록이 완료되었습니다!
                  </h4>
                  <p className="text-gray-300">
                    ViewSpace 출시 소식을 가장 먼저 알려드리겠습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </AnalyticsWrapper>
  );
}
