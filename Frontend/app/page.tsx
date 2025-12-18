import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground" />
            <span className="font-mono text-sm font-medium">WEBGEN</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
                Generate complete websites from prompts
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Transform your ideas into fully-functional websites instantly. Simply describe what you want to build,
                and watch it come to life.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Link href="/prompt">
                <Button size="lg" className="text-base h-12 px-8">
                  Generate Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for speed and precision</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to generate production-ready websites in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Large feature - spans 2 columns */}
            <div className="md:col-span-2 border border-border bg-card p-8 md:p-12">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-foreground mb-6" />
                  <h3 className="text-2xl font-bold mb-3">AI-Powered Generation</h3>
                  <p className="text-muted-foreground text-lg">
                    Advanced language models understand your requirements and generate clean, semantic HTML, CSS, and
                    JavaScript code instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Small feature */}
            <div className="border border-border bg-card p-8">
              <div className="w-10 h-10 bg-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground">
                See your website come to life as it generates with instant preview updates.
              </p>
            </div>

            {/* Small feature */}
            <div className="border border-border bg-card p-8">
              <div className="w-10 h-10 bg-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">File Explorer</h3>
              <p className="text-muted-foreground">
                Browse through generated files with an intuitive tree structure interface.
              </p>
            </div>

            {/* Medium feature - spans 2 columns */}
            <div className="md:col-span-2 border border-border bg-card p-8">
              <div className="w-10 h-10 bg-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Code Editor</h3>
              <p className="text-muted-foreground">
                View and inspect all generated code with syntax highlighting and formatted output. Toggle between code
                and preview views seamlessly.
              </p>
            </div>

            {/* Large feature - spans 2 columns */}
            <div className="md:col-span-2 border border-border bg-card p-8 md:p-12">
              <div className="w-12 h-12 bg-foreground mb-6" />
              <h3 className="text-2xl font-bold mb-3">Build Steps Tracking</h3>
              <p className="text-muted-foreground text-lg">
                Follow along as your website is built step-by-step with detailed progress indicators and status updates.
              </p>
            </div>

            {/* Small feature */}
            <div className="border border-border bg-card p-8">
              <div className="w-10 h-10 bg-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Export Ready</h3>
              <p className="text-muted-foreground">
                Download your complete website files ready for deployment anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-muted-foreground">Everything you need to know about WebGen</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">How does the website generation work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                WebGen uses advanced AI language models to understand your prompt and generate complete HTML, CSS, and
                JavaScript code. Simply describe what you want, and the AI creates a fully-functional website based on
                your requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What kind of websites can I generate?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can generate landing pages, portfolios, business websites, blogs, dashboards, and more. The AI
                understands various web design patterns and can create responsive, modern websites for almost any use
                case.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Can I edit the generated code?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! You can view all generated code through the built-in code editor. You can copy the code and make
                any modifications you need in your own development environment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">How long does generation take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most websites are generated within 30-60 seconds. The exact time depends on the complexity of your
                requirements and the number of pages requested.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                What technologies are used in generated websites?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                WebGen creates websites using modern web standards including HTML5, CSS3, and vanilla JavaScript. The
                generated code is clean, semantic, and follows best practices for accessibility and performance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">Can I use the generated websites commercially?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! All generated code is yours to use however you like, including for commercial projects. You have
                full ownership of the websites you generate.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Built with Next.js and TypeScript</p>
        </div>
      </footer>
    </div>
  )
}
