import TelegramBot, { TelegramExecutionContext } from '@codebam/cf-workers-telegram-bot';

export interface Env {
	SECRET_BOT_TOKEN: string;
	ALLOWED_USERS: string;
	SECRET_OPENAI_API_KEY: string;
}

async function getChatGPTResponse(message: string, apiKey: string): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
			messages: [{ role: 'user', content: message }],
		}),
	});

	if (!response.ok) {
		throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
	}

	interface OpenAIResponse {
		choices: { message: { content: string } }[];
	}

	const data: OpenAIResponse = await response.json();
	return data?.choices[0]?.message?.content || 'Sorry, I didn’t understand that.';
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const bot = new TelegramBot(env.SECRET_BOT_TOKEN);
		const allowedUsers = env.ALLOWED_USERS.split(',').map((id) => id.trim());
		await bot
			.on('message', async function (context: TelegramExecutionContext): Promise<Response> {
				const message = context.update?.message;
				if (message && message.from) {
					const userId = message.from.id.toString();

					if (allowedUsers.includes(userId)) {
						const userMessage = message.text;
						try {
							const chatGptResponse = await getChatGPTResponse(userMessage as string, env.SECRET_OPENAI_API_KEY);
							await context.reply(chatGptResponse);
						} catch (error) {
							console.error(error);
							await context.reply('Error processing your request.');
						}
					}
				}
				return new Response('ok');
			})
			.handle(request.clone());

		return new Response('ok');
	},
};
