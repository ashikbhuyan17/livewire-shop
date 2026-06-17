/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    document.body.appendChild(script);

    // 🔥 Nuclear option: continuously destroy Google UI
    const killGoogleBar = () => {
      const selectors = [
        ".goog-te-banner-frame",
        ".goog-te-banner",
        "#goog-gt-tt",
        ".goog-te-balloon-frame",
      ];

      selectors.forEach((s) => {
        document.querySelectorAll(s).forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      });

      document.documentElement.style.top = "0px";
      document.body.style.top = "0px";
      document.body.style.marginTop = "0px";
    };

    killGoogleBar();

    const observer = new MutationObserver(killGoogleBar);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}
