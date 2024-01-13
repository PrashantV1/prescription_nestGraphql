import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrescriptionModule } from './prescription/prescription.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth } from './middleware/auth.middleWare';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.db),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    PrescriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Auth).forRoutes('graphql');
  }
}
