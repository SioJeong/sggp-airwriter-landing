"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * ComparisonView – 투명 키보드 데모 컴포넌트 (v6)
 * 🆕 수정
 * 1. 드래그 시작 시 마우스(또는 터치) 위치 대비 키보드 중심 오프셋을 기록하여
 *    '클릭 순간 키보드가 아래로 점프' 현상 해결.
 * 2. 나머지 기능·스타일 유지.
 */

type InputMode = "kor" | "eng" | "emoji";

export default function ComparisonView() {
  /* ------------------------------- 상태 -------------------------------- */
  const [showTransparent, setShowTransparent] = useState(false);
  const [keyboardPosition, setKeyboardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("kor");

  /* -------------------------------- ref -------------------------------- */
  const keyboardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseY: number; keyboardY: number } | null>(
    null
  );
  const deviceRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- 이벤트 핸들러 ----------------------------- */
  const toggleTransparentView = () => {
    setShowTransparent((prev) => !prev);
    trackEvent("comparison_toggle", {
      view: !showTransparent ? "transparent" : "normal",
    });
  };

  const cycleInputMode = () =>
    setInputMode((prev) =>
      prev === "kor" ? "eng" : prev === "eng" ? "emoji" : "kor"
    );

  /* ------------------------------ 드래그 로직 ------------------------------ */
  // 드래그 시작 함수
  const startDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!showTransparent || !keyboardRef.current) return;

    // 마우스/터치 위치 가져오기
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // 현재 드래그 시작 정보 저장
    dragStartRef.current = {
      mouseY: clientY,
      keyboardY: keyboardPosition.y, // 현재 키보드 위치 저장
    };

    setIsDragging(true);
    if (e.type === "touchstart") e.preventDefault();
  };

  // 드래그 중 함수
  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (
      !isDragging ||
      !showTransparent ||
      !keyboardRef.current ||
      !dragStartRef.current
    )
      return;
    const device = deviceRef.current;
    if (!device) return;

    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const mouseDeltaY = clientY - dragStartRef.current.mouseY;
    const newY = dragStartRef.current.keyboardY + mouseDeltaY;

    const rect = device.getBoundingClientRect();
    const kbH = keyboardRef.current.offsetHeight;
    const offsetTop = 16; // 원래 bottom-16 이후 상단 여백
    const offsetBottom = 32; // 하단 여백
    const baseline = 16; // CSS로 준 bottom-16

    // 키보드가 위로 올라갈 수 있는 최대치
    const topLimit = offsetTop + kbH - rect.height + baseline;
    // 키보드가 아래로 내려갈 수 있는 최대치
    const bottomLimit = baseline - offsetBottom;

    setKeyboardPosition({
      x: 0,
      y: Math.max(topLimit, Math.min(bottomLimit, newY)),
    });
  };

  const stopDrag = () => {
    setIsDragging(false);
    dragStartRef.current = null; // 드래그 정보 초기화
  };

  /* 전역 드래그 리스너 */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        onDrag(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    const handleMouseUp = () => isDragging && setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) =>
      isDragging && onDrag(e as unknown as React.TouchEvent<HTMLDivElement>);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, onDrag]);

  /* --------------------------- 스크롤 상태 감지 --------------------------- */
  useEffect(() => {
    if (!showTransparent || !contentRef.current) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    const el = contentRef.current;
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [showTransparent]);

  /* ------------------------------ 데모 텍스트 ------------------------------ */
  const paragraphs = Array.from({ length: 15 }).map(
    (_, i) =>
      `${
        i + 1
      }. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra nisl sed turpis pellentesque, ac iaculis ex dictum. Donec sit amet vestibulum lorem. Integer luctus bibendum eros, vitae efficitur justo elementum eget.`
  );

  /* --------------------------------- UI --------------------------------- */
  return (
    <div className="relative max-w-md mx-auto">
      {/* 디바이스 */}
      <div
        ref={deviceRef}
        className="bg-zinc-800 rounded-3xl overflow-hidden aspect-[9/16] relative"
      >
        <div className="px-4 py-8 h-full flex flex-col">
          {/* 스크롤러 */}
          <div
            ref={contentRef}
            className={`${
              showTransparent
                ? "flex-1 overflow-y-auto"
                : "flex-1 overflow-y-auto py-2"
            } select-none text-sm leading-relaxed text-gray-200 space-y-4 pr-1`}
          >
            {paragraphs.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>

          {/* 일반 키보드 */}
          {!showTransparent && (
            <div className="h-[40%] bg-zinc-700 rounded-t-2xl">
              <div className="grid grid-cols-10 gap-1 p-2 h-full">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-600 rounded-lg flex items-center justify-center"
                  >
                    {i < 26 && (
                      <span className="text-xs text-gray-300">
                        {String.fromCharCode(97 + i)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 투명 키보드 */}
          {showTransparent && (
            <div
              ref={keyboardRef}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[98%] h-[30%] rounded-xl border-2 border-white/60 backdrop-blur-sm transition-opacity duration-300 touch-none"
              style={{
                transform: `translate(-50%, ${keyboardPosition.y}px)`,
                opacity: isScrolling ? 0.1 : 0.4,
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              onMouseUp={stopDrag}
              onTouchEnd={stopDrag}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-white/50 rounded-full" />
            </div>
          )}
        </div>

        {/* 키보드 외부 고정 버튼 */}
        {showTransparent && (
          <div className="absolute bottom-[26%] right-4 flex flex-col space-y-3 z-30">
            <Button
              size="icon"
              className="w-8 h-8 rounded-full bg-white text-black shadow hover:bg-white/90"
              onClick={toggleTransparentView}
              aria-label="키보드 접기"
            >
              ▼
            </Button>
            <Button
              size="icon"
              className="w-8 h-8 rounded-full bg-white text-black shadow hover:bg-white/90"
              onClick={cycleInputMode}
              aria-label="입력 방식 전환"
            >
              {inputMode === "kor" ? "한" : inputMode === "eng" ? "En" : "😊"}
            </Button>
          </div>
        )}
      </div>

      {/* 외부 토글 버튼 */}
      <Button
        onClick={toggleTransparentView}
        className="absolute bottom-[90%] right-[30px] rounded-full bg-white text-black"
        variant="outline"
      >
        {showTransparent ? "일반 키보드" : "투명 키보드"}
      </Button>

      <div className="mt-4 text-center text-gray-300">
        {showTransparent
          ? "AirWriter는 맥락을 유지하며 입력할 수 있습니다."
          : "일반 키보드는 화면을 크게 차지하여 콘텐츠를 가립니다."}
      </div>
    </div>
  );
}
