import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles, Zap, Eye, Code, Layers, Download } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <header className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/favicon.png" alt="Logo" width={60} height={60} priority />
            <span className="font-bold text-lg gradient-text">QuickWeb.ai</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="py-20 md:py-8">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Powered by Advanced AI</span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
                Generate <span className="gradient-text">stunning websites</span> from prompts
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Transform your ideas into fully-functional, beautiful websites instantly. Just describe what you want,
                and watch AI bring it to life with clean code and modern design.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/prompt">
                <Button
                  size="lg"
                  className="text-base h-14 px-10 gradient-primary glow hover:glow-strong transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base h-14 px-10 glass bg-transparent">
                <Eye className="w-5 h-5 mr-2" />
                See Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to <span className="gradient-text">build faster</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Production-ready websites in seconds with powerful AI-driven features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Large feature */}
            <div className="md:col-span-2 glass p-10 md:p-12 rounded-2xl group hover:glow transition-all duration-300">
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold">AI-Powered Generation</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Advanced language models understand your requirements and generate clean, semantic HTML, CSS, and
                      JavaScript code instantly with best practices built-in.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="glass p-8 rounded-2xl group hover:glow transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Real-time Preview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    See your website come to life as it generates with instant preview updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="glass p-8 rounded-2xl group hover:glow transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-chart-3 to-chart-4 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">File Explorer</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Browse through generated files with an intuitive tree structure interface.
                  </p>
                </div>
              </div>
            </div>

            {/* Medium feature */}
            <div className="md:col-span-2 glass p-10 rounded-2xl group hover:glow transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-secondary to-primary flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Advanced Code Editor</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    View and inspect all generated code with syntax highlighting and formatted output. Toggle between
                    code and preview views seamlessly for the perfect workflow.
                  </p>
                </div>
              </div>
            </div>

            {/* Large feature */}
            <div className="md:col-span-2 glass p-10 md:p-12 rounded-2xl group hover:glow transition-all duration-300">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-chart-2 to-accent flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold">Build Steps Tracking</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Follow along as your website is built step-by-step with detailed progress indicators and real-time
                    status updates for complete transparency.
                  </p>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="glass p-8 rounded-2xl group hover:glow transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-chart-5 to-chart-1 flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Export Ready</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Download your complete website files ready for deployment anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Frequently asked questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about QuickWeb.ai</p>
          </div>

          <div className="glass rounded-2xl p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg">How does the website generation work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  QuickWeb.ai uses advanced AI language models to understand your prompt and generate complete HTML, CSS, and
                  JavaScript code. Simply describe what you want, and the AI creates a fully-functional website based on
                  your requirements with modern design patterns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg">What kind of websites can I generate?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  You can generate landing pages, portfolios, business websites, blogs, dashboards, and more. The AI
                  understands various web design patterns and can create responsive, modern websites for almost any use
                  case you can imagine.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg">Can I edit the generated code?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes! You can view all generated code through the built-in code editor with syntax highlighting. You
                  can copy the code and make any modifications you need in your own development environment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg">How long does generation take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Most websites are generated within 30-60 seconds. The exact time depends on the complexity of your
                  requirements and the number of pages requested. You'll see real-time progress updates throughout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg">
                  What technologies are used in generated websites?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  QuickWeb.ai creates websites using modern web standards including HTML5, CSS3, and vanilla JavaScript. The
                  generated code is clean, semantic, and follows best practices for accessibility and performance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg">
                  Can I use the generated websites commercially?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes! All generated code is yours to use however you like, including for commercial projects. You have
                  full ownership of the websites you generate with complete freedom to modify and deploy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="glass-strong rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto glow">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-balance">
                  Ready to <span className="gradient-text">build something amazing?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start creating beautiful websites in seconds. No credit card required.
                </p>
              </div>
              <Link href="/prompt">
                <Button
                  size="lg"
                  className="text-base h-14 px-10 gradient-primary glow hover:glow-strong transition-all"
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
      <footer className="border-t border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg gradient-primary" />
            <span className="font-semibold gradient-text">QuickWeb.ai</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with Next.js, TypeScript, and AI Magic</p>
        </div>
      </footer>
    </div>
  )
}
