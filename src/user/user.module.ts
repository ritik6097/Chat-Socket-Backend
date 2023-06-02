import { Module } from '@nestjs/common';
import { ClientController } from './user.controller';
import { ClientService } from './user.services';
import { MongooseModule } from '@nestjs/mongoose';
import { clientSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'client', schema: clientSchema }])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class UserModule {}
