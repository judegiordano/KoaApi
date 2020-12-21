import {
	BaseEntity,
	Column,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from "typeorm";

@Index("PK_cace4a159ff9f2512dd42373760", ["id"], { unique: true })
@Index("UQ_4a257d2c9837248d70640b3e36e", ["email"], { unique: true })
@Entity("User", { schema: "dbo" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("nvarchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("nvarchar", { name: "password", length: 255 })
  password: string;

  @Column("datetime", { name: "created", nullable: true })
  created: Date | null;

  @Column("datetime", { name: "lastUpdated", nullable: true })
  lastUpdated: Date | null;

  @Column("bit", { name: "activated", nullable: true })
  activated: boolean | null;
}
