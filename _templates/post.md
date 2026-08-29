<%*
const raw = await tp.system.prompt("Post title") || "untitled";
const title = raw.replace(/"/g, '\\"');
const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const date = tp.date.now("YYYY-MM-DD");
await tp.file.rename(`${date}-${slug}`);
-%>
---
title: "<% title %>"
date: <% date %>
---


