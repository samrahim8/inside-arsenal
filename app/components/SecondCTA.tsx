import SignupForm from "./SignupForm";

export default function SecondCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Don&apos;t miss it.
        </h2>
        <p className="text-[rgba(255,255,255,0.7)] mb-8">
          The best Arsenal content, one email, every Friday.
        </p>

        <div className="flex justify-center">
          <SignupForm
            utmSource="footer_cta"
            subtext="Join thousands of Arsenal fans."
          />
        </div>
      </div>
    </section>
  );
}
