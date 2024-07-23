import React, { useEffect } from "react";

const InjectScript = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.innerHTML = `
            (function(s,t,a,n) {
                s[t] || (s[t] = a, n = s[a] = function() { n.q.push(arguments); }, n.q = [], n.v = 2, n.l = 1 * new Date())
            })(window, "InstanaEumObject", "ineum");
            ineum('reportingUrl', 'https://instana-nonprod.kotaksecurities.online/eum/');
            ineum('key', 'P-olAJE4Q3qXKxTL8nsTng');
            ineum('trackSessions');
            ineum('allowedOrigins', [
                /.*api\\.kotaksecurities\\.online.*/i,
                /.*api\\.kotaksecurities\\.com.*/i,
                /.*hsi\\.kotaksecurities\\.online.*/i,
                /.*hsi\\.kotaksecurities\\.com.*/i,
                /.*mksapi\\.kotaksecurities\\.com.*/i
            ]);
        `;
        document.head.appendChild(script);

        const externalScript = document.createElement("script");
        externalScript.src =
            "https://instana-nonprod.kotaksecurities.online/eum/eum.min.js";
        externalScript.defer = true;
        externalScript.crossOrigin = "anonymous";
        document.head.appendChild(externalScript);
    }, []);

    return null;
};

export default InjectScript;

// {
//     <script>
//   (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
//   n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");

//   ineum('reportingUrl', 'https://instana-nonprod.kotaksecurities.online/eum/');
//   ineum('key', 'P-olAJE4Q3qXKxTL8nsTng');
//   ineum('trackSessions');
//   ineum('allowedOrigins', [/.*api\.kotaksecurities\.online.*/i, /.*api\.kotaksecurities\.com.*/i, /.*hsi\.kotaksecurities\.online.*/i, /.*hsi\.kotaksecurities\.com.*/i, /.*mksapi\.kotaksecurities\.com.*/i]);
// </script>
// <script defer crossorigin="anonymous" src="https://instana-nonprod.kotaksecurities.online/eum/eum.min.js"></script>

// }
