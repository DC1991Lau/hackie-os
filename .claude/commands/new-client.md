---
description: Set up a new client folder from the template and register them in the pipeline.
---

Set up a new client in the workspace. The client name is: $ARGUMENTS

Steps:

1. Slugify the name — lowercase, kebab-case, no accents. Confirm the slug with Diogo before creating anything.
2. Copy `20-clients/_template/` to `20-clients/<slug>/`.
3. Fill in `20-clients/<slug>/context.md` with whatever is known. Ask Diogo for anything missing rather than inventing it — especially segment, contact, and which engine is active.
4. Add a row to `30-sales/pipeline.md`.
5. Report back with the path created and the fields still blank in `context.md`.

Do not create anything under `10-company/` — that folder is for Hackie as an entity, not for clients.
