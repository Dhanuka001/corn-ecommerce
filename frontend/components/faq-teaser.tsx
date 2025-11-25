type FAQ = {
  question: string;
  answer: string;
};

export function FAQTeaser({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6C4DF5]">
            FAQs
          </p>
          <h3 className="text-lg font-semibold text-[#0A0A0A]">
            Answers from Corn Support
          </h3>
        </div>
        <a
          href="/faq"
          className="text-sm font-semibold text-[#6C4DF5] transition hover:text-[#5b3de3]"
        >
          View all →
        </a>
      </div>
      <div className="mt-4 space-y-3">
        {faqs.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
          >
            <p className="font-semibold text-[#0A0A0A]">{item.question}</p>
            <p className="text-sm text-neutral-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
