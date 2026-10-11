import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartBagBrand } from '@/components/smart-bag-brand';
import { ScaledSlide } from '@/components/scaled-slide';
import { SlideTransition } from '@/components/slide-transition';
import { ProductSlide, ProblemSlide, SolutionSlide, EconomicsSlide, ValuationSlide } from '@/components/smart-bag-slides';
import { slides, slideIndex } from '@/lib/presentation';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { slide?: number; print?: boolean } => ({ slide: slideIndex(search['slide']) + 1, print: search['print'] === true || search['print'] === 'true' || search['print'] === '' }),
  head: () => ({ meta: [
    { title: 'SMART BAG — Intelligent Anti-Theft Security' },
    { name: 'description', content: 'A five-slide interactive presentation of SMART BAG, an Arduino-based intelligent anti-theft engineering prototype.' },
    { property: 'og:title', content: 'SMART BAG — Intelligent Anti-Theft Security' },
    { property: 'og:description', content: 'Explore the problem, product, unit economics and proposed valuation of SMART BAG.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const slideComponents = [ProductSlide, ProblemSlide, SolutionSlide, EconomicsSlide, ValuationSlide];
function Index() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const index = (search.slide ?? 1) - 1;
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const touch = useRef<number | null>(null);
  const go = useCallback((next: number) => { if (next >= 0 && next < slides.length) void navigate({ search: { ...search, slide: next + 1 }, replace: true }); }, [navigate, search]);
  useEffect(() => {
    document.title = `${index + 1}/5 — ${slides[index]?.title ?? 'SMART BAG'}`;
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight' || (e.key === ' ' && !(e.target as HTMLElement)?.closest('button'))) { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    };
    const change = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', key);
    document.addEventListener('fullscreenchange', change);
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('fullscreenchange', change); };
  }, [index, go]);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else setFullscreenError('Fullscreen is not supported by this browser.');
    } catch { setFullscreenError('Fullscreen is unavailable in this view. Open the presentation in a separate browser tab.'); }
  }
  const CurrentSlide = slideComponents[index] ?? ProductSlide;
  if (search.print) return <main className="print-deck">{slideComponents.map((Slide, i) => <div className="print-slide" key={i}><Slide /></div>)}</main>;
  return <main className={`presentation-app ${fullscreen ? 'is-fullscreen' : ''}`}>
    <header className="presentation-header"><SmartBagBrand /><div className="header-center"><span className="header-divider" /> ENGINEERING PROJECT <span className="project-year">/ 2026</span></div><span className="header-status"><span className="status-dot" /> PROTOTYPE PRESENTATION</span></header>
    <div className="presentation-stage" onTouchStart={e => { touch.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={e => { const end = e.changedTouches[0]?.clientX; if (touch.current !== null && end !== undefined && Math.abs(end - touch.current) > 50) go(index + (end < touch.current ? 1 : -1)); touch.current = null; }}>
      <ScaledSlide><SlideTransition index={index}><CurrentSlide /></SlideTransition></ScaledSlide>
    </div>
    <footer className="presentation-controls"><div className="control-caption"><SmartBagBrand compact /></div><div className="slide-navigation"><Button variant="ghost" size="icon" aria-label="Previous slide" title="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft /></Button><div className="progress-dots">{slides.map((slide, i) => <Button key={slide.label} variant="ghost" size="icon" className={`progress-dot ${i === index ? 'current' : ''}`} aria-label={`Go to slide ${i + 1}: ${slide.label}`} aria-current={i === index ? 'step' : undefined} title={slide.label} onClick={() => go(i)}><span /></Button>)}</div><span className="slide-counter">0{index + 1}<span> / 05</span></span><Button variant="outline" size="icon" aria-label="Next slide" title="Next slide" disabled={index === 4} onClick={() => go(index + 1)}><ArrowRight /></Button></div><Button variant="ghost" className="fullscreen-button" onClick={toggleFullscreen}>{fullscreen ? <Minimize /> : <Maximize />}<span>{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span></Button></footer>
    {fullscreenError && <div role="status" className="fullscreen-notice">{fullscreenError}<Button variant="ghost" onClick={() => setFullscreenError('')}>Dismiss</Button></div>}
    <div className={`deck-progress progress-${index + 1}`} />
  </main>;
}
