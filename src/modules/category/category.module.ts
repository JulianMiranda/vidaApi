import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import CategorySchema from 'src/schemas/category.schema';
import {ImageModule} from '../image/image.module';
import {CategoryController} from './category.controller';
import {CategoryRepository} from './category.repository';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Category',
				schema: CategorySchema,
			},
		]),
		ImageModule,
	],
	providers: [CategoryRepository],
	controllers: [CategoryController],
})
export class CategoryModule {}
