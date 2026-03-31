import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import { motion as M, useScroll, useTransform, type MotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ─── Shared types ────────────────────────────────────────────

interface FadeInProps {
  as?: string;
  children?: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

interface ContactButtonProps {
  className?: string;
}

interface LiveProjectButtonProps {
  href?: string;
  className?: string;
}

interface ResumeButtonProps {
  className?: string;
  labelClassName?: string;
  iconSize?: number;
}

interface TechItem {
  name: string;
  icon: string;
  invert?: boolean;
}

interface StackIconEntry {
  src: string;
  invert?: boolean;
}

type TechCat = 'backend' | 'frontend' | 'infra' | 'data';

interface ConstellationNode {
  id: string;
  label: string;
  cat: TechCat;
  cx: number;
  cy: number;
  icon: string;
}

interface CategoryStyle {
  bg: string;
  bd: string;
  tx: string;
}

interface CategoryColors {
  backend: CategoryStyle;
  frontend: CategoryStyle;
  infra:    CategoryStyle;
  data:     CategoryStyle;
}

interface ServiceItem {
  n: string;
  name: string;
  desc: string;
}

interface Highlight {
  col: string;
  label: string;
  detail: string;
  icon: string;
}

interface JourneyItem {
  side: 'left' | 'right';
  date: string;
  title: string;
  subtitle: string;
  desc: string;
  highlights: Highlight[];
  tags: string[];
  btnLabel?: string;
  btnHref?: string;
}

interface BtnPos {
  bottom?: string;
  left?: string;
  right?: string;
  height?: string;
}

interface JtCardCoverProps {
  item: JourneyItem;
  imgSrc: string;
  pixelColor?: string;
  btnPos?: BtnPos;
}

interface PixelRevealProps {
  imgSrc: string;
  alt: string;
  pixelColor: string;
  gridSize?: number;
  duration?: number;
}

interface JtCardProps {
  item: JourneyItem;
}

interface JtIconProps {
  type: string;
}

interface ProjectItem {
  n: string;
  tag: string;
  name: string;
  blurb: string;
  href: string;
  stack?: string[];
  live?: string;
  img1: string;
  img2: string;
  img3: string;
  img3Fit?: string;
  img3Pos?: string;
  img3Zoom?: number;
  img2Fit?: string;
  img2Zoom?: number;
}

interface ProjectImageProps {
  src: string;
  alt?: string;
  fit?: string;
  pos?: string;
  zoom?: number;
}

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
}

// ─── FadeIn ───────────────────────────────────────────────────

function FadeIn({
  as = 'div',
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  style = {},
  ...rest
}: FadeInProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (M as unknown as Record<string, React.ElementType>)[as] ?? M.div;
  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// ─── Magnet ───────────────────────────────────────────────────

function Magnet({ children, padding = 100, strength = 3 }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    // Pointer tracking is pointless on touch screens and unwelcome for anyone
    // who asked for reduced motion — skip the listener entirely in both cases.
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches;
    if (skip) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const inside = Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding;
      setActive(inside);
      setT(inside ? { x: dx / strength, y: dy / strength } : { x: 0, y: 0 });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${t.x}px,${t.y}px,0)`,
        transition: active ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

// ─── AnimatedText ─────────────────────────────────────────────

function AnimatedText({ text, className = '', style = {} }: AnimatedTextProps) {
  return <p className={className} style={style}>{text}</p>;
}

// ─── Buttons ─────────────────────────────────────────────────

function ContactButton({ className = '' }: ContactButtonProps) {
  return (
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=sanghvimihir04@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`contact-btn inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
    >
      Contact Me
    </a>
  );
}

function LiveProjectButton({ href = '#', className = '' }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 font-bold transition-all duration-200 ${className}`}
      style={{ background: '#F2F2F2', color: '#111111', padding: '9px 18px 9px 12px', fontSize: '0.88rem', letterSpacing: '0.02em', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#E4E4E4'; }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#F2F2F2'; }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#111111" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      <span>Source</span>
    </a>
  );
}

const RESUME_FILE = '/MihirSanghvi_resume.pdf';

function DownloadIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

// The hero (desktop + mobile) and the About section all render the same
// resume CTA — only the padding, text size and icon size differ.
function ResumeButton({ className = '', labelClassName = 'text-sm', iconSize = 16 }: ResumeButtonProps) {
  const label = (
    <>
      <DownloadIcon size={iconSize} />
      Download Resume
    </>
  );
  return (
    <a
      href={RESUME_FILE}
      download="MihirSanghvi_resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => window.open(RESUME_FILE, '_blank', 'noopener,noreferrer')}
      className={`resume-btn inline-flex items-center gap-3 rounded-full font-medium uppercase tracking-widest ${className}`}
    >
      <span className="btn-default inline-flex items-center gap-3">{label}</span>
      <span className={`btn-hover font-medium uppercase tracking-widest ${labelClassName}`}>{label}</span>
    </a>
  );
}

// ─── NavBar ───────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',     id: 'home' },
  { label: 'About',    id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Journey',  id: 'journey' },
  { label: 'Services', id: 'skills' },   // section id is "skills"
  { label: 'Contact',  id: 'contact' },
] as const;

// localStorage throws in private browsing and when cookies are blocked, which
// would otherwise take the whole nav down with it.
function readStoredTheme(): string | null {
  try { return localStorage.getItem('theme'); } catch { return null; }
}

function storeTheme(theme: string): void {
  try { localStorage.setItem('theme', theme); } catch { /* storage unavailable */ }
}

// Scroll fires far more often than we can paint. Coalesce handlers onto one
// animation frame and hand back a matching cleanup.
function onScrollFrame(handler: () => void): () => void {
  let frame = 0;
  const listener = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; handler(); });
  };
  window.addEventListener('scroll', listener, { passive: true });
  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', listener);
  };
}

function NavBar() {
  const [scrolled,  setScrolled]  = useState<boolean>(false);
  const [isDark,    setIsDark]    = useState<boolean>(false);
  const [menuOpen,  setMenuOpen]  = useState<boolean>(false);
  const [activeId,  setActiveId]  = useState<string>('');

  useEffect(() => {
    const saved = readStoredTheme();
    const isMobile = window.innerWidth <= 768;
    if (saved === 'dark' && !isMobile) { document.documentElement.classList.add('dark'); setIsDark(true); }
    return onScrollFrame(() => setScrolled(window.scrollY > 48));
  }, []);

  // Track active section by scroll position
  useEffect(() => {
    const onScroll = () => {
      const anchor = window.scrollY + window.innerHeight * 0.4;
      let current = '';
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= anchor) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    return onScrollFrame(onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return () => { document.body.style.overflow = ''; };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const nowDark = document.documentElement.classList.toggle('dark');
    setIsDark(nowDark);
    storeTheme(nowDark ? 'dark' : 'light');
  };

  const smoothScrollTo = (targetY: number, duration = 1000) => {
    const startY = window.scrollY;
    const dist   = targetY - startY;
    if (Math.abs(dist) < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetY);
      return;
    }
    let startTime: number | null = null;
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + dist * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (id === 'home') {
      smoothScrollTo(0);
    } else if (id === 'contact') {
      smoothScrollTo(document.body.scrollHeight);
    } else {
      const targetId = id === 'projects' ? 'projects-cards' : id;
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        smoothScrollTo(top);
      }
    }
  };

  const ThemeBtn = () => (
    <button onClick={toggleTheme} aria-label="Toggle theme" style={{
      width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--ta16)',
      background: 'var(--ta07)', cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      transition: 'background 0.2s, border-color 0.2s'
    }}>
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );

  return (
    <>
      <M.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 md:py-5"
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
          transition: 'background 0.45s ease, border-color 0.45s ease'
        }}
      >
        <a href="#" className="font-black uppercase tracking-[0.14em] text-sm md:text-[0.95rem] hover:opacity-65 transition-opacity duration-200" style={{ color: 'var(--text)' }}>
          Mihir Sanghvi
        </a>

        {/* Desktop nav */}
        <nav className="desktop-nav flex items-center gap-5 md:gap-9">
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = activeId === id;
            return (
              <a key={id} href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className="font-medium uppercase tracking-wider text-[0.68rem] md:text-xs transition-all duration-200 relative"
                style={{
                  color: 'var(--text)',
                  opacity: isActive ? 1 : 0.45,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {label}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: '-5px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: 'var(--text)', display: 'block'
                  }} />
                )}
              </a>
            );
          })}
          <ThemeBtn />
        </nav>

        {/* Mobile right: theme + hamburger */}
        <div className="mobile-nav-btns hidden items-center gap-3">
          <ThemeBtn />
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'transform 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}/>
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'transform 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}/>
          </button>
        </div>
      </M.header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          {NAV_LINKS.map(({ label, id }) => (
            <a key={id} href={`#${id}`} onClick={(e) => handleNavClick(e, id)}>{label}</a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const headingY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bottomY  = useTransform(scrollYProgress, [0, 1], [0, -45]);
  void bottomY; // used in original for bottom bar parallax (kept for parity)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="h-screen flex flex-col relative pt-[60px] md:pt-[68px]"
      style={{ overflowX: 'clip', background: 'var(--bg)' }}
    >
      <div className="hero-content flex-1 flex flex-col justify-center relative">
        {/* Heading */}
        <M.div style={{ y: headingY }} className="overflow-hidden w-full relative z-0 px-2 sm:px-4 md:px-6">
          <FadeIn
            as="h1"
            delay={0.12}
            y={44}
            className="hero-h1 hero-heading font-black tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            <span className="hero-line1">Hi,</span><span className="hero-line2"> I&apos;m Mihir</span>
          </FadeIn>
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
            Full-Stack &amp; AI Developer — React, TypeScript, Python, FastAPI
          </span>
        </M.div>

        {/* Desktop-only: resume button directly under heading */}
        <FadeIn delay={0.3} className="hero-desktop-cta">
          <ResumeButton className="px-10 py-3.5 text-sm" />
        </FadeIn>

        {/* Mobile-only: bio text + resume button directly under heading */}
        <div className="hero-mobile-bio">
          <p className="font-medium text-center leading-relaxed" style={{ color: 'var(--text)', fontSize: '0.95rem', maxWidth: '300px' }}>
            A computer science student at Manipal University Jaipur, focusing on building AI-powered platforms, full-stack web applications, and developer-friendly experiences.
          </p>
          <ResumeButton className="px-8 py-3 text-xs" labelClassName="text-xs" iconSize={15} />
        </div>
      </div>
    </section>
  );
}

