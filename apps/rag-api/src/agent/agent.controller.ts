import { Body, Controller, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { AgentChatDto } from "./dto/agent-chat.dto";

@Controller("agent")
export class AgentController {
  constructor(private readonly agent: AgentService) {}

  /** Planner + optional KB tool (vector search) + answer */
  @Post("chat")
  async chat(@Body() dto: AgentChatDto) {
    return this.agent.chat(dto);
  }
}
