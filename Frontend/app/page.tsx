import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles, Zap, Eye, Code, Layers, Download, Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Japandi Decorative Background Elements - High Visibility */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Concentric circles - top right */}
        <svg className="absolute -top-16 -right-16 w-[320px] h-[320px] opacity-50" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="48" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="100" cy="100" r="28" fill="none" stroke="#C67C4E" strokeWidth="3" />
        </svg>

        {/* Large semicircle - left side */}
        <div className="absolute top-48 -left-20 w-48 h-24 rounded-t-full bg-[#8B9D83]/50" />

        {/* Arch shape - bottom left */}
        <svg className="absolute bottom-28 left-10 w-16 h-24 opacity-45" viewBox="0 0 50 70">
          <path d="M 5 70 L 5 28 Q 5 5 25 5 Q 45 5 45 28 L 45 70" fill="none" stroke="#D4A574" strokeWidth="4" />
        </svg>

        {/* Organic blob - top left */}
        <div className="absolute top-56 left-[7%] w-14 h-18 bg-[#D4A574]/45 rounded-[60%_40%_50%_50%/50%_60%_40%_50%]" />

        {/* Circle cluster - right side */}
        <div className="absolute top-[45%] right-[5%] flex flex-col gap-3">
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/60" />
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/70" />
          <div className="w-5 h-5 rounded-full bg-[#C67C4E]/60" />
        </div>

        {/* Organic blob - bottom right */}
        <div className="absolute -bottom-6 right-[10%] w-24 h-32 bg-[#8B9D83]/40 rounded-[40%_60%_50%_50%/60%_40%_60%_40%]" />

        {/* Semicircle - bottom */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-72 h-36 rounded-t-full bg-[#D4A574]/25" />

        {/* Small concentric circles - left */}
        <svg className="absolute top-[35%] left-[10%] w-16 h-16 opacity-45" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#8B9D83" strokeWidth="3" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#8B9D83" strokeWidth="3" />
        </svg>

        {/* Floating dots */}
        <div className="absolute top-32 right-[20%] w-5 h-5 rounded-full bg-[#D4A574]/55" />
        <div className="absolute top-48 right-[26%] w-3 h-3 rounded-full bg-[#C67C4E]/60" />
        <div className="absolute bottom-40 left-[20%] w-4 h-4 rounded-full bg-[#8B9D83]/55" />

        {/* Curved line */}
        <svg className="absolute top-[26%] right-[3%] w-12 h-24 opacity-40" viewBox="0 0 40 80">
          <path d="M 20 0 Q 40 20 20 40 Q 0 60 20 80" fill="none" stroke="#C67C4E" strokeWidth="4" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">QuickWeb.ai</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Advanced AI</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground">
                Generate <span className="japandi-text-gradient font-medium">stunning websites</span> from prompts
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into fully-functional, beautiful websites instantly. Just describe what you want,
                and watch AI bring it to life with clean code and modern design.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/prompt">
                <Button
                  size="lg"
                  className="text-base h-14 px-10 japandi-gradient text-white organic-shadow japandi-hover"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base h-14 px-10 border-border/60 bg-card/50 japandi-hover">
                <Eye className="w-5 h-5 mr-2" />
                See Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative z-10">
        {/* Section decorative elements */}
        <svg className="absolute top-10 right-10 w-16 h-16 opacity-40" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#C67C4E" strokeWidth="3" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#C67C4E" strokeWidth="3" />
        </svg>
        <div className="absolute bottom-16 left-10 w-12 h-16 bg-[#8B9D83]/35 rounded-[50%_50%_40%_60%/60%_40%_60%_40%]" />

        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Everything you need to <span className="japandi-text-gradient font-medium">build faster</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Production-ready websites in seconds with powerful AI-driven features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large feature */}
            <div className="md:col-span-2 japandi-card-elevated p-10 md:p-12 rounded-2xl japandi-hover">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl japandi-gradient flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-medium text-foreground">AI-Powered Generation</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Advanced language models understand your requirements and generate clean, semantic HTML, CSS, and
                      JavaScript code instantly with best practices built-in.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="japandi-card-elevated p-8 rounded-2xl japandi-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl japandi-gradient-warm flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">Real-time Preview</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    See your website come to life as it generates with instant preview updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="japandi-card-elevated p-8 rounded-2xl japandi-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">File Explorer</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Browse through generated files with an intuitive tree structure interface.
                  </p>
                </div>
              </div>
            </div>

            {/* Medium feature */}
            <div className="md:col-span-2 japandi-card-elevated p-10 rounded-2xl japandi-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-medium text-foreground">Advanced Code Editor</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    View and inspect all generated code with syntax highlighting and formatted output. Toggle between
                    code and preview views seamlessly for the perfect workflow.
                  </p>
                </div>
              </div>
            </div>

            {/* Large feature */}
            <div className="md:col-span-2 japandi-card-elevated p-10 md:p-12 rounded-2xl japandi-hover">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-foreground">Build Steps Tracking</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Follow along as your website is built step-by-step with detailed progress indicators and real-time
                    status updates for complete transparency.
                  </p>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="japandi-card-elevated p-8 rounded-2xl japandi-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl japandi-gradient flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">Export Ready</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Download your complete website files ready for deployment anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative z-10">
        {/* Decorative arch */}
        <svg className="absolute top-16 left-6 w-10 h-16 opacity-40" viewBox="0 0 50 80">
          <path d="M 5 80 L 5 30 Q 5 5 25 5 Q 45 5 45 30 L 45 80" fill="none" stroke="#D4A574" strokeWidth="4" />
        </svg>
        <div className="absolute bottom-12 right-12 w-6 h-6 rounded-full bg-[#C67C4E]/50" />

        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-light text-foreground">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about QuickWeb.ai</p>
          </div>

          <div className="japandi-card-elevated rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/40">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  How does the website generation work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  QuickWeb.ai uses advanced AI language models to understand your prompt and generate complete HTML, CSS, and
                  JavaScript code. Simply describe what you want, and the AI creates a fully-functional website based on
                  your requirements with modern design patterns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-border/40">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  What kind of websites can I generate?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  You can generate landing pages, portfolios, business websites, blogs, dashboards, and more. The AI
                  understands various web design patterns and can create responsive, modern websites for almost any use
                  case you can imagine.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-border/40">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  Can I edit the generated code?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  Yes! You can view all generated code through the built-in code editor with syntax highlighting. You
                  can copy the code and make any modifications you need in your own development environment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-border/40">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  How long does generation take?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  Most websites are generated within 30-60 seconds. The exact time depends on the complexity of your
                  requirements and the number of pages requested. You&apos;ll see real-time progress updates throughout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-border/40">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  What technologies are used in generated websites?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  QuickWeb.ai creates websites using modern web standards including HTML5, CSS3, and vanilla JavaScript. The
                  generated code is clean, semantic, and follows best practices for accessibility and performance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-border/40 border-b-0">
                <AccordionTrigger className="text-left text-base hover:no-underline py-5">
                  Can I use the generated websites commercially?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  Yes! All generated code is yours to use however you like, including for commercial projects. You have
                  full ownership of the websites you generate with complete freedom to modify and deploy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        {/* Concentric circles decoration */}
        <svg className="absolute -bottom-8 -left-8 w-28 h-28 opacity-35" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#8B9D83" strokeWidth="3" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#8B9D83" strokeWidth="3" />
        </svg>

        <div className="container mx-auto px-6">
          <div className="japandi-card-elevated organic-shadow-lg rounded-3xl p-12 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
            {/* Decorative circles inside CTA */}
            <div className="absolute top-6 right-6 w-14 h-14 rounded-full border-2 border-[#C67C4E]/40" />
            <div className="absolute top-10 right-10 w-7 h-7 rounded-full border border-[#D4A574]/50" />
            <div className="absolute bottom-8 left-8 w-10 h-10 rounded-full bg-[#D4A574]/30" />
            <div className="absolute bottom-14 left-14 w-5 h-5 rounded-full bg-[#8B9D83]/40" />

            {/* Organic blob */}
            <div className="absolute -bottom-4 -right-4 w-20 h-24 bg-[#8B9D83]/25 rounded-[40%_60%_50%_50%/60%_40%_60%_40%]" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-light text-foreground">
                  Ready to <span className="japandi-text-gradient font-medium">build something amazing?</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Start creating beautiful websites in seconds. No credit card required.
                </p>
              </div>
              <Link href="/prompt">
                <Button
                  size="lg"
                  className="text-base h-14 px-10 japandi-gradient text-white organic-shadow japandi-hover"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 relative z-10">
        {/* Small decorative dots */}
        <div className="absolute top-4 right-20 w-3 h-3 rounded-full bg-[#C67C4E]/45" />
        <div className="absolute top-6 right-24 w-2 h-2 rounded-full bg-[#D4A574]/50" />

        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-foreground">QuickWeb.ai</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with Next.js, TypeScript, and AI</p>
        </div>
      </footer>
    </div>
  )
}
