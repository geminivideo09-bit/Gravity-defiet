import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Activity, Zap, Layers, Trophy, ChevronRight, Play, Clock, Info, ArrowLeft, Menu, X, Dumbbell, Target, Flame } from 'lucide-react';

/**
 * DATEN-STRUKTUR
 * Echte Calisthenics-Daten mit Progressionen und Kategorien.
 */
const SKILL_DATA = [
  {
    id: 'pushup',
    title: 'Push Up',
    category: 'Push',
    difficulty: 'Beginner',
    level: 1,
    description: 'Die Basis aller Druckübungen. Trainiert Brust, Schultern und Trizeps.',
    image: 'https://images.unsplash.com/photo-1598971639058-211a74a96fea?auto=format&fit=crop&q=80&w=800',
    steps: ['Hände schulterbreit', 'Körper eine gerade Linie', 'Ellbogen 45° zum Körper', 'Brust berührt fast den Boden'],
    progression: ['Wall Push Up', 'Incline Push Up', 'Knee Push Up'],
    unlocks: ['Diamond Push Up', 'Pseudo Planche Push Up']
  },
  {
    id: 'pullup',
    title: 'Pull Up',
    category: 'Pull',
    difficulty: 'Beginner',
    level: 2,
    description: 'Der König des Oberkörper-Zugs. Baut einen breiten Rücken und starke Arme.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
    steps: ['Hände etwas weiter als schulterbreit', 'Aktiver Hang (Scapula Retraction)', 'Kinn über die Stange ziehen', 'Kontrolliert ablassen'],
    progression: ['Dead Hang', 'Scapula Pulls', 'Australian Pull Up', 'Band Assisted Pull Up'],
    unlocks: ['Muscle Up', 'One Arm Pull Up']
  },
  {
    id: 'muscleup',
    title: 'Muscle Up',
    category: 'Dynamic',
    difficulty: 'Advanced',
    level: 7,
    description: 'Die ultimative Kombination aus Zug und Druck. Ein explosives Manöver.',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&q=80&w=800',
    steps: ['Explosiver High Pull Up', 'Übergang (Transition) schnell durchführen', 'Dips oben auf der Stange', 'Gerade Körperhaltung'],
    progression: ['Explosive Pull Ups', 'Straight Bar Dips', 'Jumping Muscle Up'],
    unlocks: ['Front Lever Muscle Up', '360 Muscle Up']
  },
  {
    id: 'frontlever',
    title: 'Front Lever',
    category: 'Static',
    difficulty: 'Elite',
    level: 9,
    description: 'Statische Halteübung, bei der der Körper horizontal unter der Stange schwebt.',
    image: 'https://images.unsplash.com/photo-1541600383005-565c949cf777?auto=format&fit=crop&q=80&w=800',
    steps: ['Arme komplett gestreckt', 'Latissimus extrem anspannen', 'Hüfte auf Schulterhöhe', 'Core maximal angespannt'],
    progression: ['Tuck Front Lever', 'Adv. Tuck Front Lever', 'Single Leg Front Lever', 'Straddle Front Lever'],
    unlocks: ['Front Lever Pull Ups', 'Victorian Cross']
  },
  {
    id: 'handstand',
    title: 'Handstand',
    category: 'Balance',
    difficulty: 'Intermediate',
    level: 5,
    description: 'Die Kunst der Balance auf den Händen. Erfordert Mobilität und Schulterkraft.',
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&q=80&w=800',
    steps: ['Hände schulterbreit', 'Finger weit spreizen (greifen den Boden)', 'Schultern aktiv ausdrücken (Elevation)', 'Hollow Body Position'],
    progression: ['Wall Handstand', 'Pike Hold', 'Frog Stand'],
    unlocks: ['Handstand Push Up', 'One Arm Handstand', '90 Degree Push Up']
  },
  {
    id: 'planche',
    title: 'Planche',
    category: 'Static',
    difficulty: 'God Tier',
    level: 10,
    description: 'Der Körper schwebt parallel zum Boden, gehalten nur durch die Hände.',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800',
    steps: ['Arme gestreckt (Ellenbogen locked)', 'Schultern weit vor die Hände lehnen', 'Scapula Protraktion (Rundrücken)', 'Beine gestreckt und zusammen'],
    progression: ['Planche Lean', 'Tuck Planche', 'Adv. Tuck Planche', 'Straddle Planche'],
    unlocks: ['Maltese', 'Planche Push Ups']
  }
];

// --- COMPONENTS ---

