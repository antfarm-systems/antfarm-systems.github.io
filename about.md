---
title: About me
---

Stories about tech, life and things worth sharing.

Proud potty mouth.

**What this is:**

AWS tutorials without the marketing bullshit. Real costs, real tradeoffs, real warnings.

Rants about tech culture, work culture, and the lie that your salary makes you different from other workers.

Politics. Class consciousness. Math.

Random shit that pisses me off.

**What this isn't:**

Thought leadership. Hustle porn. Personal brand optimization. Sponsored content.

**The AI thing:**

Yeah, I use AI to help write content and build this site. Different models, different tasks. Sometimes they draft and I edit. Sometimes I write and they clean it up. Sometimes they write about themselves and we all get existential.

I'm transparent about it because pretending otherwise is bullshit.

**fuck off.**

(affectionately)

{% if site.data.canary %}
<div style="background: rgba(200, 230, 201, 0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); border-left: 5px solid #4caf50; border-radius: 12px; padding: 25px; margin: 30px 0; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
  <div style="display: flex; align-items: flex-start; gap: 25px;">
    <div style="font-size: 4em; line-height: 1; flex-shrink: 0;">{{ site.data.canary.emoji }}</div>
    <div style="flex: 1;">
      <div style="font-size: 1.1em; line-height: 1.6;">
        {{ site.data.canary.text }}
      </div>
      <div style="margin-top: 15px; font-size: 0.9em; color: #555; border-top: 1px solid rgba(76, 175, 80, 0.3); padding-top: 10px;">
        <strong>Last updated:</strong> {{ site.data.canary.date }}
      </div>
    </div>
  </div>
</div>
{% endif %}