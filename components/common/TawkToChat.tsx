'use client';

import Script from 'next/script';

const TAWK_EMBED_SRC =
  'https://embed.tawk.to/6a2d47b0f63ede1c2d5d24fa/1jr0e03bp';

export default function TawkToChat() {
  return (
    <Script id="tawk-to-chat" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement('script'),
            s0 = document.getElementsByTagName('script')[0];
          s1.async = true;
          s1.src = '${TAWK_EMBED_SRC}';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