const Navigation = ({ currentPage, setPage, isMenuOpen, setIsMenuOpen }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div 
        className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent cursor-pointer"
        onClick={() => setPage('home')}
      >
        GRAVITY<span className="text-white">DEFIED</span>
      </div>
      
      <div className="hidden md:flex gap-8 items-center">
        {['home', 'skills', 'workouts', 'philosophy'].map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`uppercase text-sm font-bold tracking-widest transition-colors ${
              currentPage === page ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
        <button className="bg-white text-black px-6 py-2 font-bold uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors">
          Start Training
        </button>
      </div>

      <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </div>

    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
        >
          <div className="flex flex-col p-6 gap-4">
            {['home', 'skills', 'workouts', 'philosophy'].map((page) => (
              <button
                key={page}
                onClick={() => { setPage(page); setIsMenuOpen(false); }}
                className="text-left text-xl font-bold uppercase text-gray-300 hover:text-cyan-400"
              >
                {page}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

const Hero = ({ setPage }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: y1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full">
              Ultimate Calisthenics Hub
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
            DEINE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">GRAVITATION</span> <br />
            DEINE REGELN.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
            Meistere deinen Körper. Von den Grundlagen bis zu God-Tier Skills. 
            Lerne die Technik, verstehe die Progression und breche deine Limits.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setPage('skills')}
              className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors"
            >
              Skills lernen
              <div className="absolute inset-0 border border-white translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform pointer-events-none mix-blend-difference"></div>
            </button>
            <button 
              onClick={() => setPage('philosophy')}
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Philosophie
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ y: y2 }}
          className="relative hidden md:block"
        >
            <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Abstract Visual Representation of a planche */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                <img 
                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800" 
                    alt="Planche Master"
                    className="relative z-10 w-full h-full object-cover rounded-2xl grayscale contrast-125 border border-white/10 shadow-2xl"
                    style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
                />
                
                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -left-10 bg-zinc-900 p-4 border border-white/10 rounded-lg shadow-xl z-20"
                >
                    <div className="flex items-center gap-3">
                        <Activity className="text-cyan-400" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Current Skill</p>
                            <p className="text-white font-bold">Full Planche</p>
                        </div>
                    </div>
                </motion.div>

                 <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-5 -right-5 bg-zinc-900 p-4 border border-white/10 rounded-lg shadow-xl z-20"
                >
                    <div className="flex items-center gap-3">
                        <Flame className="text-orange-500" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Status</p>
                            <p className="text-white font-bold">God Mode</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

const SkillCard = ({ skill, onClick }) => (
  <motion.div 
    layoutId={`card-${skill.id}`}
    onClick={() => onClick(skill)}
    whileHover={{ y: -10 }}
    className="group cursor-pointer relative bg-zinc-900 border border-white/5 overflow-hidden h-96 flex flex-col justify-end"
  >
    <div className="absolute inset-0">
        <img src={skill.image} alt={skill.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>

    <div className="relative p-6 z-10">
        <div className="flex justify-between items-end mb-2">
             <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                skill.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                skill.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                skill.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                'bg-purple-500/20 text-purple-400'
            }`}>
                {skill.difficulty}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-colors">
                <ChevronRight size={16} className="text-white" />
            </div>
        </div>
      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{skill.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{skill.description}</p>
      
      {/* Level Bar */}
      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level * 10}%` }}
            className="h-full bg-cyan-400"
        />
      </div>
    </div>
  </motion.div>
);

const SkillDetail = ({ skill, onClose }) => {
    if (!skill) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
        >
            <motion.div 
                layoutId={`card-${skill.id}`}
                className="w-full max-w-6xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image & Stats */}
                <div className="w-full md:w-5/12 relative h-64 md:h-auto">
                    <img src={skill.image} className="w-full h-full object-cover grayscale opacity-80" alt={skill.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-6 left-6">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2">{skill.title}</h2>
                        <span className="text-cyan-400 font-bold uppercase tracking-widest">{skill.category}</span>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-7/12 p-8 overflow-y-auto">
                    
                    {/* Progression Path UI */}
                    <div className="mb-8">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                            <Layers size={16} /> Skill Tree Path
                        </h4>
                        <div className="flex flex-wrap gap-2 items-center">
                            {skill.progression.map((step, i) => (
                                <React.Fragment key={i}>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs rounded hover:bg-white/10 cursor-help transition-colors">
                                        {step}
                                    </span>
                                    <ChevronRight size={12} className="text-gray-600" />
                                </React.Fragment>
                            ))}
                            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-bold rounded shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                {skill.title}
                            </span>
                             {skill.unlocks.length > 0 && (
                                <>
                                    <ChevronRight size={12} className="text-gray-600" />
                                    <span className="px-3 py-1 border border-dashed border-gray-600 text-gray-500 text-xs rounded opacity-50">
                                        ???
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Target size={20} className="text-cyan-400"/> Execution
                            </h3>
                            <ul className="space-y-4">
                                {skill.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 border border-white/10">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-400"/> Unlocks
                            </h3>
                            <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-400 mb-3">Wenn du diesen Skill meisterst, bist du bereit für:</p>
                                <div className="space-y-2">
                                    {skill.unlocks.map((unlock, i) => (
                                        <div key={i} className="flex items-center gap-2 text-white text-sm font-medium">
                                            <Zap size={14} className="text-yellow-400" /> {unlock}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full mt-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest transition-colors rounded flex items-center justify-center gap-2 group">
                                <Play size={18} fill="currentColor" /> Tutorial starten
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SkillsPage = ({ onSkillClick }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Push', 'Pull', 'Static', 'Dynamic', 'Balance'];

    const filteredSkills = filter === 'All' 
        ? SKILL_DATA 
        : SKILL_DATA.filter(s => s.category === filter);

    return (
        <section className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
                    Skill <span className="text-cyan-400">Archiv</span>
                </h2>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider transition-all ${
                                filter === cat 
                                ? 'bg-white text-black border-white' 
                                : 'bg-transparent text-gray-400 border-white/20 hover:border-cyan-400 hover:text-cyan-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredSkills.map(skill => (
                        <SkillCard key={skill.id} skill={skill} onClick={onSkillClick} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

const WorkoutPage = () => (
    <section className="min-h-screen pt-32 pb-20 container mx-auto px-6">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
        >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                Routine <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Generator</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">Wähle dein Level. Wir bauen deinen Plan.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: 'Fundamentals', color: 'text-green-400', border: 'border-green-500/50', desc: 'Ganzkörper Kraft & Kondition für Einsteiger.' },
                { title: 'Hypertrophy', color: 'text-cyan-400', border: 'border-cyan-500/50', desc: 'Muskelaufbau mit Bodyweight-Übungen.' },
                { title: 'Statics', color: 'text-purple-400', border: 'border-purple-500/50', desc: 'Spezifisches Training für Front Lever & Planche.' }
            ].map((plan, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-zinc-900/50 border ${plan.border} p-8 rounded-2xl flex flex-col items-center text-center group cursor-pointer`}
                >
                    <Dumbbell className={`w-12 h-12 ${plan.color} mb-6`} />
                    <h3 className="text-2xl font-black text-white uppercase mb-4">{plan.title}</h3>
                    <p className="text-gray-400 mb-8">{plan.desc}</p>
                    <button className="mt-auto px-6 py-3 bg-white/5 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded transition-colors w-full">
                        Generieren
                    </button>
                </motion.div>
            ))}
        </div>
    </section>
);

