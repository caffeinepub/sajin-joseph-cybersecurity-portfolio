import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitContact } from "../../hooks/useQueries";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useSubmitContact();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    const elements =
      sectionRef.current?.querySelectorAll(".section-reveal") ?? [];
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    mutate(
      { name, email, message },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName("");
          setEmail("");
          setMessage("");
          toast.success("Message sent! Sajin will get back to you soon.");
        },
        onError: () => {
          toast.error("Failed to send message. Please try again.");
        },
      },
    );
  };

  return (
    <section id="contact" className="relative z-10 py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 section-reveal">
          <span
            className="font-mono text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.87 0.28 145)" }}
          >
            {"// Let's Connect"}
          </span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">
            Get In Touch
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mt-4"
            style={{ background: "oklch(0.87 0.28 145)" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6 section-reveal">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Let's work together
              </h3>
              <p className="text-foreground/55 text-sm leading-relaxed">
                Whether you have a security challenge, a job opportunity, or
                just want to discuss cybersecurity — I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:sajinjoseph363@gmail.com"
                className="flex items-center gap-4 cyber-card p-4 group"
                data-ocid="contact.link"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "oklch(0.87 0.28 145 / 0.1)",
                    border: "1px solid oklch(0.87 0.28 145 / 0.3)",
                  }}
                >
                  <Mail
                    className="w-5 h-5"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  />
                </div>
                <div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider font-mono">
                    Email
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  >
                    sajinjoseph363@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/sajin-joseph-9471a9254/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 cyber-card p-4 group"
                data-ocid="contact.link"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "oklch(0.84 0.15 205 / 0.1)",
                    border: "1px solid oklch(0.84 0.15 205 / 0.3)",
                  }}
                >
                  <Linkedin
                    className="w-5 h-5"
                    style={{ color: "oklch(0.84 0.15 205)" }}
                  />
                </div>
                <div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider font-mono">
                    LinkedIn
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.84 0.15 205)" }}
                  >
                    sajin-joseph-9471a9254
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 cyber-card p-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "oklch(0.87 0.28 145 / 0.1)",
                    border: "1px solid oklch(0.87 0.28 145 / 0.3)",
                  }}
                >
                  <Phone
                    className="w-5 h-5"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  />
                </div>
                <div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider font-mono">
                    Phone
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  >
                    +91 7994247021
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div
            className="lg:col-span-3 section-reveal"
            style={{ transitionDelay: "150ms" }}
          >
            <div
              className="cyber-card p-6 md:p-8"
              style={{
                borderColor: "oklch(0.87 0.28 145 / 0.3)",
                boxShadow: "0 0 30px oklch(0.87 0.28 145 / 0.08)",
              }}
              data-ocid="contact.modal"
            >
              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="contact.success_state"
                >
                  <CheckCircle
                    className="w-16 h-16 mb-4"
                    style={{ color: "oklch(0.87 0.28 145)" }}
                  />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-foreground/55 mb-6">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    type="button"
                    className="btn-neon px-6 py-2"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="text-xs uppercase tracking-wider font-mono text-foreground/40"
                      >
                        Name *
                      </label>
                      <Input
                        id="contact-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-[oklch(0.11_0.02_240)] border-[oklch(0.22_0.04_240)] text-foreground placeholder:text-foreground/25"
                        data-ocid="contact.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="text-xs uppercase tracking-wider font-mono text-foreground/40"
                      >
                        Email *
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-[oklch(0.11_0.02_240)] border-[oklch(0.22_0.04_240)] text-foreground placeholder:text-foreground/25"
                        data-ocid="contact.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-xs uppercase tracking-wider font-mono text-foreground/40"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about your security challenge or opportunity..."
                      rows={6}
                      className="bg-[oklch(0.11_0.02_240)] border-[oklch(0.22_0.04_240)] text-foreground placeholder:text-foreground/25 resize-none"
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full font-semibold"
                    style={{
                      background: isPending
                        ? "oklch(0.87 0.28 145 / 0.5)"
                        : "oklch(0.87 0.28 145)",
                      color: "oklch(0.09 0.02 240)",
                      border: "none",
                    }}
                    data-ocid="contact.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
