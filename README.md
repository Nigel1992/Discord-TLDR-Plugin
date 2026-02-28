# Discord TL;DR 🚀

> ✨ A slick BetterDiscord plugin that turns long threads into instant summaries using the **Qwen‑2.5‑72B** model from HuggingFace.

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-BetterDiscord-purple)

---

## 📚 Table of Contents
- [Features](#features-)
- [Installation](#installation-)
- [Configuration](#configuration-)
- [Usage](#usage-)
- [TODO](#todo-)
- [Notes](#notes-)
- [License](#license-)

---

## Features ✨

- Select messages by clicking them (holds box highlight).
- Press the **⚡ TL;DR** button to generate a concise summary grouped by user.
- Results open in a floating card you can dismiss.
- Powered by HuggingFace Inference API (chat completion).
- Works on any OS: Windows, macOS, Linux.

## Installation 📦

> These steps work on **Windows, macOS, and Linux** — adjust the path to your BetterDiscord plugins folder accordingly.

1. Locate your BetterDiscord `plugins` directory. Common locations:
   - **Windows:** `%appdata%\\BetterDiscord\\plugins`
   - **macOS:** `~/Library/Application Support/BetterDiscord/plugins`
   - **Linux:** `~/.config/BetterDiscord/plugins`
2. Copy the `DiscordTLDR.plugin.js` file into that folder. In a terminal or shell:
   ```bash
   cp DiscordTLDR.plugin.js "<path-to-your-plugins-folder>"
   ```
   Or simply drag & drop the file using your file manager.
3. Open Discord, go to **User Settings → Plugins**, and toggle **Discord TL;DR** on.

## Configuration ⚙️

The plugin requires a HuggingFace access token to call the inference API.

1. Log in to [HuggingFace](https://huggingface.co) or create an account.
2. Visit your **Settings → Access Tokens** page.
3. Click **New Token**, give it a name (e.g. "Discord TLDR"), and set scope to `Read`.
4. Copy the generated token string.
5. Open `DiscordTLDR.plugin.js` and replace the placeholder:
   ```javascript
   this.hfToken = "YOUR_HF_TOKEN_HERE"; // placeholder, replace with actual HF token
   ```
   with your real token, e.g.:
   ```javascript
   this.hfToken = "hf_abc123...";
   ```

> **Keep your token secret!** Anyone with it can use your HuggingFace quota.

## Usage 🎯

- Click **⚡ TL;DR** above the chat pane to start selecting messages. Selected messages will get a highlight.
- When you're done selecting, click the button again to summarize.
- A card will appear with grouped, one-sentence summaries per user.
- Close the card with the `CLOSE [X]` link.

### 💡 Pro Tips
- You can change the summary prompt or model in the plugin code for custom results.
- Works best with English, but you can experiment with other languages.
- For large chats, select only the most relevant messages for best results.

## TODO 🗒️

- [ ] Add auto-update notification
- [ ] Support multi-language prompts
- [ ] Add theme customization options for the summary card
- [ ] Write unit tests for message selection logic
- [ ] Publish plugin to BetterDiscord library

## Notes 📝

- Model used: `Qwen/Qwen2.5-72B-Instruct` (high-performance, 2026-era model).
- Summary prompt is hardcoded to be professional and extremely brief.
- You can modify the prompt or model URL in the `run()` method.

## License 📄

Use/copy/modify freely. No warranty. Plugin distributed as-is.

---

*Created with ❤️ by **Nigel1992***