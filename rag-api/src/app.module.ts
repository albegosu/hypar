import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';
import { SearchModule } from './search/search.module';
import { AgentModule } from './agent/agent.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocumentsModule,
    SearchModule,
    AgentModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
