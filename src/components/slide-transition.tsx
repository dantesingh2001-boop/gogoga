import { useEffect, useState, type ReactNode } from 'react';
import { transitionEffect } from '@/lib/presentation';

export function SlideTransition({ index, children }: { index: number; children: ReactNode }) {
  const [frame, setFrame] = useState({ index, content: children, outgoing: null as ReactNode, direction: 'forward', moving: false, effect: 'shutter' });
  if (frame.index !== index) {
    setFrame({ index, content: children, outgoing: frame.content, direction: index > frame.index ? 'forward' : 'backward', moving: true, effect: transitionEffect(frame.index, index) });
  }
  useEffect(() => {
    if (!frame.moving) return;
    const timeout = window.setTimeout(() => setFrame(current => ({ ...current, outgoing: null, moving: false })), 1250);
    return () => window.clearTimeout(timeout);
  }, [frame.index, frame.moving]);

  return <div className={`cinematic-transition effect-${frame.effect} ${frame.direction} ${frame.moving ? 'is-moving' : ''}`}>
    {frame.outgoing && <div key={`out-${frame.index}`} className="cinematic-layer cinematic-outgoing" aria-hidden="true" inert>{frame.outgoing}</div>}
    <div key={frame.index} className="cinematic-layer cinematic-incoming">{children}</div>
    {frame.moving && <div key={`sweep-${frame.index}`} className="cinematic-sweep" aria-hidden="true"><span /><span /><span /></div>}
  </div>;
}