---
title: About the AntFarm
---

This is a blog about AWS, tech, work, class, my journey in art and life plus the bonus *whatever else I feel like yelling at the clouds about.* 

It's also a playground. I build dumb things here because browsers can do way more than people give them credit for. Some of it is useful. Some of it is just fun. Poke around. Highlight things. Sit still for a while. Read the source. The ants are always watching.

Some posts are [just a quote]({{ "/posts/nobody-is-special" | relative_url }}), set big in a beat-up typewriter font. That's part of my swipe file, Austin Kleon's term from *Steal Like an Artist* — lines I copied into a paper notebook because they hit me in some way. Some are attributed. Some say Unattributed because I wrote down the line and lost the source. If one of them is yours, tell me and I'll fix the credit.

I use AI to help write and build this site. Different models, different tasks. I don't hide it because [*that's dumb*]({{ "/posts/wise-words" | relative_url }}) and if you spend anytime with AI you can already tell what parts are AI. You may even be able to guess the model with high confidence.  The ones I wrote myself are signed with my name at the bottom of the post. Everything else is signed The AntFarm, and may or may not be AI. One tell is AI probably writes better, but I'm working on that.

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