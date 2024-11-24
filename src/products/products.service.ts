import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as UuidV4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  private products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total = await this.product.count({ where: { available: true } });
    const totalPages = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        where: {
          available: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        currentPage: page,
        totalPages,
        total,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    //return this.product.delete({ where: { id }});
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
