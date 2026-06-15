import Image from 'next/image';

// Logo del brand: l'immagine fornita, con sfondo reso trasparente (public/logo.png).
// Dimensiona via className passando l'altezza (es. "h-14 w-auto").
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="The Adaptive Form"
      width={599}
      height={640}
      priority
      className={className}
    />
  );
}
