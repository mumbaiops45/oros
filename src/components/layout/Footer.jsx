import Image from "next/image";
import {
  categories,
  contact,
  importantLinks,
  partners,
} from "@/data/catalog";
import {
  BoxesIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  PinterestIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/Icons";

const socials = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Facebook", Icon: FacebookIcon },
  { label: "YouTube", Icon: YoutubeIcon },
  { label: "Pinterest", Icon: PinterestIcon },
  { label: "X", Icon: XIcon },
];

export default function Footer() {
  return (
    <footer className="bg-primary">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-15 lg:py-20">
        {/* White card holds the grid; everything around it is primary */}
        <div className="rounded-[28px] bg-white p-7 shadow-[0_30px_60px_-30px_rgba(32,57,74,0.45)] sm:p-10 lg:p-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* 1 — logo + description */}
            <div className="lg:col-span-4">
              <div className="flex flex-col leading-none">
                <span className="font-display text-3xl font-semibold tracking-[0.3em] text-ink">
                  OROS
                </span>
                <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.42em] text-navy/50">
                  3D Studio
                </span>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy/80">
                We design and 3D print everyday objects on 48 machines in Mumbai —
                decor, desk gear, figurines, cosplay props and functional parts.
                Bring us a file or an idea and we will print it in the material,
                colour and quantity you actually need.
              </p>

              <a
                href="#custom"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                <BoxesIcon className="h-4 w-4" />
                Bulk &amp; custom orders — MOQ from 10 pcs
              </a>
            </div>

            {/* 2 — categories */}
            <div className="lg:col-span-3">
              <h3 className="font-display text-base font-semibold text-ink">
                Category
              </h3>
              <span className="mt-2 block h-0.5 w-9 rounded-full bg-primary" />
              <ul className="mt-5 space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a
                      href="#categories"
                      className="text-sm text-navy/80 transition hover:text-primary"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 — important links */}
            <div className="lg:col-span-2">
              <h3 className="font-display text-base font-semibold text-ink">
                Important Links
              </h3>
              <span className="mt-2 block h-0.5 w-9 rounded-full bg-primary" />
              <ul className="mt-5 space-y-3">
                {importantLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-navy/80 transition hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4 — contact */}
            <div className="lg:col-span-3">
              <h3 className="font-display text-base font-semibold text-ink">
                Contact
              </h3>
              <span className="mt-2 block h-0.5 w-9 rounded-full bg-primary" />
              <ul className="mt-5 space-y-4 text-sm text-navy/80">
                <li>
                  <a href={contact.phoneHref} className="flex gap-3 transition hover:text-primary">
                    <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a href={contact.emailHref} className="flex gap-3 transition hover:text-primary">
                    <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-relaxed">{contact.address}</span>
                </li>
                <li className="flex gap-3">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {contact.hours}
                </li>
              </ul>
            </div>
          </div>

          {/* Social + partners */}
          <div className="mt-10 flex flex-col gap-8 border-t border-navy/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/50">
                Follow us
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {socials.map(({ label, Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/50">
                Materials &amp; tech partners
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-4 lg:justify-end">
                {partners.map((partner) => (
                  <Image
                    key={partner.name}
                    src={partner.logo}
                    alt={partner.name}
                    width={112}
                    height={28}
                    className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar — sits directly on primary */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-center text-xs text-white/85 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} OROS 3D Studio Pvt. Ltd. All rights reserved.</p>
          <p>Printed layer by layer in Mumbai · GST 27AABCO1234M1Z5</p>
        </div>
      </div>
    </footer>
  );
}
