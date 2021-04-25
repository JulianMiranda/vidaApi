import {IsObject, IsString} from 'class-validator';
import {Document} from 'mongoose';
import {Image} from './image.dto';

export class Category extends Document {
	@IsString()
	name: string;

	@IsObject()
	image: Partial<Image>;
}