// ─── Tech Stack Data ──────────────────────────────────────────

const _DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

const TECH_ROWS: TechItem[][] = [
  [
    { name: 'React',        icon: _DI+'react/react-original.svg' },
    { name: 'TypeScript',   icon: _DI+'typescript/typescript-original.svg' },
    { name: 'JavaScript',   icon: _DI+'javascript/javascript-original.svg' },
    { name: 'Next.js',      icon: _DI+'nextjs/nextjs-original.svg',           invert: true },
    { name: 'Tailwind',     icon: _DI+'tailwindcss/tailwindcss-original.svg' },
    { name: 'Vite',         icon: _DI+'vitejs/vitejs-original.svg' },
    { name: 'Redux',        icon: _DI+'redux/redux-original.svg' },
    { name: 'Figma',        icon: _DI+'figma/figma-original.svg' },
    { name: 'Three.js',     icon: _DI+'threejs/threejs-original.svg',          invert: true },
    { name: 'GraphQL',      icon: _DI+'graphql/graphql-plain.svg' },
    { name: 'HTML5',        icon: _DI+'html5/html5-original.svg' },
    { name: 'CSS3',         icon: _DI+'css3/css3-original.svg' },
  ],
  [
    { name: 'Python',       icon: _DI+'python/python-original.svg' },
    { name: 'FastAPI',      icon: _DI+'fastapi/fastapi-original.svg' },
    { name: 'Node.js',      icon: _DI+'nodejs/nodejs-original.svg' },
    { name: 'Express',      icon: _DI+'express/express-original.svg',          invert: true },
    { name: 'Docker',       icon: _DI+'docker/docker-original.svg' },
    { name: 'PostgreSQL',   icon: _DI+'postgresql/postgresql-original.svg' },
    { name: 'MongoDB',      icon: _DI+'mongodb/mongodb-original.svg' },
    { name: 'Redis',        icon: _DI+'redis/redis-original.svg' },
    { name: 'Supabase',     icon: _DI+'supabase/supabase-original.svg' },
    { name: 'Git',          icon: _DI+'git/git-original.svg' },
    { name: 'Linux',        icon: _DI+'linux/linux-original.svg' },
    { name: 'AWS',          icon: _DI+'amazonwebservices/amazonwebservices-plain.svg' },
  ],
  [
    { name: 'PyTorch',      icon: _DI+'pytorch/pytorch-original.svg' },
    { name: 'TensorFlow',   icon: _DI+'tensorflow/tensorflow-original.svg' },
    { name: 'Scikit-learn', icon: _DI+'scikitlearn/scikitlearn-original.svg' },
    { name: 'Pandas',       icon: _DI+'pandas/pandas-original.svg' },
    { name: 'NumPy',        icon: _DI+'numpy/numpy-original.svg' },
    { name: 'Jupyter',      icon: _DI+'jupyter/jupyter-original.svg' },
    { name: 'Firebase',     icon: _DI+'firebase/firebase-original.svg' },
    { name: 'Vercel',       icon: _DI+'vercel/vercel-original.svg',            invert: true },
    { name: 'Kubernetes',   icon: _DI+'kubernetes/kubernetes-original.svg' },
    { name: 'C++',          icon: _DI+'cplusplus/cplusplus-original.svg' },
    { name: 'Go',           icon: _DI+'go/go-original.svg' },
    { name: 'Rust',         icon: _DI+'rust/rust-original.svg',                invert: true },
  ],
];

