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
import {Subcategory} from 'src/dto/subcategory.dto';
import {AuthenticationGuard} from 'src/guards/authentication.guard';
import {MongoQuery} from '../../dto/mongo-query.dto';
import {ENTITY} from '../../enums/entity.enum';
import {AcceptedProps} from '../../pipes/accepted-props.pipe';
import {RequiredProps} from '../../pipes/required-props.pipe';
import {TransformQuery} from '../../pipes/transform-query.pipe';
import {SubcategoryRepository} from './subcategory.repository';

@Controller(ENTITY.SUBCATEGORY)
export class SubcategoryController {
	constructor(private subcategoryRepository: SubcategoryRepository) {}

	@Post('/getList')
	@UsePipes(new TransformQuery())
	getList(@Body() query: MongoQuery): any {
		return this.subcategoryRepository.getList(query);
	}
	@UseGuards(AuthenticationGuard)
	@Get('/getOne/:id')
	getOne(@Param('id') id: string): Promise<Subcategory> {
		return this.subcategoryRepository.getOne(id);
	}
	@UseGuards(AuthenticationGuard)
	@Post('/create')
	@UsePipes(new RequiredProps(ENTITY.SUBCATEGORY))
	create(@Body() data: Subcategory): Promise<boolean> {
		const {image} = data;
		delete data.image;
		return this.subcategoryRepository.create(data, image);
	}
	@UseGuards(AuthenticationGuard)
	@Put('/update/:id')
	@UsePipes(new AcceptedProps(ENTITY.SUBCATEGORY))
	update(
		@Param('id') id: string,
		@Body() data: Partial<Subcategory>,
	): Promise<boolean> {
		const {image} = data;
		delete data.image;
		return this.subcategoryRepository.update(id, data, image);
	}
	@UseGuards(AuthenticationGuard)
	@Delete('/delete/:id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.subcategoryRepository.delete(id);
	}
}
