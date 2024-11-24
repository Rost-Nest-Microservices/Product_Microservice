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
    const total = await this.product.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        currentPage: page,
        totalPages,
        total
      }
    };
  }

  findOne(id: string): Product {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { id: _, name, description, price } = updateProductDto;

    const product = this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found`);
    }
    //product.updateWith({ name, description, price });
    return; //product;
  }

  remove(id: string): Product {
    const product = this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    this.products = this.products.filter((p) => p.id != product.id);
    return product;
  }
}
