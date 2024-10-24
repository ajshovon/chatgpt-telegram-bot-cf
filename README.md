# ChatGPT Telegram Bot on Cloudflare Worker

A simple ChatGPT bot running on cloudflare worker

## How to Setup

- Create a Telegram bot with BotFather

- Clone this repo and navigate to it

- Run `npx wrangler login`

- `npx wrangler secret put SECRET_BOT_TOKEN`, set it to your telegram bot token that you got from @BotFather

- `npx wrangler secret put SECRET_OPENAI_API_KEY`, set it to your OpenAI api token

- Edit `wrangler.toml`, in `ALLOWED_USERS` put user id allowed to use the bot like this ALLOWED_USERS = "exampleId1,exampleId2"

- Run `npx wrangler deploy`

- Open this url in your browser to set your webhook `https://your-worker.username.workers.dev/SECRET_TELEGRAM_API_TOKEN?command=set`
