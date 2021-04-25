import * as mongoose from 'mongoose';
import {schemaOptions} from '../utils/index';

const CategorySchema = new mongoose.Schema(
	{
		name: String,
		image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
		status: {type: Boolean, default: true, index: true},
	},
	{...schemaOptions},
);

export default CategorySchema;