const PhilosophyPage = () => (
    <section className="min-h-screen pt-32 pb-20 container mx-auto px-6 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                 <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-tight"
                >
                    Die Kunst der <br/>
                    <span className="text-cyan-400">Selbstbeherrschung</span>
                </motion.h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                    <p>
                        Calisthenics ist mehr als nur Training. Es ist der Beweis, dass du keine Maschinen brauchst, um stark zu werden. 
                        Dein Körper ist das einzige Werkzeug, das du jemals brauchen wirst.
                    </p>
                    <p>
                        Wir glauben an <strong>Progressive Overload</strong> durch Hebelwirkung, nicht durch externe Gewichte. 
                        Wir glauben an Qualität vor Quantität. Ein perfekter Pull-Up ist wertvoller als zehn schlechte.
                    </p>
                    <blockquote className="border-l-4 border-cyan-400 pl-6 py-2 italic text-white text-xl">
                        "The body achieves what the mind believes."
                    </blockquote>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl rotate-3"></div>
                <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl relative rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-6 uppercase">Core Values</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4">
                            <Activity className="text-cyan-400" />
                            <span className="text-white font-medium">Konsistenz über Intensität</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <Target className="text-cyan-400" />
                            <span className="text-white font-medium">Form vor Wiederholungen</span>
                        </li>
                         <li className="flex items-center gap-4">
                            <Layers className="text-cyan-400" />
                            <span className="text-white font-medium">Geduld in der Progression</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-2xl font-black tracking-tighter italic text-white">
                GRAVITY<span className="text-cyan-400">DEFIED</span>
            </div>
            <div className="text-gray-500 text-sm">
                © 2024 Gravity Defied. Built for Athletes.
            </div>
            <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">YouTube</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Community</a>
            </div>
        </div>
    </footer>
);

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll reset on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-cyan-500 selection:text-black font-sans">
      <Navigation 
        currentPage={page} 
        setPage={setPage} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero setPage={setPage} />
            <div className="py-20 bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <h3 className="text-3xl font-black text-white uppercase italic">Featured Skills</h3>
                        <button onClick={() => setPage('skills')} className="text-cyan-400 font-bold uppercase text-sm hover:text-white transition-colors flex items-center gap-2">View All <ChevronRight size={16}/></button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {SKILL_DATA.slice(0, 3).map(skill => (
                            <SkillCard key={skill.id} skill={skill} onClick={setSelectedSkill} />
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {page === 'skills' && (
          <motion.div 
            key="skills"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <SkillsPage onSkillClick={setSelectedSkill} />
          </motion.div>
        )}

        {page === 'workouts' && (
           <motion.div 
            key="workouts"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <WorkoutPage />
          </motion.div>
        )}

         {page === 'philosophy' && (
           <motion.div 
            key="philosophy"
            initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            <PhilosophyPage />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
            <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}