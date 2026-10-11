<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the five-slide registry and simulation state definitions in a browser-safe module so navigation and demonstration rules can be tested independently.
- Use one centered 1920×1080 ScaledSlide component across presentation and print contexts; shared slide tokens control all typography and colors.
- Keep presentation navigation in the slide search parameter with replacement navigation so links retain the current slide without filling browser history.
- Keep cinematic slide transitions in a browser-safe wrapper with inert outgoing content and cleaned-up timers so rapid navigation stays accessible and print remains static.
- Keep proposed financial values and their validation status in the browser-safe presentation module so estimates never imply verified business results.
