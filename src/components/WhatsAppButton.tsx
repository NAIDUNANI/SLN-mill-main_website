const WhatsAppButton = () => {
  const phone = "+918374570555";
  const message = "Hi! I'm interested in SLN Rice Mill products. Can you help me?";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.378L1.054 31.29l6.166-1.962A15.913 15.913 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.608c-.39 1.1-1.932 2.012-3.18 2.278-.854.18-1.968.324-5.72-1.228-4.804-1.986-7.896-6.87-8.136-7.19-.23-.32-1.932-2.572-1.932-4.904 0-2.332 1.222-3.476 1.656-3.952.39-.432.912-.596 1.212-.596.15 0 .284.008.404.014.434.02.652.046.938.724.358.846 1.228 2.998 1.334 3.216.108.218.216.516.068.824-.14.314-.262.454-.48.7-.218.248-.424.438-.642.706-.2.232-.424.48-.178.918.246.434 1.094 1.804 2.35 2.924 1.618 1.44 2.98 1.89 3.404 2.096.324.158.71.126.964-.152.322-.358.72-.952 1.124-1.538.288-.418.652-.47 1.008-.326.36.14 2.282 1.076 2.674 1.272.39.196.65.294.748.458.096.164.096.95-.294 2.05z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
