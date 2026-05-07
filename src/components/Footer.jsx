import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCode,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <FiCode size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">
                  IMS Finance
                </h2>

                <p className="text-sm font-medium text-slate-500">
                  Developer Technical Test
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Mini finance system built using Laravel REST API and
              React.js to calculate installment schedules, penalties,
              billing due, and Excel export.
            </p>
          </div>

          {/* TECH STACK */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
              Tech Stack
            </h3>

            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Laravel",
                "React",
                "Tailwind",
                "MySQL",
                "REST API",
                "Excel Export",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
              Developer
            </h3>

            <div className="mt-4 space-y-3">
              <a
                href="mailto:ricky@example.com"
                className="flex items-center gap-3 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                <FiMail />
                rickynugraha1215.com
              </a>

              <a
                href="https://github.com/ricky-codes12"
                target="_blank"
                className="flex items-center gap-3 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                <FiGithub />
                github.com/ricky-codes12
              </a>

              <a
                href="https://www.linkedin.com/in/ricky-nugraha-91929b284/"
                className="flex items-center gap-3 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                <FiLinkedin />
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center md:flex-row">
          <p className="text-xs font-medium text-slate-400">
            © 2026 Ricky Nugraha. All rights reserved.
          </p>

          <p className="text-xs font-semibold text-slate-400">
            Built with ❤️ using Laravel + React
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;