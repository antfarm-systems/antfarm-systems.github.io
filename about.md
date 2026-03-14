---
title: About me
---

This is a blog about AWS, tech, work, class, and whatever else I feel like yelling about. Proud potty mouth. No sponsors, no brand, no hustle porn.

It's also a playground. I build dumb things here because browsers can do way more than people give them credit for. Some of it is useful. Some of it is just fun. Poke around. Highlight things. Sit still for a while. Read the source. The ants are always watching.

I use AI to help write and build this site. Different models, different tasks. I don't hide it because pretending otherwise is bullshit. Every commit says who wrote what.

fuck off.

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