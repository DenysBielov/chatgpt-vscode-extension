import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { OpenAIModel, OpenAIModelID, OpenAIModels } from "./types/openai";
import { DEFAULT_SYSTEM_PROMPT } from "./utils/const";
import { Message } from "./types/message";
const { ReadableStream } = require('web-streams-polyfill');
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

export class OpenAiClient {
  private _configuration: Configuration;
  private _openai: OpenAIApi;
  private _models: OpenAIModel[];
  private _initialized: Boolean;

  constructor(apiKey?: string) {;
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      throw new MissingApiKeyError();
    }

    this._configuration = new Configuration({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    this._openai = new OpenAIApi(this._configuration);
  }

  async init() {
    if (this._initialized) {
      return true;
    }

    const modelsResponse = await this._openai.listModels();
    const models: OpenAIModel[] = modelsResponse.data.data.reduce((acceptedModels: OpenAIModel[], model: any) => {
      for (const [, value] of Object.entries(OpenAIModelID)) {
        if (value === model.id) {
          const acceptedModel: OpenAIModel = {
            id: model.id,
            name: OpenAIModels[value].name,
          };

          acceptedModels.push(acceptedModel);
          break;
        }
      }
      return acceptedModels;
    }, []);

    this._models = models;
    this._initialized = true;
  }

  /**
   * Send request to OpenAI API.
   * @param {string} prompt - The request promt.
   * @returns {string} - The answer from OpenAI API.
   * @throws {ClientNotInitializedError} - Throws an error when client is not initialized.
   */
  public async sendChatRequest(messages: Message[]): Promise<ReadableStream<any>> {
    this.checkClient();

    const mappedMessages = messages.map(message => ({ content: message.content, role: message.role }) as ChatCompletionRequestMessage);

    const response = await this._openai.createChatCompletion({
      model: this._models[0].id,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: DEFAULT_SYSTEM_PROMPT,
        },
        ...mappedMessages
      ],
      stream: true
    });

    const stream = new ReadableStream({
      async start(controller: any) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === 'event') {
            const data = event.data;

            if (data === '[DONE]') {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta.content;
              controller.enqueue(text);
            } catch (e) {
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of response.data as any) {
          parser.feed(chunk);
        }
      },
    });

    return stream;
  }

  private checkClient() {
    if (!this._openai) {
      throw new ClientNotInitializedError();
    }
  }
}

class MissingApiKeyError extends Error {
  message: string = "OpenAI API key is not specified.";
}

class ClientNotInitializedError extends Error { }