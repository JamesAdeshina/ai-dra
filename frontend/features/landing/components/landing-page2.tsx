"use client";

import { FormEvent, useEffect, useRef } from "react";
import { ecosystemData, type EcosystemView } from "../data/ecosystem-data";
import { landingMarkup } from "../data/landing-markup";

const ACCESS_EMAIL = "info@jamesadeshina.com";

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const header = root.querySelector<HTMLElement>("#siteHeader");
    const menuButton = root.querySelector<HTMLButtonElement>("#menuButton");
    const navLinks = root.querySelector<HTMLElement>("#navLinks");

    const setHeaderState = () => header?.classList.toggle("aidra-scrolled", window.scrollY > 18);
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    const closeMenu = () => {
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      navLinks?.classList.remove("aidra-mobile-open");
      document.body.classList.remove("aidra-nav-open");
    };

    const toggleMenu = () => {
      if (!menuButton || !navLinks) return;
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      navLinks.classList.toggle("aidra-mobile-open", !open);
      document.body.classList.toggle("aidra-nav-open", !open);
    };

    menuButton?.addEventListener("click", toggleMenu);
    const navAnchors = Array.from(navLinks?.querySelectorAll("a") ?? []);
    navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(".aidra-ecosystem-tab"));
    const panel = root.querySelector<HTMLElement>("#ecosystemPanel");
    const title = root.querySelector<HTMLElement>("#ecosystemTitle");
    const description = root.querySelector<HTMLElement>("#ecosystemDescription");
    const list = root.querySelector<HTMLElement>("#ecosystemList");
    const avatar = root.querySelector<HTMLImageElement>("#visualAvatarImage");
    const name = root.querySelector<HTMLElement>("#visualName");
    const role = root.querySelector<HTMLElement>("#visualRole");
    const status = root.querySelector<HTMLElement>("#visualStatus");
    const cards = root.querySelector<HTMLElement>("#visualCards");

    const selectTab = (tab: HTMLButtonElement) => {
      const view = tab.dataset.view as EcosystemView | undefined;
      if (!view || !(view in ecosystemData)) return;
      const data = ecosystemData[view];

      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panel?.setAttribute("aria-labelledby", tab.id);
      if (title) title.textContent = data.title;
      if (description) description.textContent = data.description;
      if (list) list.innerHTML = data.items.map((item) => `<li>${item}</li>`).join("");
      if (avatar) { avatar.src = data.image; avatar.alt = data.imageAlt; }
      if (name) name.textContent = data.name;
      if (role) role.textContent = data.role;
      if (status) status.textContent = data.status;
      if (cards) cards.innerHTML = data.cards;
    };

    const tabHandlers = tabs.map((tab) => {
      const handler = () => selectTab(tab);
      tab.addEventListener("click", handler);
      return { tab, handler };
    });

    const revealItems = root.querySelectorAll<HTMLElement>(".aidra-reveal:not(.aidra-visible)");
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aidra-visible");
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
      revealItems.forEach((item) => observer?.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("aidra-visible"));
    }

    return () => {
      window.removeEventListener("scroll", setHeaderState);
      menuButton?.removeEventListener("click", toggleMenu);
      navAnchors.forEach((link) => link.removeEventListener("click", closeMenu));
      tabHandlers.forEach(({ tab, handler }) => tab.removeEventListener("click", handler));
      observer?.disconnect();
      document.body.classList.remove("aidra-nav-open");
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    const form = (event.target as HTMLElement).closest("form");
    if (!form || form.id !== "accessForm") return;
    event.preventDefault();
    const input = form.querySelector<HTMLInputElement>("#accessEmail");
    const visitorEmail = input?.value.trim() ?? "";
    const subject = encodeURIComponent("AI-DRA access request");
    const body = encodeURIComponent(`Hello AI-DRA team,

I would like to request access to the AI-DRA research prototype.

My email: ${visitorEmail}

Thank you.`);
    window.location.href = `mailto:${ACCESS_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      ref={rootRef}
      className="aidra-page"
      onSubmit={handleSubmit}
      dangerouslySetInnerHTML={{ __html: landingMarkup }}
    />
  );
}
