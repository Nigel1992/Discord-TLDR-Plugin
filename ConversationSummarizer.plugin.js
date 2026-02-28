/**
 * @name Discord TL;DR
 * @version 1.0.0
 * @description Upgraded to Qwen-2.5-72B for the best possible logic and grouping accuracy.
 * @author Nigel1992
 */

module.exports = class DiscordTLDR {
    constructor() {
        this.btnId = "discord-tldr-main";
        this.hfToken = "YOUR_HF_TOKEN_HERE"; // placeholder, replace with actual HF token
        this.model = "Qwen/Qwen2.5-72B-Instruct"; // Highest performing 2026 model
        this.selected = new Map();
        this.isSelecting = false;
        this.handle = (e) => this.onClick(e);
    }

    start() {
        this.draw();
        document.addEventListener("mousedown", this.handle, true);
        this.obs = new MutationObserver(() => this.draw());
        this.obs.observe(document.body, { childList: true, subtree: true });
        
        BdApi.DOM.addStyle("DiscordTLDRUI", `
            #discord-card {
                position: fixed; right: 25px; top: 100px; width: 350px; 
                background: #111214; border: 1px solid #5865f2; border-radius: 12px;
                padding: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.7); z-index: 10000;
                color: #dbdee1; font-family: 'gg sans', sans-serif;
            }
            .discord-header-title { font-weight: 800; color: #5865f2; font-size: 15px; margin-bottom: 12px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; text-transform: uppercase; letter-spacing: 0.5px; }
            .discord-user { color: #ffffff; font-weight: 700; display: block; margin-top: 12px; font-size: 14px; }
            .discord-text { font-size: 13px; line-height: 1.5; color: #b5bac1; margin-bottom: 4px; padding-left: 10px; border-left: 2px solid #333; }
            .discord-close { cursor: pointer; color: #ed4245; font-size: 12px; }
        `);
    }

    stop() {
        this.obs.disconnect();
        document.removeEventListener("mousedown", this.handle, true);
        BdApi.DOM.removeStyle("DiscordTLDRUI");
        if (document.getElementById(this.btnId)) document.getElementById(this.btnId).remove();
        if (document.getElementById("discord-card")) document.getElementById("discord-card").remove();
        this.clear();
    }

    getMsg(el) {
        const fiber = BdApi.ReactUtils.getInternalInstance(el.closest('[class*="message_"]'));
        let curr = fiber;
        while (curr) {
            if (curr.memoizedProps?.message) return curr.memoizedProps.message;
            curr = curr.return;
        }
        return null;
    }

    onClick(e) {
        if (!this.isSelecting) return;
        const msgEl = e.target.closest('[class*="message_"]');
        if (!msgEl) return;
        e.stopImmediatePropagation();
        e.preventDefault();

        const data = this.getMsg(msgEl);
        if (!data) return;

        if (this.selected.has(data.id)) {
            this.selected.delete(data.id);
            msgEl.style.boxShadow = "";
            msgEl.style.background = "";
        } else {
            const author = data.author.globalName || data.author.username;
            this.selected.set(data.id, { author, content: data.content });
            msgEl.style.boxShadow = "inset 5px 0 0 0 #5865f2";
            msgEl.style.background = "rgba(88, 101, 242, 0.1)";
        }
        this.update();
    }

    draw() {
        if (document.getElementById(this.btnId)) return;
        const bar = document.querySelector('[class*="scrollableContainer_"]');
        if (!bar) return;

        const btn = document.createElement('button');
        btn.id = this.btnId;
        btn.textContent = "⚡ TL;DR";
        Object.assign(btn.style, {
            position: 'absolute', top: '-38px', right: '10px', zIndex: '9999',
            background: '#5865f2', color: 'white', border: 'none', padding: '6px 15px',
            borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer'
        });

        btn.onclick = () => {
            if (!this.isSelecting) {
                this.isSelecting = true;
                btn.textContent = "🚀 SUMMARIZE (0)";
                btn.style.background = "#43b581";
            } else { this.run(); }
        };
        bar.appendChild(btn);
    }

    update() {
        const btn = document.getElementById(this.btnId);
        if (btn) btn.textContent = `🚀 SUMMARIZE (${this.selected.size})`;
    }

    clear() {
        document.querySelectorAll('[class*="message_"]').forEach(m => { m.style.boxShadow = ""; m.style.background = ""; });
    }

    async run() {
        if (this.selected.size === 0) return;
        const transcript = Array.from(this.selected.values()).map(m => `${m.author}: ${m.content}`).join("\n");
        const { HfInference } = await import("https://cdn.skypack.dev/@huggingface/inference");
        const client = new HfInference(this.hfToken);

        BdApi.UI.showToast("Qwen 72B Processing...");
        
        try {
            const res = await client.chatCompletion({
                model: this.model,
                messages: [
                    { 
                        role: "system", 
                        content: "Professional TL;DR. Group by user. Format exactly: Name: [Short one-sentence summary]. Keep it extremely brief. No conversational filler." 
                    }, 
                    { role: "user", content: transcript }
                ],
                temperature: 0.1
            });

            this.showUI(res.choices[0].message.content);
        } catch (e) { console.error(e); }

        this.selected.clear();
        this.isSelecting = false;
        this.clear();
        const btn = document.getElementById(this.btnId);
        if (btn) { btn.textContent = "⚡ TL;DR"; btn.style.background = "#5865f2"; }
    }

    showUI(text) {
        if (document.getElementById("discord-card")) document.getElementById("discord-card").remove();
        const card = document.createElement("div");
        card.id = "discord-card";
        
        let html = `<div class="discord-header-title"><span>Discord TL;DR</span><span class="discord-close" onclick="this.parentElement.parentElement.remove()">CLOSE [X]</span></div>`;
        
        text.split('\n').filter(l => l.includes(':')).forEach(line => {
            const splitIdx = line.indexOf(':');
            const name = line.substring(0, splitIdx).trim();
            const summary = line.substring(splitIdx + 1).trim();
            html += `<span class="discord-user">${name}</span><div class="discord-text">${summary}</div>`;
        });

        card.innerHTML = html;
        document.body.appendChild(card);
    }
};