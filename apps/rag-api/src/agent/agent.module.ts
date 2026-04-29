import { Module } from "@nestjs/common";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { SearchModule } from "../search/search.module";
import { DocumentsModule } from "../documents/documents.module";

@Module({
  imports: [SearchModule, DocumentsModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