const STACK_ICON_MAP: Record<string, StackIconEntry> = {
  'React':        { src: _DI+'react/react-original.svg' },
  'TypeScript':   { src: _DI+'typescript/typescript-original.svg' },
  'Python':       { src: _DI+'python/python-original.svg' },
  'FastAPI':      { src: _DI+'fastapi/fastapi-original.svg' },
  'Supabase':     { src: _DI+'supabase/supabase-original.svg' },
  'PyTorch':      { src: _DI+'pytorch/pytorch-original.svg' },
  'Scikit-learn': { src: _DI+'scikitlearn/scikitlearn-original.svg' },
  'Vite':         { src: _DI+'vitejs/vitejs-original.svg' },
  'JavaScript':   { src: _DI+'javascript/javascript-original.svg' },
  'Next.js':      { src: _DI+'nextjs/nextjs-original.svg', invert: true },
  'Node.js':      { src: _DI+'nodejs/nodejs-original.svg' },
  'Docker':       { src: _DI+'docker/docker-original.svg' },
  'PostgreSQL':   { src: _DI+'postgresql/postgresql-original.svg' },
  'Redis':        { src: _DI+'redis/redis-original.svg' },
  'Git':          { src: _DI+'git/git-original.svg' },
  'Three.js':     { src: _DI+'threejs/threejs-original.svg', invert: true },
};

function TechTile({ name, icon, invert = false }: TechItem) {
  return (
    <div className="flex items-center gap-4 px-6 shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '18px', height: '72px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {icon ? <img src={icon} alt={name} width={34} height={34} loading="lazy" decoding="async" style={{ width: '34px', height: '34px', objectFit: 'contain', filter: invert ? 'brightness(0)' : 'none' }} /> : <div style={{ width: '34px', height: '34px' }} />}
      <span className="font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: '#1a1a2e', fontSize: '0.82rem' }}>{name}</span>
    </div>
  );
}

// ─── Mobile Tech Constellation ────────────────────────────────

