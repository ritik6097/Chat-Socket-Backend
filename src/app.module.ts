import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { gatewayModule } from './websocket/gateway.module';

@Module({
  imports: [UserModule ,gatewayModule ,  MongooseModule.forRoot( 'mongodb+srv://emmaro:1234@tutorial.klpqo.mongodb.net/combook?retryWrites=true&w=majority')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
