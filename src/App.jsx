import { useRef, useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { motion as M, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

  /* ─── FadeIn ─────────────────────────────────────────────── */
  function FadeIn({ as = 'div', children, delay = 0, duration = 0.7, x = 0, y = 30, className = '', style = {}, ...rest }) {
    const Comp = M[as] || M.div;
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

  /* ─── Magnet ─────────────────────────────────────────────── */
  function Magnet({ children, padding = 100, strength = 3 }) {
    const ref = useRef(null);
    const [t, setT] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    useEffect(() => {
      const onMove = (e) => {
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

  /* ─── AnimatedText ───────────────────────────────────────── */
  function AnimatedText({ text, className = '', style = {} }) {
    return <p className={className} style={style}>{text}</p>;
  }

  /* ─── Buttons ────────────────────────────────────────────── */
  function ContactButton({ className = '' }) {
    return (
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=sanghvimihir96@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`contact-btn inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
      >
        Contact Me
      </a>
    );
  }
  function LiveProjectButton({ href = '#', className = '' }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2.5 font-bold transition-all duration-200 ${className}`}
        style={{ background: '#F2F2F2', color: '#111111', padding: '9px 18px 9px 12px', fontSize: '0.88rem', letterSpacing: '0.02em', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E4E4'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#F2F2F2'; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#111111" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span>Source</span>
      </a>
    );
  }

  /* ─── NavBar (fixed, blur on scroll) ────────────────────── */
  function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') { document.documentElement.classList.add('light'); setIsDark(false); }
      const fn = () => setScrolled(window.scrollY > 48);
      window.addEventListener('scroll', fn, { passive: true });
      return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const toggleTheme = () => {
      const nowLight = document.documentElement.classList.toggle('light');
      setIsDark(!nowLight);
      localStorage.setItem('theme', nowLight ? 'light' : 'dark');
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
            {['About', 'Projects', 'Journey', 'Services', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="font-medium uppercase tracking-wider text-[0.68rem] md:text-xs hover:opacity-55 transition-opacity duration-200"
                style={{ color: 'var(--text)' }}>{l}</a>
            ))}
            <ThemeBtn />
          </nav>

          {/* Mobile right: theme + hamburger */}
          <div className="mobile-nav-btns hidden items-center gap-3">
            <ThemeBtn />
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
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
          <div className="mobile-menu">
            {['About', 'Projects', 'Journey', 'Services', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
          </div>
        )}
      </>
    );
  }

  /* ─── Hero (scroll parallax on portrait + heading) ───────── */
  function HeroSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

    // Big heading drifts gently upward
    const headingY = useTransform(scrollYProgress, [0, 1], [0, 60]);

    // Bottom bar counter-drifts
    const bottomY = useTransform(scrollYProgress, [0, 1], [0, -45]);

    return (
      <section
        ref={sectionRef}
        className="h-screen flex flex-col relative pt-[60px] md:pt-[68px]"
        style={{ overflowX: 'clip', background: 'var(--bg)' }}
      >
        <div className="hero-content flex-1 flex flex-col justify-end relative">
          {/* Heading */}
          <M.div style={{ y: headingY }} className="overflow-hidden w-full relative z-0 px-2 sm:px-4 md:px-6">
            <FadeIn
              as="h1"
              delay={0.12}
              y={44}
              className="hero-h1 hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full mt-6 sm:mt-4 md:-mt-4 text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
            >
              <span className="hero-line1">Hi,</span><span className="hero-line2"> i&apos;m mihir</span>
            </FadeIn>
          </M.div>

          {/* Bottom bar */}
          <M.div
            style={{ y: bottomY }}
            className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20"
          >
            <FadeIn
              as="p"
              delay={0.3}
              y={18}
              className="hero-subtitle font-light uppercase tracking-wide leading-snug max-w-[155px] sm:max-w-[210px] md:max-w-[255px]"
              style={{ color: 'var(--text)', fontSize: 'clamp(0.7rem, 1.35vw, 1.4rem)' }}
            >
              a full-stack developer building ai-powered platforms and meaningful digital experiences
            </FadeIn>

          </M.div>
        </div>
      </section>
    );
  }

  /* ─── Tech Stack Marquee ─────────────────────────────────── */
  const _DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
  const TECH_ROWS = [
    [
      { name: 'React',       icon: _DI+'react/react-original.svg' },
      { name: 'TypeScript',  icon: _DI+'typescript/typescript-original.svg' },
      { name: 'JavaScript',  icon: _DI+'javascript/javascript-original.svg' },
      { name: 'Next.js',     icon: _DI+'nextjs/nextjs-original.svg',        invert: true },
      { name: 'Tailwind',    icon: _DI+'tailwindcss/tailwindcss-original.svg' },
      { name: 'Vite',        icon: _DI+'vitejs/vitejs-original.svg' },
      { name: 'Redux',       icon: _DI+'redux/redux-original.svg' },
      { name: 'Figma',       icon: _DI+'figma/figma-original.svg' },
      { name: 'Three.js',    icon: _DI+'threejs/threejs-original.svg',      invert: true },
      { name: 'GraphQL',     icon: _DI+'graphql/graphql-plain.svg' },
      { name: 'HTML5',       icon: _DI+'html5/html5-original.svg' },
      { name: 'CSS3',        icon: _DI+'css3/css3-original.svg' },
    ],
    [
      { name: 'Python',      icon: _DI+'python/python-original.svg' },
      { name: 'FastAPI',     icon: _DI+'fastapi/fastapi-original.svg' },
      { name: 'Node.js',     icon: _DI+'nodejs/nodejs-original.svg' },
      { name: 'Express',     icon: _DI+'express/express-original.svg',      invert: true },
      { name: 'Docker',      icon: _DI+'docker/docker-original.svg' },
      { name: 'PostgreSQL',  icon: _DI+'postgresql/postgresql-original.svg' },
      { name: 'MongoDB',     icon: _DI+'mongodb/mongodb-original.svg' },
      { name: 'Redis',       icon: _DI+'redis/redis-original.svg' },
      { name: 'Supabase',    icon: _DI+'supabase/supabase-original.svg' },
      { name: 'Git',         icon: _DI+'git/git-original.svg' },
      { name: 'Linux',       icon: _DI+'linux/linux-original.svg' },
      { name: 'AWS',         icon: _DI+'amazonwebservices/amazonwebservices-plain.svg' },
    ],
    [
      { name: 'PyTorch',     icon: _DI+'pytorch/pytorch-original.svg' },
      { name: 'TensorFlow',  icon: _DI+'tensorflow/tensorflow-original.svg' },
      { name: 'Scikit-learn',icon: _DI+'scikitlearn/scikitlearn-original.svg' },
      { name: 'Pandas',      icon: _DI+'pandas/pandas-original.svg' },
      { name: 'NumPy',       icon: _DI+'numpy/numpy-original.svg' },
      { name: 'Jupyter',     icon: _DI+'jupyter/jupyter-original.svg' },
      { name: 'Firebase',    icon: _DI+'firebase/firebase-original.svg' },
      { name: 'Vercel',      icon: _DI+'vercel/vercel-original.svg',        invert: true },
      { name: 'Kubernetes',  icon: _DI+'kubernetes/kubernetes-original.svg' },
      { name: 'C++',         icon: _DI+'cplusplus/cplusplus-original.svg' },
      { name: 'Go',          icon: _DI+'go/go-original.svg' },
      { name: 'Rust',        icon: _DI+'rust/rust-original.svg',            invert: true },
    ],
  ];

  const STACK_ICON_MAP = {
    'React':       { src: _DI+'react/react-original.svg' },
    'TypeScript':  { src: _DI+'typescript/typescript-original.svg' },
    'Python':      { src: _DI+'python/python-original.svg' },
    'FastAPI':     { src: _DI+'fastapi/fastapi-original.svg' },
    'Supabase':    { src: _DI+'supabase/supabase-original.svg' },
    'PyTorch':     { src: _DI+'pytorch/pytorch-original.svg' },
    'Scikit-learn':{ src: _DI+'scikitlearn/scikitlearn-original.svg' },
    'Vite':        { src: _DI+'vitejs/vitejs-original.svg' },
    'JavaScript':  { src: _DI+'javascript/javascript-original.svg' },
    'Next.js':     { src: _DI+'nextjs/nextjs-original.svg', invert: true },
    'Node.js':     { src: _DI+'nodejs/nodejs-original.svg' },
    'Docker':      { src: _DI+'docker/docker-original.svg' },
    'PostgreSQL':  { src: _DI+'postgresql/postgresql-original.svg' },
    'Redis':       { src: _DI+'redis/redis-original.svg' },
    'Git':         { src: _DI+'git/git-original.svg' },
    'Three.js':    { src: _DI+'threejs/threejs-original.svg', invert: true },
  };
  function TechTile({ name, icon, invert = false }) {
    return (
      <div className="flex items-center gap-4 px-6 shrink-0" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '18px', height: '72px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {icon ? <img src={icon} alt={name} loading="lazy" style={{ width: '34px', height: '34px', objectFit: 'contain', filter: invert ? 'brightness(0)' : 'none' }} /> : <div style={{ width: '34px', height: '34px' }} />}
        <span className="font-semibold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: '#1a1a2e', fontSize: '0.82rem' }}>{name}</span>
      </div>
    );
  }

  function MarqueeSection() {
    const sectionRef = useRef(null);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
      const onScroll = () => {
        const el = sectionRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        setOffset((window.scrollY - top + window.innerHeight) * 0.3);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
    }, []);
    const triple = (arr) => [...arr, ...arr, ...arr];
    const dirs = [1, -1, 1];
    return (
      <section ref={sectionRef} className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col gap-3">
          {TECH_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-3" style={{ transform: 'translateX(' + String(dirs[ri] * (offset - 200)) + 'px)', willChange: 'transform' }}>
              {triple(row).map((tech, i) => <TechTile key={'r' + ri + '-' + i} {...tech} />)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ─── About ──────────────────────────────────────────────── */
  function AboutSection() {
    return (
      <section id="about" className="min-h-screen relative px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--bg)' }}>

        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
          <FadeIn as="h2" delay={0} y={40} className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            About me
          </FadeIn>
          <AnimatedText
            text="A computer science student at Manipal University Jaipur, I focus on building AI-powered platforms, full-stack web applications, and developer-friendly experiences."
            className="font-medium text-center leading-relaxed"
            style={{ color: 'var(--text)', maxWidth: '560px', fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <FadeIn delay={0.2}>
            <a
              href="/MihirSanghvi.pdf"
              download
              className="resume-btn inline-flex items-center gap-3 rounded-full font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm"
            >
              {/* default: light coloured text */}
              <span className="btn-default inline-flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Resume
              </span>
              {/* hover: black text revealed left-to-right in sync with white fill */}
              <span className="btn-hover font-medium uppercase tracking-widest text-xs sm:text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Resume
              </span>
            </a>
          </FadeIn>
        </div>
        
      </section>
    );
  }


  /* ─── Journey / Timeline ─────────────────────────────── */
  const JT_DATA = [
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
      date: 'Nov - Dec 2025',
      title: 'Technical Writer',
      subtitle: 'The Digital Dose',
      desc: 'Translating complex platforms into approachable reads for a Medium audience: AI, Web3, and emerging tech that gets read, clapped, and shared.',
      highlights: [
        { col: 'jt-ic-rose',   label: 'Articles Shipped',  detail: '6 technical articles on AI, Web3 and emerging tech in under 8 weeks', icon: 'pen' },
        { col: 'jt-ic-green',  label: 'Engagement',        detail: '400+ claps and ~600 views accumulated across pieces', icon: 'thumb' },
        { col: 'jt-ic-amber',  label: 'Top Article',       detail: 'Web3 piece hit 104 claps, topping the publication run', icon: 'star' },
        { col: 'jt-ic-blue',   label: 'Explained Simply',  detail: 'Made Satsuma, Sarvam & GPT-5.1 accessible to general readers', icon: 'layers' },
      ],
      tags: ['AI', 'Web3', 'Satsuma', 'Sarvam', 'GPT-5.1'],
      btnLabel: 'Read on Medium',
      btnHref: 'https://medium.com/@thedigitaldose25',
    },
  ];

  function JtIcon({ type }) {
    if (type === 'users') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    if (type === 'file')  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
    if (type === 'trending') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
    if (type === 'award') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>);
    if (type === 'pen')   return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>);
    if (type === 'thumb') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>);
    if (type === 'star')  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
    if (type === 'layers') return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
    return null;
  }

  function MediumIcon() {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    );
  }

  /* ─── Static cover card with invisible clickable button over photo ── */
  function JtCardCover({ item, imgSrc, btnPos = {} }) {
    const [hovered, setHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const ref = useRef(null);

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
        <img
          src={imgSrc}
          alt="cover"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transition: 'filter 0.3s ease',
            filter: hovered ? 'brightness(1.08)' : 'brightness(1)',
          }}
        />
        {/* real button coded exactly over the "Read on Medium" in the photo */}
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

  function JtCard({ item }) {
    const ref = useRef(null);
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
        <a href={item.btnHref} target="_blank" rel="noopener noreferrer" className="jt-btn">
          <MediumIcon />
          {item.btnLabel}
          <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    );
  }

  function JourneySection() {
    const timelineRef = useRef(null);
    const progRef = useRef(null);
    const dotsRef = useRef([]);

    useEffect(() => {
      const tl = timelineRef.current;
      const prog = progRef.current;
      if (!tl || !prog) return;
      let raf = null;
      function update() {
        const rect = tl.getBoundingClientRect();
        const anchor = window.innerHeight * 0.55;
        const fill = Math.max(0, Math.min(rect.height, anchor - rect.top));
        prog.style.height = fill + 'px';
        prog.classList.toggle('is-active', fill > 4 && fill < rect.height - 4);
        dotsRef.current.forEach(dot => {
          if (!dot) return;
          const r = dot.getBoundingClientRect();
          dot.classList.toggle('is-active', r.top + r.height / 2 < anchor);
        });
      }
      function onScroll() {
        if (raf) return;
        raf = requestAnimationFrame(() => { update(); raf = null; });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }, []);

    return (
      <section id="journey"
        className="px-5 sm:px-8 md:px-10 py-20 sm:py-28 md:py-36 relative"
        style={{ background: 'var(--bg)' }}
      >
        <FadeIn as="h2" y={40}
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-24"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Journey So Far
        </FadeIn>
        <div className="max-w-5xl mx-auto">
          <div ref={timelineRef} className="jt-timeline">
            <div className="jt-line" />
            <div ref={progRef} className="jt-prog" />
            {JT_DATA.map((item, i) => (
              <div key={i} className={"jt-item jt-item-" + item.side}>
                <div ref={el => dotsRef.current[i] = el} className="jt-dot" />
                <span className="jt-date-pill">{item.date}</span>
                {i === 0
                  ? <JtCardCover item={item} imgSrc="/images/GDG.png" btnPos={{ bottom: '6%', left: '12%', right: '12%', height: '7%' }} />
                  : i === 1
                  ? <JtCardCover item={item} imgSrc="/images/DD.png" btnPos={{ bottom: '6.25%', left: '5%', right: '23%', height: '7%' }} />
                  : <JtCard item={item} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ─── Services ───────────────────────────────────────────── */
  const SERVICES = [
    { n: '01', name: 'Full-Stack Development', desc: 'End-to-end web applications built with React, TypeScript, FastAPI, and modern databases. From clean component architecture to robust backend logic and auth.' },
    { n: '02', name: 'AI / ML Engineering', desc: 'Designing intelligent systems with PyTorch, XGBoost, and LLM pipelines, including RAG platforms, classification models, and multi-agent workflows that ship real value.' },
    { n: '03', name: 'Frontend Development', desc: 'Responsive, accessible interfaces built with React, Vite, and Tailwind, focused on performance, smooth interactions, and a polished user experience.' },
    { n: '04', name: 'Backend & APIs', desc: 'Scalable APIs and data layers using FastAPI, Supabase, Postgres, and ChromaDB, including role-based auth, vector search, and clean integration patterns.' },
    { n: '05', name: 'Technical Writing', desc: 'Clear, structured technical articles on AI, Web3, and modern dev tooling, translating complex platforms into reader-friendly explanations for engineers and creators.' }
  ];

  function ServicesSection() {
    return (
      <section id="skills" className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0" style={{ background: 'var(--services-bg)' }}>
        <FadeIn as="h2" y={40} className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ color: 'var(--services-text)', fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1 }}>
          Services
        </FadeIn>
        <div className="max-w-5xl mx-auto">
          {SERVICES.map((s, i) => (
            <FadeIn
              key={s.n}
              delay={i * 0.08}
              y={28}
              className="services-row flex items-start gap-6 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
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
      </section>
    );
  }

  /* ─── Projects ───────────────────────────────────────────── */

  // Replace img1/img2/img3 with actual screenshot URLs when ready.
  // Current values are empty — shows a clean dark placeholder.
  const PROJECTS = [
    {
      n: '01',
      tag: 'Full-Stack / AI',
      name: 'AskIT',
      blurb: "A multi-agent RAG knowledge base where admins ingest PDFs and URLs into a vector store and users query it via an AI chat with cited answers. Built with React, FastAPI, Supabase, ChromaDB, and Groq's Llama 3.",
      href: 'https://github.com/mihirr-spec/AskIT',
      stack: ['React','TypeScript','Python','FastAPI','Supabase','ChromaDB','Groq'],
      img1: '/images/askit3.png',
      img2: '/images/askit1.jpeg',
      img3: '/images/askit2.png',
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
      img1: '/images/SEHAI1.jpeg',
      img2: '/images/SEHAI3.png',
      img3: '/images/Sehai2.png',
    },
    {
      n: '03',
      tag: 'Web Tool / Academic',
      name: 'SRS Builder',
      blurb: 'A client-side React tool that converts GitHub README content into IEEE 830-compliant LaTeX SRS documents. Fully free, no backend, no API calls. Gained 400+ organic visitors and actively used by classmates for academic PBL submissions.',
      href: 'https://github.com/mihirr-spec',
      stack: ['React','TypeScript','Vite','Vercel'],
      live: 'https://srs-builder.vercel.app/',
      img1: '/images/SRS1.jpeg',
      img2: '/images/SRS3.jpeg',
      img3: '/images/SRS2.png',
      img3Zoom: 1.08
    }
  ];

  /* Gracefully renders an image or a clean dark placeholder */
  function ProjectImage({ src, fit = 'cover', pos = 'center', zoom = 1 }) {
    const [err, setErr] = useState(false);
    const empty = !src || src.trim() === '' || err;
    return (
      <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: 'inherit' }}>
        {/* Always-present dark bg — visible as placeholder when no image */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--card-empty)', borderRadius: 'inherit' }}
        />
        {/* Subtle dot pattern overlay when empty */}
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
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: fit, objectPosition: pos, borderRadius: 'inherit', transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: 'center center' }}
            onError={() => setErr(true)}
          />
        )}
      </div>
    );
  }

  function ProjectCard({ project, index, total, progress, range }) {
    const targetScale = 1 - (total - 1 - index) * 0.025;
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
      // Each card is slightly shorter than the previous so stacking doesn't exceed
      // the section and blurbs can't bleed below the next card.
      <div
        className="sticky project-stack-card"
        style={{ top: `calc(4.5rem + ${index * 22}px)`, height: `calc(88vh - ${index * 11}px)` }}
      >
        <M.div style={{ scale, transformOrigin: 'top center' }} className="h-full">
          {/* overflow-hidden ensures NOTHING bleeds out of this card's boundary */}
          <div
            className="h-full rounded-[28px] md:rounded-[34px] overflow-hidden flex flex-col md:flex-row"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--ta16)' }}
          >
            {/* ── LEFT: info panel ─────────────────────────── */}
            <div
              className="flex flex-col justify-between px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 shrink-0 md:w-[36%]"
              style={{ borderBottom: '1px solid var(--ta09)', borderRight: 'none' }}
            >
              {/* Top: number + tag + name + blurb */}
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
                    onMouseEnter={e => e.currentTarget.style.background = '#E4E4E4'}
                    onMouseLeave={e => e.currentTarget.style.background = '#F2F2F2'}
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

            {/* ── RIGHT: image grid ─────────────────────────── */}
            {/* 2-col × 2-row; img3 spans full right column height */}
            <div className="project-image-grid flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-3 md:p-4" style={{ minHeight: 0 }}>
              <div className="col-start-1 row-start-1 rounded-[14px] md:rounded-[18px] overflow-hidden">
                <ProjectImage src={project.img1} pos="top" />
              </div>
              <div className="col-start-2 row-start-1 row-span-2 rounded-[14px] md:rounded-[18px] overflow-hidden">
                <ProjectImage src={project.img3} fit={project.img3Fit || "cover"} pos={project.img3Pos || "top"} zoom={project.img3Zoom || 1} />
              </div>
              <div className="col-start-1 row-start-2 rounded-[14px] md:rounded-[18px] overflow-hidden">
                <ProjectImage src={project.img2} fit={project.img2Fit || "cover"} pos="top" zoom={project.img2Zoom || 1} />
              </div>
            </div>
          </div>
        </M.div>
      </div>
    );
  }

  function ProjectsSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const total = PROJECTS.length;
    return (
      <section
        id="projects"
        ref={containerRef}
        className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-32 pb-40"
        style={{ background: 'var(--bg)' }}
      >
        <FadeIn as="h2" y={40} className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-14 sm:mb-20 md:mb-24" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Projects
        </FadeIn>
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

  /* ─── Footer ─────────────────────────────────────────────── */
  function Footer() {
    return (
      <footer id="contact" className="overflow-hidden relative z-10" style={{ background: 'var(--bg)' }}>
        {/* Top divider */}
        <div className="mx-6 md:mx-10" style={{ height: '1px', background: 'var(--ta09)' }} />

        {/* Main CTA — giant LET'S TALK */}
        <div className="px-6 md:px-10 pt-20 sm:pt-28 md:pt-40 pb-14 sm:pb-20">
          <div className="max-w-[1440px] mx-auto text-center">

            <FadeIn y={70} duration={0.95}>
              <div
                className="hero-heading font-black uppercase leading-[0.87] tracking-tight select-none"
                style={{ fontSize: 'clamp(5.5rem, 20vw, 250px)' }}
              >
                Let&apos;s<br />talk
              </div>
            </FadeIn>

            <FadeIn delay={0.18} y={28} className="footer-cta-row mt-10 sm:mt-16 md:mt-20 flex flex-col sm:flex-row sm:items-end justify-center gap-8 sm:gap-16">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <span
                  className="uppercase tracking-[0.2em] font-light"
                  style={{ color: 'var(--text)', opacity: 0.35, fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
                >
                  Drop me a line
                </span>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=sanghvimihir96@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium uppercase tracking-wide hover:opacity-55 transition-opacity duration-200"
                  style={{ color: 'var(--text)', fontSize: 'clamp(0.88rem, 1.6vw, 1.3rem)' }}
                >
                  sanghvimihir96@gmail.com
                </a>
              </div>

              {/* Social links */}
              <div className="footer-socials flex items-center gap-7 sm:gap-9">
                {[
                  { label: 'GitHub',   href: 'https://github.com/mihirr-spec',
                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mihir-sanghvi-a931b7329/',
                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                  { label: 'Twitter',  href: 'https://x.com/mihirsanghvi04',
                    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.639 5.906-5.639zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em] hover:opacity-55 transition-opacity duration-200"
                    style={{ color: 'var(--text)', fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)' }}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom bar */}
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

  /* ─── App ────────────────────────────────────────────────── */
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