function MobileTechConstellation() {
  const [dark, setDark] = useState<boolean>(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const C: CategoryColors = {
    backend:  dark ? { bg:'#0e3830', bd:'#1a7060', tx:'#48d0b8' } : { bg:'#cef0eb', bd:'#18a890', tx:'#0a5848' },
    frontend: dark ? { bg:'#0e1e44', bd:'#1a4498', tx:'#58a8f0' } : { bg:'#d4e8ff', bd:'#1a58d8', tx:'#0a3088' },
    infra:    dark ? { bg:'#2c1205', bd:'#6a2e10', tx:'#d87040' } : { bg:'#ffe0d0', bd:'#c84818', tx:'#702408' },
    data:     dark ? { bg:'#2c1c02', bd:'#6a4808', tx:'#d0a018' } : { bg:'#fff0c8', bd:'#c88008', tx:'#704000' },
  };
  const lnCol = dark ? 'rgba(180,210,230,0.14)' : 'rgba(10,30,80,0.09)';

  const ICO = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
  const NODES: ConstellationNode[] = [
    { id:'python',   label:'Python',     cat:'backend',  cx:250, cy:75,  icon:ICO+'python/python-original.svg'          },
    { id:'fastapi',  label:'FastAPI',    cat:'backend',  cx:382, cy:123, icon:ICO+'fastapi/fastapi-original.svg'        },
    { id:'nodejs',   label:'Node.js',    cat:'backend',  cx:452, cy:244, icon:ICO+'nodejs/nodejs-original.svg'          },
    { id:'pytorch',  label:'PyTorch',    cat:'backend',  cx:428, cy:383, icon:ICO+'pytorch/pytorch-original.svg'        },
    { id:'postgres', label:'PostgreSQL', cat:'data',     cx:320, cy:473, icon:ICO+'postgresql/postgresql-original.svg'  },
    { id:'mongo',    label:'MongoDB',    cat:'data',     cx:180, cy:473, icon:ICO+'mongodb/mongodb-original.svg'        },
    { id:'docker',   label:'Docker',     cat:'infra',    cx:72,  cy:383, icon:ICO+'docker/docker-original.svg'          },
    { id:'aws',      label:'AWS',        cat:'infra',    cx:48,  cy:244, icon:ICO+'amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { id:'git',      label:'Git',        cat:'infra',    cx:118, cy:123, icon:ICO+'git/git-original.svg'                },
    { id:'react',    label:'React',      cat:'frontend', cx:308, cy:180, icon:ICO+'react/react-original.svg'            },
    { id:'ts',       label:'TypeScript', cat:'frontend', cx:365, cy:280, icon:ICO+'typescript/typescript-original.svg'  },
    { id:'tailwind', label:'Tailwind',   cat:'frontend', cx:308, cy:380, icon:ICO+'tailwindcss/tailwindcss-original.svg'},
    { id:'js',       label:'JavaScript', cat:'frontend', cx:193, cy:380, icon:ICO+'javascript/javascript-original.svg'  },
    { id:'next',     label:'Next.js',    cat:'frontend', cx:135, cy:280, icon:ICO+'nextjs/nextjs-original.svg'          },
    { id:'supa',     label:'Supabase',   cat:'data',     cx:193, cy:180, icon:ICO+'supabase/supabase-original.svg'      },
    { id:'k8s',      label:'Kubernetes', cat:'infra',    cx:250, cy:280, icon:ICO+'kubernetes/kubernetes-plain.svg'     },
  ];

  const EDGES: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],
    [9,10],[10,11],[11,12],[12,13],[13,14],[14,9],
    [0,14],[0,9],[1,9],[2,10],[3,11],[4,11],[5,12],[6,13],[7,13],[8,14],
    [15,9],[15,11],[15,13],
  ];

  const IS = 13, GAP = 4, HPAD = 8, PH = 30, PR = 15;
  const tw  = (lbl: string) => lbl.length * 6.5;
  const cw  = (n: ConstellationNode) => IS + GAP + tw(n.label);
  const pw  = (n: ConstellationNode) => Math.max(50, Math.ceil(cw(n)) + 2 * HPAD);
  const iX  = (n: ConstellationNode) => n.cx - cw(n) / 2;
  const iY  = (n: ConstellationNode) => n.cy - IS / 2;
  const tX  = (n: ConstellationNode) => n.cx + (IS + GAP) / 2;

  return (
    <svg
      viewBox="0 0 500 540"
      style={{ display:'block', width:'100%', maxWidth:'500px', margin:'0 auto', overflow:'visible' }}
      aria-label="Tech stack constellation"
    >
      <g>
        {EDGES.map(([a, b], i) => (
          <line key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke={lnCol} strokeWidth="1"
          />
        ))}
      </g>
      <g>
        {NODES.map((n, i) => {
          const c = C[n.cat];
          const w = pw(n);
          return (
            <g key={n.id}
              className="tech-cn"
              style={{ animationDelay:`${(i * 0.22).toFixed(2)}s`,
                       animationDuration:`${3.6 + (i % 5) * 0.38}s` }}>
              <rect
                x={n.cx - w / 2} y={n.cy - PH / 2}
                width={w} height={PH} rx={PR} ry={PR}
                fill={c.bg} stroke={c.bd} strokeWidth="1"
              />
              <image href={n.icon} x={iX(n)} y={iY(n)} width={IS} height={IS} />
              <text
                x={tX(n)} y={n.cy}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fontWeight="700"
                fontFamily="Kanit, sans-serif"
                letterSpacing="0.04em"
                fill={c.tx}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ─── Marquee Section ──────────────────────────────────────────

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const dirs: number[] = [1, -1, 1];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const triggers: ScrollTrigger[] = [];

    rowRefs.current.forEach((row, ri) => {
      if (!row) return;
      const dir   = dirs[ri];
      const dist  = window.innerWidth * 0.55 * dir;
      gsap.set(row, { x: -dist / 2 });
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set(row, { x: (self.progress - 0.5) * dist });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach(t => t.kill());
  }, []);

  const triple = (arr: TechItem[]) => [...arr, ...arr, ...arr];

  return (
    <section ref={sectionRef} className="pt-6 sm:pt-32 md:pt-40 pb-10 overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Desktop: scroll-driven marquee rows */}
      <div className="marquee-desktop flex flex-col gap-3">
        {TECH_ROWS.map((row, ri) => (
          <div key={ri} ref={el => { rowRefs.current[ri] = el; }} className="flex gap-3" style={{ willChange: 'transform' }}>
            {triple(row).map((tech, i) => <TechTile key={'r' + ri + '-' + i} {...tech} />)}
          </div>
        ))}
      </div>

      {/* Mobile: floating node-network orb */}
      <div className="marquee-mobile-grid px-6 pb-4">
        <p className="font-black uppercase tracking-[0.18em] text-center mb-5" style={{ color: 'var(--text)', opacity: 0.55, fontSize: 'clamp(1.4rem, 5.5vw, 2.2rem)' }}>Tech Stack</p>
        <MobileTechConstellation />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="about-desktop min-h-screen relative px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        <FadeIn as="h2" delay={0} y={40} className="hero-heading font-black leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          About Me
        </FadeIn>
        <AnimatedText
          text="A computer science student at Manipal University Jaipur, focusing on building AI-powered platforms, full-stack web applications, and developer-friendly experiences."
          className="font-medium text-center leading-relaxed"
          style={{ color: 'var(--text)', maxWidth: '560px', fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
        <FadeIn delay={0.2}>
          <ResumeButton
            className="px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm"
            labelClassName="text-xs sm:text-sm"
          />
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Journey Data ─────────────────────────────────────────────

const JT_DATA: JourneyItem[] = [
  {
    side: 'left',
    date: 'Sept 2025 - Present',
    title: 'Technical Editorial Co-Lead',
    subtitle: 'GDG · Google Developer Group',
    desc: 'Co-leading editorial direction for a developer community publication, mentoring writers, shipping content on cloud and emerging dev tooling, and building workflows that keep quality consistent.',
    highlights: [
      { col: 'jt-ic-blue',   label: 'Team Leadership',    detail: 'Mentored 4 junior writers and oversaw editorial quality', icon: 'users' },
      { col: 'jt-ic-purple', label: 'Shipped Volume',     detail: '5+ published articles over 8 months: GCP, Agentic RAG, Open Source', icon: 'file' },
      { col: 'jt-ic-amber',  label: 'Reach & Engagement', detail: '400+ presentations and 180+ views across the catalog', icon: 'trending' },
      { col: 'jt-ic-green',  label: 'Top Performer',      detail: '40% read-through rate on top article, beating the Medium benchmark', icon: 'award' },
    ],
    tags: ['GCP', 'Agentic RAG', 'Open Source', 'Cloud'],
    btnLabel: 'Read on Medium',
    btnHref: 'https://medium.com/@dsc.muj',
  },
  {
    side: 'right',
    date: 'July 2026 - August 2026',
    title: 'AI Trainer and Evaluation Specialist',
    subtitle: 'Handshake AI',
    desc: 'Designing multi-hop research prompts that break GPT-5.5 Pro - red-teaming frontier AI so it fails where humans wouldn’t.',
    highlights: [
      { col: 'jt-ic-green',  label: 'Tasks Delivered', detail: '28+ red-team prompts across History, Law & Government - 17 RTD, 3 in Audit, 8 in R1 Review', icon: 'file' },
      { col: 'jt-ic-blue',   label: 'Approval Rate',   detail: '91% approval with a 3.3/5 quality score - 0.1 major and 0.1 minor issues per task', icon: 'award' },
      { col: 'jt-ic-rose',   label: 'Model Failure',   detail: '90%+ failure rate on GPT-5.5 Pro Thinking Extended per submission using multi-hop search chains', icon: 'trending' },
      { col: 'jt-ic-amber',  label: 'Source Depth',    detail: '6-8 step golden trajectories per task, each chaining 3+ independent government & archival sources', icon: 'layers' },
    ],
    tags: ['AI Red Teaming', 'GPT-5.5 Pro', 'Multi-Hop Reasoning', 'Prompt Engineering', 'Government Sources', 'Adaptive Testing'],
  },];

// ─── Journey Icons ────────────────────────────────────────────

function JtIcon({ type }: JtIconProps) {
  if (type === 'users')    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
  if (type === 'file')     return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
  if (type === 'trending') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
  if (type === 'award')    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>);
  if (type === 'pen')      return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>);
  if (type === 'thumb')    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>);
  if (type === 'star')     return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
  if (type === 'layers')   return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
  return null;
}

// ─── Medium Icon ──────────────────────────────────────────────

function MediumIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  );
}

// ─── Journey Cards ────────────────────────────────────────────

// Reveals the cover image once via a pixelated dissolve when it scrolls
// into view. Plays a single time per page load (no persistence), so a fresh
// visit replays it.
function PixelReveal({ imgSrc, alt, pixelColor, gridSize = 14, duration = 0.6 }: PixelRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef<boolean>(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.innerHTML = '';
    const size = 100 / gridSize;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel-reveal__pixel');
        pixel.style.backgroundColor = pixelColor;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        grid.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  useEffect(() => {
    const el = containerRef.current;
    const grid = gridRef.current;
    if (!el || !grid) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        const pixels = grid.querySelectorAll<HTMLDivElement>('.pixel-reveal__pixel');
        const staggerDuration = duration / pixels.length;
        gsap.to(pixels, {
          autoAlpha: 0,
          duration: 0,
          delay: 0.15,
          stagger: { each: staggerDuration, from: 'random' },
          onComplete: () => { grid.style.display = 'none'; },
        });
        obs.disconnect();
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [duration]);

  return (
    <div ref={containerRef} className="pixel-reveal">
      <img src={imgSrc} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      <div className="pixel-reveal__grid" ref={gridRef} />
    </div>
  );
}

function JtCardCover({ item, imgSrc, pixelColor = '#ffffff', btnPos = {} }: JtCardCoverProps) {
  const [btnHovered, setBtnHovered] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => el.classList.toggle('visible', e.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="jt-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <PixelReveal imgSrc={imgSrc} alt={`${item.title} at ${item.subtitle}`} pixelColor={pixelColor} />
      <a
        href={item.btnHref}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          position: 'absolute',
          bottom: btnPos.bottom || '5%',
          left: btnPos.left || '3%',
          right: btnPos.right || '25%',
          height: btnPos.height || '7%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '12px',
          background: btnHovered ? '#f0f0f0' : '#ffffff',
          boxShadow: btnHovered ? '0 6px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
          transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'all 0.2s ease',
          textDecoration: 'none',
          cursor: 'pointer',
          zIndex: 4,
        }}
      >
        <MediumIcon />
        <span style={{ fontFamily: 'Kanit, sans-serif', fontSize: '0.95rem', fontWeight: 500, color: '#111', flex: 1, textAlign: 'center' }}>
          Read on Medium
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </div>
  );
}

function JtCard({ item }: JtCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('visible', e.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="jt-card">
      <h3 className="font-black mb-1 uppercase tracking-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', lineHeight: 1.2 }}>
        {item.title}
      </h3>
      <p className="font-medium text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ta40)' }}>
        {item.subtitle}
      </p>
      <AnimatedText
        text={item.desc}
        className="font-medium leading-relaxed mb-5"
        style={{ color: 'var(--text)', fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)' }}
      />
      <div className="flex flex-col gap-2.5 mb-5">
        {item.highlights.map((h, hi) => (
          <div key={hi} className="flex items-baseline gap-2">
            <span style={{ color: 'var(--ta30)', fontSize: '0.7rem', flexShrink: 0 }}>—</span>
            <div>
              <strong className="font-medium text-sm" style={{ color: 'var(--text)' }}>{h.label}</strong>
              <span className="font-medium text-sm" style={{ color: 'var(--ta45)' }}> · {h.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap mb-1">
        {item.tags.map((t, ti) => <span key={ti} className="jt-tag">{t}</span>)}
      </div>
      {item.btnHref && (
        <a href={item.btnHref} target="_blank" rel="noopener noreferrer" className="jt-btn">
          <MediumIcon />
          {item.btnLabel}
          <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      )}
    </div>
  );
}

// ─── Journey Section ──────────────────────────────────────────

function JourneySection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progRef     = useRef<HTMLDivElement>(null);
  const tipRef      = useRef<HTMLSpanElement>(null);
  const dotsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const dotOffsets  = useRef<number[]>([]);

  useEffect(() => {
    const tl   = timelineRef.current;
    const prog = progRef.current;
    const tip  = tipRef.current;
    if (!tl || !prog || !tip) return;

    const isMobile = () => window.innerWidth <= 768;

    // Measure dot offsets relative to timeline top
    const measureDots = () => {
      const base = tl.getBoundingClientRect().top;
      dotOffsets.current = dotsRef.current.map(dot => {
        if (!dot) return 0;
        const r = dot.getBoundingClientRect();
        return (r.top - base) + r.height / 2;
      });
    };
    measureDots();

    const st = ScrollTrigger.create({
      trigger: tl,
      start: 'top 55%',
      end: 'bottom 55%',
      scrub: 0,
      onUpdate(self) {
        const p      = self.progress;
        const filled = p * tl.getBoundingClientRect().height;

        prog.style.transform = isMobile()
          ? `scaleY(${p})`
          : `translateX(-50%) scaleY(${p})`;

        tip.style.transform = `translateX(-50%) translateY(${filled.toFixed(1)}px)`;
        tip.style.opacity   = (p > 0.015 && p < 0.985) ? '1' : '0';

        dotsRef.current.forEach((dot, i) => {
          if (!dot) return;
          dot.classList.toggle('is-active', (dotOffsets.current[i] ?? 0) < filled);
        });
      },
    });

    const onResize = () => { measureDots(); ScrollTrigger.refresh(); };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="journey"
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-28 md:py-36 relative"
      style={{ background: 'var(--bg)' }}
    >
      <FadeIn as="h2" y={40}
        className="hero-heading font-black leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-24"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        <span className="journey-word1">Journey</span>
        <span className="journey-word2"> So Far</span>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        <div ref={timelineRef} className="jt-timeline">
          <div className="jt-line" />
          <div ref={progRef} className="jt-prog" />
          <span ref={tipRef} className="jt-tip" />
          {JT_DATA.map((item, i) => (
            <div key={i} className={"jt-item jt-item-" + item.side}>
              <div ref={(el: HTMLDivElement | null) => { dotsRef.current[i] = el; }} className="jt-dot" />
              <span className="jt-date-pill">{item.date}</span>
              {i === 0
                ? <JtCardCover item={item} imgSrc="/images/GDG.webp" btnPos={{ bottom: '6%', left: '12%', right: '12%', height: '7%' }} />
                : <JtCard item={item} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────

const SERVICES: ServiceItem[] = [
  { n: '01', name: 'Full-Stack Development', desc: 'End-to-end web applications built with React, TypeScript, FastAPI, and modern databases. From clean component architecture to robust backend logic and auth.' },
  { n: '02', name: 'AI / ML Engineering', desc: 'Designing intelligent systems with PyTorch, XGBoost, and LLM pipelines, including RAG platforms, classification models, and multi-agent workflows that ship real value.' },
  { n: '03', name: 'Frontend Development', desc: 'Responsive, accessible interfaces built with React, Vite, and Tailwind, focused on performance, smooth interactions, and a polished user experience.' },
  { n: '04', name: 'Backend & APIs', desc: 'Scalable APIs and data layers using FastAPI, Supabase, Postgres, and ChromaDB, including role-based auth, vector search, and clean integration patterns.' },
  { n: '05', name: 'Technical Writing', desc: 'Clear, structured technical articles on AI, Web3, and modern dev tooling, translating complex platforms into reader-friendly explanations for engineers and creators.' },
];

function ServicesSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const tilesRowRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);

  const ACCENTS = [
    { tl: '#1a1a1a', tr: '#FDA4AF', bl: '#FDE68A', br: '#7DD3FC', stroke: '#7DD3FC' },
    { tl: '#FDE68A', tr: '#1a1a1a', bl: '#7DD3FC', br: '#FDA4AF', stroke: '#FDA4AF' },
    { tl: '#7DD3FC', tr: '#FDE68A', bl: '#FDA4AF', br: '#1a1a1a', stroke: '#FDE68A' },
    { tl: '#FDA4AF', tr: '#7DD3FC', bl: '#1a1a1a', br: '#FDE68A', stroke: '#7DD3FC' },
    { tl: '#FDE68A', tr: '#FDA4AF', bl: '#1a1a1a', br: '#7DD3FC', stroke: '#FDA4AF' },
  ];

  const ICONS = ACCENTS.map((a) => [
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="28,20 12,40 28,60" stroke={a.stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="52,20 68,40 52,60" stroke={a.stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="44" y1="16" x2="36" y2="64" stroke={a.stroke} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <rect x="18" y="64" width="44" height="8" rx="3" stroke={a.stroke} strokeWidth="2.5" opacity="0.4"/>
    </svg>,
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="8" stroke={a.stroke} strokeWidth="3"/>
      <circle cx="16" cy="24" r="5" stroke={a.stroke} strokeWidth="2.5"/>
      <circle cx="64" cy="24" r="5" stroke={a.stroke} strokeWidth="2.5"/>
      <circle cx="16" cy="56" r="5" stroke={a.stroke} strokeWidth="2.5"/>
      <circle cx="64" cy="56" r="5" stroke={a.stroke} strokeWidth="2.5"/>
      <line x1="32" y1="36" x2="21" y2="27" stroke={a.stroke} strokeWidth="2" opacity="0.7"/>
      <line x1="48" y1="36" x2="59" y2="27" stroke={a.stroke} strokeWidth="2" opacity="0.7"/>
      <line x1="32" y1="44" x2="21" y2="53" stroke={a.stroke} strokeWidth="2" opacity="0.7"/>
      <line x1="48" y1="44" x2="59" y2="53" stroke={a.stroke} strokeWidth="2" opacity="0.7"/>
    </svg>,
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="16" width="60" height="38" rx="5" stroke={a.stroke} strokeWidth="3"/>
      <line x1="10" y1="30" x2="70" y2="30" stroke={a.stroke} strokeWidth="2.5" opacity="0.6"/>
      <line x1="28" y1="30" x2="28" y2="54" stroke={a.stroke} strokeWidth="2.5" opacity="0.6"/>
      <line x1="40" y1="54" x2="40" y2="64" stroke={a.stroke} strokeWidth="2.5"/>
      <line x1="28" y1="64" x2="52" y2="64" stroke={a.stroke} strokeWidth="3" strokeLinecap="round"/>
      <rect x="32" y="35" width="30" height="5" rx="2" stroke={a.stroke} strokeWidth="2" opacity="0.5"/>
    </svg>,
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="52" height="16" rx="5" stroke={a.stroke} strokeWidth="3"/>
      <rect x="14" y="36" width="52" height="16" rx="5" stroke={a.stroke} strokeWidth="3"/>
      <rect x="14" y="58" width="52" height="10" rx="5" stroke={a.stroke} strokeWidth="3" opacity="0.5"/>
      <circle cx="56" cy="22" r="3" stroke={a.stroke} strokeWidth="2.5"/>
      <circle cx="56" cy="44" r="3" stroke={a.stroke} strokeWidth="2.5"/>
      <line x1="22" y1="22" x2="44" y2="22" stroke={a.stroke} strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
      <line x1="22" y1="44" x2="44" y2="44" stroke={a.stroke} strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
    </svg>,
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="10" width="38" height="50" rx="5" stroke={a.stroke} strokeWidth="3"/>
      <rect x="18" y="14" width="38" height="50" rx="5" stroke={a.stroke} strokeWidth="2.5" opacity="0.35"/>
      <line x1="22" y1="26" x2="44" y2="26" stroke={a.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="22" y1="34" x2="44" y2="34" stroke={a.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="22" y1="42" x2="36" y2="42" stroke={a.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M52 54 L62 44 L68 50 L58 60 Z" stroke={a.stroke} strokeWidth="2.5" strokeLinejoin="round"/>
      <line x1="62" y1="44" x2="66" y2="40" stroke={a.stroke} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
  ]);

  useEffect(() => {
    const section   = sectionRef.current;
    const heading   = headingRef.current;
    const tilesRow  = tilesRowRef.current;
    const cardsRow  = cardsRowRef.current;
    if (!section || !heading || !tilesRow || !cardsRow) return;

    const tiles     = gsap.utils.toArray<HTMLElement>('.svc-tile', tilesRow);
    const cardInners = gsap.utils.toArray<HTMLElement>('.svc-card-inner', cardsRow);

    // Set initial states
    gsap.set(tiles,      { y: 180, opacity: 0 });
    gsap.set(heading,    { y: 50,  opacity: 0 });
    gsap.set(cardInners, { rotateY: -90, opacity: 0 });

    const buildTimeline = () => {
      const tl = gsap.timeline({ paused: true });

      // 1. Tiles slide up staggered
      tl.to(tiles, {
        y: 0, opacity: 1,
        duration: 0.28,
        ease: 'power3.out',
        stagger: 0.03,
      });

      // 2. After 0.9s pause: tiles fly up, heading slides in
      tl.to(tiles, {
        y: -220, opacity: 0,
        duration: 0.22,
        ease: 'power3.in',
      }, '+=0.6');

      tl.to(heading, {
        y: 0, opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
      }, '<+0.05');

      // 3. Cards flip in (icon cover face)
      tl.to(cardInners, {
        rotateY: 0, opacity: 1,
        duration: 0.32,
        ease: 'power3.out',
        stagger: 0.035,
      }, '<+0.08');

      // 4. 1s on icon cover, then flip to info
      tl.to(cardInners, {
        rotateY: 180,
        duration: 0.35,
        ease: 'power2.inOut',
        stagger: 0,
      }, '+=0.7');

      return tl;
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          tlRef.current?.kill();
          // Reset all to initial
          gsap.set(tiles,      { y: 180, opacity: 0 });
          gsap.set(heading,    { y: 50,  opacity: 0 });
          gsap.set(cardInners, { rotateY: -90, opacity: 0 });
          tlRef.current = buildTimeline();
          tlRef.current.play();
        } else {
          // Reset after 1.5s delay
          const tl = tlRef.current;
          setTimeout(() => {
            tl?.kill();
            gsap.to(cardInners, { rotateY: -90, opacity: 0, duration: 0.2, ease: 'power2.in' });
            gsap.to(heading,    { y: 50, opacity: 0, duration: 0.18, ease: 'power2.in' });
          }, 1500);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(section);

    return () => { obs.disconnect(); tlRef.current?.kill(); };
  }, []);

  const LETTERS = ['S','E','R','V','I','C','E','S'];

  return (
    <section id="skills" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 relative z-0" style={{ background: 'var(--services-bg)' }}>

      {/* ── DESKTOP ── */}
      <div ref={sectionRef} className="hidden lg:block relative" style={{ minHeight: 680 }}>

        {/* Heading */}
        <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none">
          <h2
            ref={headingRef}
            className="font-black text-center"
            style={{ color: 'var(--services-text)', fontSize: 'clamp(3rem, 12vw, 150px)', lineHeight: 1, opacity: 0 }}
          >
            Services
          </h2>
        </div>

        {/* S·E·R·V·I·C·E·S tiles */}
        <div ref={tilesRowRef} className="absolute left-0 right-0 flex justify-center gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          {LETTERS.map((letter, i) => (
            <div
              key={i}
              className="svc-tile"
              style={{
                width: 72, height: 92,
                background: 'var(--services-text)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Kanit, sans-serif', fontWeight: 900, fontSize: 54,
                color: 'var(--services-bg)',
                userSelect: 'none', flexShrink: 0,
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div ref={cardsRowRef} className="absolute bottom-12 left-0 right-0 flex justify-center gap-4" style={{ perspective: '1200px' }}>
          {SERVICES.map((s, i) => {
            const a = ACCENTS[i];
            const icon = ICONS[i][i];
            return (
              <div key={s.n} style={{ width: 196, height: 300, perspective: '1200px', flexShrink: 0 }}>
                <div
                  className="svc-card-inner"
                  style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
                >
                  {/* FRONT: icon cover */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden',
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden',
                    background: '#0D0D14',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
                  }}>
                    <div style={{ position: 'absolute', top: -24, left: -24, width: 64, height: 64, borderRadius: '50%', background: a.tl, opacity: 0.5, filter: 'blur(16px)' }} />
                    <div style={{ position: 'absolute', top: -24, right: -24, width: 56, height: 56, borderRadius: '50%', background: a.tr, opacity: 0.45, filter: 'blur(14px)' }} />
                    <div style={{ position: 'absolute', bottom: -24, left: -24, width: 56, height: 56, borderRadius: '50%', background: a.bl, opacity: 0.45, filter: 'blur(14px)' }} />
                    <div style={{ position: 'absolute', bottom: -24, right: -24, width: 64, height: 64, borderRadius: '50%', background: a.br, opacity: 0.5, filter: 'blur(16px)' }} />
                    <div style={{ width: 100, height: 100, position: 'relative', zIndex: 1 }}>{icon}</div>
                    <div style={{ fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 11, color: a.stroke, textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}>{s.name}</div>
                  </div>

                  {/* BACK: service info */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden',
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden',
                    transform: 'rotateY(180deg)',
                    background: '#ffffff',
                    padding: '22px 18px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}>
                    <div style={{ position: 'absolute', top: -28, left: -28, width: 72, height: 72, borderRadius: '50%', background: a.tl, opacity: 0.85, filter: 'blur(2px)' }} />
                    <div style={{ position: 'absolute', top: -28, right: -28, width: 60, height: 60, borderRadius: '50%', background: a.tr, opacity: 0.75, filter: 'blur(2px)' }} />
                    <div style={{ position: 'absolute', bottom: -28, left: -28, width: 60, height: 60, borderRadius: '50%', background: a.bl, opacity: 0.75, filter: 'blur(2px)' }} />
                    <div style={{ position: 'absolute', bottom: -28, right: -28, width: 72, height: 72, borderRadius: '50%', background: a.br, opacity: 0.85, filter: 'blur(2px)' }} />
                    <div style={{ position: 'absolute', bottom: 28, right: 8, width: 80, height: 80, opacity: 0.12, pointerEvents: 'none' }}>{icon}</div>
                    <div style={{ position: 'relative', fontWeight: 900, fontSize: 40, color: '#0C0C0C', opacity: 0.10, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0C0C0C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, lineHeight: 1.3 }}>{s.name}</div>
                      <div style={{ fontWeight: 300, fontSize: 11.5, color: '#0C0C0C', opacity: 0.55, lineHeight: 1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: existing list layout ── */}
      <div className="lg:hidden py-20 sm:py-24">
        <FadeIn as="h2" y={40} className="font-black text-center mb-16 sm:mb-20" style={{ color: 'var(--services-text)', fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1 }}>
          Services
        </FadeIn>
        <div className="max-w-5xl mx-auto">
          {SERVICES.map((s, i) => (
            <FadeIn
              key={s.n}
              delay={i * 0.08}
              y={28}
              className="services-row flex items-start gap-6 sm:gap-8 py-8 sm:py-10"
              style={{
                borderTop: '1px solid var(--services-border)',
                borderBottom: i === SERVICES.length - 1 ? '1px solid var(--services-border)' : 'none'
              }}
            >
              <div className="services-num font-black leading-none shrink-0" style={{ color: 'var(--services-text)', fontSize: 'clamp(2.8rem, 9vw, 130px)' }}>{s.n}</div>
              <div className="flex flex-col gap-3 sm:gap-4 pt-1 sm:pt-3">
                <div className="font-medium uppercase leading-tight" style={{ color: 'var(--services-text)', fontSize: 'clamp(1rem, 2.1vw, 2rem)' }}>{s.name}</div>
                <div className="font-light leading-relaxed max-w-2xl" style={{ color: 'var(--services-text)', opacity: 0.55, fontSize: 'clamp(0.82rem, 1.5vw, 1.2rem)' }}>{s.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────

const PROJECTS: ProjectItem[] = [
  {
    n: '01',
    tag: 'Full-Stack / AI',
    name: 'AskIT',
    blurb: "A multi-agent RAG knowledge base where admins ingest PDFs and URLs into a vector store and users query it via an AI chat with cited answers. Built with React, FastAPI, Supabase, ChromaDB, and Groq's Llama 3.",
    href: 'https://github.com/mihirr-spec/AskIT',
    stack: ['React','TypeScript','Python','FastAPI','Supabase','ChromaDB','Groq'],
    img1: '/images/askit3.webp',
    img2: '/images/askit1.webp',
    img3: '/images/askit2.webp',
    img3Fit: 'contain',
    img3Pos: 'top',
  },
  {
    n: '02',
    tag: 'AI / Healthcare',
    name: 'SEHAI',
    blurb: 'An AI-powered rural healthcare platform with a 42-disease XGBoost classifier, fine-tuned ResNet18 CNNs for eye and skin disease detection, and a 3-tier ANM / PHC / CHC dashboard with multilingual voice symptom capture.',
    href: 'https://github.com/mihirr-spec',
    stack: ['Python','PyTorch','XGBoost','FastAPI','React','Scikit-learn'],
    img1: '/images/SEHAI1.webp',
    img2: '/images/SEHAI3.webp',
    img3: '/images/Sehai2.webp',
  },
  {
    n: '03',
    tag: 'Web Tool / Academic',
    name: 'SRS Builder',
    blurb: 'A client-side React tool that converts GitHub README content into IEEE 830-compliant LaTeX SRS documents. Fully free, no backend, no API calls. Gained 400+ organic visitors and actively used by classmates for academic PBL submissions.',
    href: 'https://github.com/mihirr-spec/SRS-builder',
    stack: ['React','TypeScript','Vite','Vercel'],
    live: 'https://srs-builder.vercel.app/',
    img1: '/images/SRS1.webp',
    img2: '/images/SRS3.webp',
    img3: '/images/SRS2.webp',
    img3Zoom: 1.08,
  },
];

function ProjectImage({ src, alt = '', fit = 'cover', pos = 'center', zoom = 1 }: ProjectImageProps) {
  const [err, setErr] = useState<boolean>(false);
  const empty = !src || src.trim() === '' || err;
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: 'inherit' }}>
      <div className="absolute inset-0" style={{ background: 'var(--card-empty)', borderRadius: 'inherit' }} />
      {empty && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--card-dots) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            borderRadius: 'inherit'
          }}
        />
      )}
      {!empty && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: fit as CSSProperties['objectFit'], objectPosition: pos, borderRadius: 'inherit', transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: 'center center' }}
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
}

function ProjectCard({ project, index, total, progress, range }: ProjectCardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="sticky project-stack-card"
      style={{ top: `calc(4.5rem + ${index * 22}px)`, height: `calc(88vh - ${index * 11}px)` }}
    >
      <M.div style={{ scale, transformOrigin: 'top center' }} className="h-full">
        <div
          className="h-full rounded-[28px] md:rounded-[34px] overflow-hidden flex flex-col md:flex-row"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--ta16)' }}
        >
          {/* LEFT: info panel */}
          <div
            className="flex flex-col justify-between px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 shrink-0 md:w-[36%]"
            style={{ borderBottom: '1px solid var(--ta09)', borderRight: 'none' }}
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="font-black leading-none hero-heading" style={{ fontSize: 'clamp(2.4rem, 6vw, 86px)' }}>
                {project.n}
              </div>
              <div>
                <div className="uppercase tracking-[0.2em] font-light mb-1" style={{ color: 'var(--text)', opacity: 0.4, fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}>
                  {project.tag}
                </div>
                <div className="font-bold uppercase leading-none" style={{ color: 'var(--text)', fontSize: 'clamp(1.5rem, 2.6vw, 2.8rem)' }}>
                  {project.name}
                </div>
              </div>
              <p className="font-light leading-relaxed" style={{ color: 'var(--text)', opacity: 0.55, fontSize: 'clamp(0.76rem, 1vw, 0.9rem)', maxWidth: '340px' }}>
                {project.blurb}
              </p>
              {project.stack && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.stack.map((s, si) => {
                    const ic = STACK_ICON_MAP[s];
                    return ic ? (
                      <div key={si} title={s} style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--ta05)',
                        border: '1px solid var(--ta10)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <img src={ic.src} alt={s} loading="lazy" style={{
                          width: '22px', height: '22px', objectFit: 'contain',
                          filter: ic.invert ? 'invert(1) brightness(0.75)' : 'none'
                        }} />
                      </div>
                    ) : (
                      <div key={si} title={s} style={{
                        height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--ta05)',
                        border: '1px solid var(--ta10)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 10px', fontSize: '0.6rem', fontWeight: 600,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--ta45)'
                      }}>{s}</div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Bottom: buttons */}
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <LiveProjectButton href={project.href} />
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live site"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F2F2F2', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#E4E4E4'; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#F2F2F2'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6fc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: image grid */}
          <div className="project-image-grid flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-3 md:p-4" style={{ minHeight: 0 }}>
            <div className="col-start-1 row-start-1 rounded-[14px] md:rounded-[18px] overflow-hidden">
              <ProjectImage src={project.img1} alt={`${project.name} screenshot 1`} pos="top" />
            </div>
            <div className="col-start-2 row-start-1 row-span-2 rounded-[14px] md:rounded-[18px] overflow-hidden">
              <ProjectImage src={project.img3} alt={`${project.name} screenshot 3`} fit={project.img3Fit ?? 'cover'} pos={project.img3Pos ?? 'top'} zoom={project.img3Zoom ?? 1} />
            </div>
            <div className="col-start-1 row-start-2 rounded-[14px] md:rounded-[18px] overflow-hidden">
              <ProjectImage src={project.img2} alt={`${project.name} screenshot 2`} fit={project.img2Fit ?? 'cover'} pos="top" zoom={project.img2Zoom ?? 1} />
            </div>
          </div>
        </div>
      </M.div>
    </div>
  );
}

function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const total = PROJECTS.length;
  return (
    <section
      id="projects"
      ref={containerRef}
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-32 pb-40"
      style={{ background: 'var(--bg)', WebkitOverflowScrolling: 'touch' }}
    >
      <FadeIn as="h2" y={40} className="hero-heading font-black leading-none tracking-tight text-center mb-14 sm:mb-20 md:mb-24" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Projects
      </FadeIn>
      <div id="projects-cards" />
      <div className="max-w-7xl mx-auto">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.n}
            project={p}
            index={i}
            total={total}
            progress={scrollYProgress}
            range={[i / total, (i + 1) / total]}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Social link with branded glow ───────────────────────────

function SocialLink({ label, href, icon, glow }: { label: string; href: string; icon: React.ReactNode; glow: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em]"
      style={{
        color: 'var(--text)',
        fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
        padding: '6px 12px',
        borderRadius: 8,
        transition: 'box-shadow 0.25s ease, opacity 0.25s ease',
        boxShadow: hovered ? `0 0 14px 3px ${glow}, 0 0 0 1px ${glow}` : 'none',
        opacity: hovered ? 1 : 0.7,
      }}
    >
      {icon}
      {label}
    </a>
  );
}

// ─── Visitor counter ──────────────────────────────────────────

function useVisitorCount() {
  const [count, setCount] = useState<number>(253);
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/porfolio-mihir/visits/up')
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setCount(d.count); })
      .catch(() => {});
  }, []);
  return count;
}

// ─── Footer ───────────────────────────────────────────────────

function Footer() {
  const visitorCount = useVisitorCount();
  return (
    <footer id="contact" className="relative z-10 flex flex-col" style={{ background: 'var(--bg)', minHeight: '100svh' }}>
      <div className="mx-6 md:mx-10" style={{ height: '1px', background: 'var(--ta09)' }} />

      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-16">
        <div className="max-w-[1440px] mx-auto text-center">
          <FadeIn y={70} duration={0.95}>
            <div
              className="hero-heading font-black leading-[0.87] tracking-tight select-none"
              style={{ fontSize: 'clamp(5rem, 17vw, 200px)' }}
            >
              Let&apos;s<br />Talk
            </div>
          </FadeIn>

          <FadeIn delay={0.18} y={28} className="footer-cta-row mt-10 sm:mt-16 md:mt-20 flex flex-col sm:flex-row sm:items-end justify-center gap-8 sm:gap-16">
            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-[0.2em] font-light" style={{ color: 'var(--text)', opacity: 0.35, fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}>
                Drop me a line
              </span>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sanghvimihir04@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium uppercase tracking-wide hover:opacity-55 transition-opacity duration-200"
                style={{ color: 'var(--text)', fontSize: 'clamp(0.88rem, 1.6vw, 1.3rem)' }}
              >
                sanghvimihir04@gmail.com
              </a>
            </div>

            <div className="footer-socials flex items-center gap-7 sm:gap-9">
              {([
                { label: 'GitHub',   href: 'https://github.com/mihirr-spec',       glow: 'rgba(0,0,0,0.55)',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mihir-sanghvi-a931b7329/', glow: 'rgba(10,102,194,0.6)',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: 'Twitter',  href: 'https://x.com/mihirsanghvi04',         glow: 'rgba(0,0,0,0.55)',
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.639 5.906-5.639zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              ] as { label: string; href: string; glow: string; icon: React.ReactNode }[]).map(link => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="flex justify-center pb-8">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--text)',
          borderRadius: 999,
          padding: '8px 20px',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
          <span className="font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text)', fontSize: '0.72rem' }}>
            {visitorCount.toLocaleString()} visitors
          </span>
        </div>
      </div>

      <div className="px-6 md:px-10 py-5" style={{ borderTop: '1px solid var(--ta06)' }}>
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <span className="font-medium uppercase tracking-[0.16em]" style={{ color: 'var(--text)', opacity: 0.28, fontSize: '0.68rem' }}>
            Mihir Sanghvi
          </span>
          <span className="font-light" style={{ color: 'var(--text)', opacity: 0.28, fontSize: '0.68rem' }}>
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────

function App() {
  return (
    <div style={{ overflowX: 'clip', background: 'var(--bg)' }}>
      <NavBar />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ProjectsSection />
      <JourneySection />
      <ServicesSection />
      <Footer />
    </div>
  );
}

export default App;
