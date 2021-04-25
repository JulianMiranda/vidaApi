import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	UsePipes,
} from '@nestjs/common';
import {Category} from 'src/dto/category.dto';
import {AuthenticationGuard} from 'src/guards/authentication.guard';
import {MongoQuery} from '../../dto/mongo-query.dto';
import {ENTITY} from '../../enums/entity.enum';
import {AcceptedProps} from '../../pipes/accepted-props.pipe';
import {RequiredProps} from '../../pipes/required-props.pipe';
import {TransformQuery} from '../../pipes/transform-query.pipe';
import {CategoryRepository} from './category.repository';

@Controller(ENTITY.CATEGORY)
@UseGuards(AuthenticationGuard)
export class CategoryController {
	constructor(private categoryRepository: CategoryRepository) {}

	@Post('/getList')
	@UsePipes(new TransformQuery())
	getList(@Body() query: MongoQuery): any {
		return this.categoryRepository.getList(query);
	}

	@Get('/getOne/:id')
	getOne(@Param('id') id: string): Promise<Category> {
		return this.categoryRepository.getOne(id);
	}

	@Post('/create')
	@UsePipes(new RequiredProps(ENTITY.CATEGORY))
	create(@Body() data: Category): Promise<boolean> {
		const {image} = data;
		delete data.image;
		return this.categoryRepository.create(data, image);
	}

	@Put('/update/:id')
	@UsePipes(new AcceptedProps(ENTITY.CATEGORY))
	update(
		@Param('id') id: string,
		@Body() data: Partial<Category>,
	): Promise<boolean> {
		const {image} = data;
		delete data.image;
		return this.categoryRepository.update(id, data, image);
	}

	@Delete('/delete/:id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.categoryRepository.delete(id);
	}
}
