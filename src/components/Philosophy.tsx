const principles = [
  { left: "Small units", right: "giant institutions" },
  { left: "Presence", right: "PR" },
  { left: "Service first", right: "story second" },
  { left: "Dignity", right: "data" },
  { left: "Courage in darkness", right: "comfort in safety" },
  { left: "Love as infrastructure", right: "sentiment" },
];

const Philosophy = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20" />
      <div className="absolute top-1/2 left-0 w-1/2 h-64 bg-terracotta/5 blur-[100px] rounded-full" />
      
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-widest text-amber font-medium mb-4 block">
              The Philosophy
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Why This Is a "Mother Teresa Ecosystem"
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              It doesn't imitate her religion. It imitates her method.
            </p>
          </div>
          
          {/* Principles contrast grid */}
          <div className="space-y-4">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-5 md:p-6 bg-card/40 backdrop-blur-sm border border-border rounded-xl hover:border-primary/20 transition-all duration-300"
              >
                <span className="font-serif text-lg md:text-xl font-medium text-terracotta">
                  {principle.left}
                </span>
                <span className="text-2xl text-muted-foreground/40 font-light">›</span>
                <span className="text-lg md:text-xl text-muted-foreground/60 line-through decoration-muted-foreground/30">
                  {principle.right}
                </span>
              </div>
            ))}
          </div>
          
          {/* Quote */}
          <blockquote className="mt-16 text-center">
            <p className="font-serif text-2xl md:text-3xl italic text-foreground/80 leading-relaxed mb-4">
              "The first infrastructure layer designed around compassion as a utility."
            </p>
            <cite className="text-muted-foreground text-sm uppercase tracking-wider not-italic">
              — CIE Manifesto
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
