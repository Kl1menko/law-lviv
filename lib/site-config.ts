export const siteConfig = {
  name: "Klimenko & CO",
  legalName: "Адвокатська контора Клименко & CO",
  description:
    "Юридична компанія у Львові з фокусом на сімейні, спадкові, цивільні та адміністративні справи.",
  domain: "https://example.com",
  locale: "uk_UA",
  city: "Львів",
  phone: "+380000000000",
  email: "office@example.com",
};

export const mainNav = [
  { href: "/", label: "Головна" },
  { href: "/pro-kompaniyu", label: "Про компанію" },
  { href: "/poslugy", label: "Послуги" },
  { href: "/blog", label: "Блог" },
  { href: "/faq", label: "Питання та відповіді" },
  { href: "/kontakty", label: "Контакти" },
] as const;
