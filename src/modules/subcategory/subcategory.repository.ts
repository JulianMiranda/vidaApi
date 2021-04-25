import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Image} from '../../dto/image.dto';
import {MongoQuery} from '../../dto/mongo-query.dto';
import {Subcategory} from '../../dto/subcategory.dto';
import {ENTITY} from '../../enums/entity.enum';
import {ImageRepository} from '../image/image.repository';

@Injectable()
export class SubcategoryRepository {
	readonly type = ENTITY.SUBCATEGORY;

	constructor(
		@InjectModel('Subcategory') private subcategoryDb: Model<Subcategory>,
		private imageRepository: ImageRepository,
	) {}

	async getList(query: MongoQuery): Promise<any> {
		try {
			const {filter, projection, sort, limit, skip, page, population} = query;
			const [count, subcategories] = await Promise.all([
				this.subcategoryDb.countDocuments(filter),
				this.subcategoryDb
					.find(filter, projection)
					.sort(sort)
					.limit(limit)
					.skip(skip)
					.populate(population),
			]);
			const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
			return {count, page, totalPages, data: subcategories};
		} catch (e) {
			throw new InternalServerErrorException(
				'Filter subcategories Database error',
				e,
			);
		}
	}

	async getOne(id: string): Promise<Subcategory> {
		try {
			const document = await this.subcategoryDb.findOne({_id: id}).populate([
				{
					path: 'image',
					match: {status: true},
					select: {url: true},
				},
				{
					path: 'category',
					select: {name: true},
				},
			]);

			if (!document)
				throw new NotFoundException(`Could not find subcategory for id: ${id}`);

			return document;
		} catch (e) {
			if (e.status === 404) throw e;
			else
				throw new InternalServerErrorException(
					'findSubcategory Database error',
					e,
				);
		}
	}

	async create(data: Subcategory, image: Partial<Image>): Promise<boolean> {
		try {
			const newSubcategory = new this.subcategoryDb(data);
			const document = await newSubcategory.save();

			image.parentType = this.type;
			image.parentId = document._id;

			const imageModel = await this.imageRepository.insertImages([image]);

			return !!(await this.subcategoryDb.findOneAndUpdate(
				{_id: document._id},
				{image: imageModel[0]._id},
			));
		} catch (e) {
			throw new InternalServerErrorException(
				'createSubcategory Database error',
				e,
			);
		}
	}

	async update(
		id: string,
		data: Partial<Subcategory>,
		image: Partial<Image>,
	): Promise<boolean> {
		try {
			let newImage = {};
			if (image) {
				await this.imageRepository.deleteImagesByTypeAndId(this.type, id);

				image.parentType = this.type;
				image.parentId = id;
				const imageModel = await this.imageRepository.insertImages([image]);
				newImage = {image: imageModel[0]._id};
			}

			const document = await this.subcategoryDb.findOneAndUpdate(
				{_id: id},
				{...data, ...newImage},
			);

			if (!document)
				throw new NotFoundException(
					`Could not find subcategory to update for id: ${id}`,
				);

			return !!document;
		} catch (e) {
			if (e.status === 404) throw e;
			throw new InternalServerErrorException(
				'updateSubcategory Database error',
				e,
			);
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			const document = await this.subcategoryDb.findOneAndUpdate(
				{_id: id},
				{status: false},
			);

			if (!document)
				throw new NotFoundException(
					`Could not find subcategory to delete for id: ${id}`,
				);
			return !!document;
		} catch (e) {
			if (e.status === 404) throw e;
			throw new InternalServerErrorException(
				'deleteSubcategory Database error',
				e,
			);
		}
	}
}
