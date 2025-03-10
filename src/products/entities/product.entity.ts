import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId: number;

  @Column({
    name: 'external_id',
    unique: true,
  })
  extrernalId: string;

  @Column()
  @Index()
  sku: string;

  @Column()
  @Index()
  name: string;

  @Column()
  @Index()
  brand: string;

  @Column()
  @Index()
  model: string;

  @Column()
  @Index()
  category: string;

  @Column()
  @Index()
  color: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  @Index()
  price: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @Column({
    name: 'is_visible',
    type: 'bool',
    default: true,
  })
  isVisible: boolean;

  @Column({
    name: 'external_created_at',
    type: 'timestamp with time zone',
  })
  externalCreatedAt: Date;

  @Column({
    name: 'external_updated_at',
    type: 'timestamp with time zone',
  })
  externalUpdatedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
