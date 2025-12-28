import {
  Facebook,
  Github,
  Grid2X2,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

export function MinimalFooter() {
  const year = new Date().getFullYear();

  const company = [
    {
      title: "About Us",
      href: "#",
    },
    {
      title: "Careers",
      href: "#",
    },
    {
      title: "Brand assets",
      href: "#",
    },
    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
  ];

  const resources = [
    {
      title: "Blog",
      href: "#",
    },
    {
      title: "Help Center",
      href: "#",
    },
    {
      title: "Contact Support",
      href: "#",
    },
    {
      title: "Community",
      href: "#",
    },
    {
      title: "Security",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="size-4" />,
      link: "#",
    },
    {
      icon: <Github className="size-4" />,
      link: "#",
    },
    {
      icon: <Instagram className="size-4" />,
      link: "#",
    },
    {
      icon: <Linkedin className="size-4" />,
      link: "#",
    },
    {
      icon: <Twitter className="size-4" />,
      link: "#",
    },
    {
      icon: <Youtube className="size-4" />,
      link: "#",
    },
  ];
  return (
    <footer className="relative font-poppins">
      <div className="bg-[radial-gradient(35%_80%_at_30%_0%,hsl(var(--foreground)/.1),transparent)] mx-auto max-w-6xl md:border-x border-neutral-800">
        <div className="bg-neutral-800 absolute inset-x-0 h-px w-full" />
        
        {/* Mobile Footer - Simple */}
        <div className="md:hidden py-6 px-4">
          <div className="flex flex-col items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <Grid2X2 className="size-6 text-white opacity-50" />
              <span className="text-white font-semibold">OatMeal</span>
            </a>
            <p className="text-gray-400 text-sm text-center">
              AI-Powered Resume Builder
            </p>
            <div className="flex gap-3">
              {socialLinks.slice(0, 4).map((item, i) => (
                <a
                  key={i}
                  className="hover:bg-neutral-800 rounded-md border border-neutral-800 p-1.5 text-white transition-colors"
                  target="_blank"
                  href={item.link}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs">
              © OatMeal {year} - Made with ❤️ by Udai
            </p>
          </div>
        </div>

        {/* Desktop Footer - Full */}
        <div className="hidden md:flex max-w-6xl justify-between items-start p-4">
          <div className="flex flex-col gap-5 max-w-md">
            <a href="#" className="w-max opacity-25">
              <Grid2X2 className="size-8 text-white" />
            </a>
            <p className="text-gray-400 font-poppins text-sm text-balance">
              Effortlessly Craft a Professional Resume with Our AI-Powered
              Builder
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  className="hover:bg-neutral-800 rounded-md border border-neutral-800 p-1.5 text-white transition-colors"
                  target="_blank"
                  href={item.link}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-16">
            <div className="w-full">
              <span className="text-gray-400 mb-1 text-xs">Resources</span>
              <div className="flex flex-col gap-1">
                {resources.map(({ href, title }, i) => (
                  <a
                    key={i}
                    className={`w-max py-1 text-sm duration-200 hover:underline text-white`}
                    href={href}
                  >
                    {title}
                  </a>
                ))}
              </div>
            </div>
            <div className="w-full">
              <span className="text-gray-400 mb-1 text-xs">Company</span>
              <div className="flex flex-col gap-1">
                {company.map(({ href, title }, i) => (
                  <a
                    key={i}
                    className={`w-max py-1 text-sm duration-200 hover:underline text-white`}
                    href={href}
                  >
                    {title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 absolute inset-x-0 h-px w-full hidden md:block" />
        <div className="hidden md:flex max-w-6xl flex-col justify-between gap-2 pt-2 pb-5">
          <p className="text-gray-400 text-center font-thin">
            ©{" "}
            <a href="/" className="hover:text-primary-500">
              OatMeal
            </a>
            . All rights reserved {year} - Made with ❤️ by Udai
          </p>
        </div>
      </div>
    </footer>
  );
}
