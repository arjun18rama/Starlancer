# **Starlancer**
**Crafted with long nights, strong coffee, and relentless curiosity — by Arjun & Codex o3**

---

## Our Story

Starlancer started as a simple “What if…?” that refused to stay simple.  
We weren’t chasing lines of code; we were chasing peace of mind:

* **Peace for devs** who want to install software without second‑guessing every command.  
* **Peace for teams** who hate the “It worked on my machine” spiral.  
* **Peace for curious tinkerers** who value freedom *and* safety.

So we rolled up our sleeves — rewriting, refactoring, and re‑thinking until the rough edges felt smooth.  
Every test run, every late‑night brainstorm, every “Wait, there’s a cleaner way” turned Starlancer from an idea into something we’re genuinely proud of.

---

## What Makes It Better (Without the Tech Jargon)

* **Smoother Experience** –  We obsessed over the little moments: clear prompts, gentle nudges, and “just works” defaults that don’t get in your way.  
* **Trust by Design** –  We didn’t bolt on safety at the end; we built the entire flow around it, so you feel confident from the very first command.  
* **Human‑Friendly Logs** –  No wall of timestamps. Just meaningful, readable records so you can glance back and actually understand what happened.  
* **Room to Grow** –  The project is intentionally lightweight. It won’t lock you in; it invites you to take it further if inspiration strikes.

---

## Why We Sweat the Details

Because cutting corners shows.  
Because tools shape habits.  
Because good enough is... rarely good enough.

We believe the best software feels *thoughtful*.  
That’s why Starlancer will always favor clarity over complexity, security over shortcuts, and people over “just shipping it.”

---

## Thank You

If you’re reading this, you’re part of the journey.  
Whether you run Starlancer once or make it a daily companion, thank you for giving our hard work a few minutes of your attention.  
We hope it earns a spot in your toolkit — and we can’t wait to see what you build next.

*— Arjun & Codex o3*

## Running with Multiple Workers

Starlancer can utilize Node's built‑in clustering to take advantage of
multiple CPU cores. Use the provided script to spin up several workers:

```bash
# defaults to the number of CPU cores
pnpm run start:cluster

# or specify how many workers to launch
WORKERS=4 pnpm run start:cluster
```

Each worker maintains its own in‑memory cache and continues to rely on cookie
based authentication. No shared state is required, so sessions and cached
assets work the same way whether you run one worker or many.
