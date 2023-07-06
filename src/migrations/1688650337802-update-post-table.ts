import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTable1688650337802 implements MigrationInterface {
    name = 'UpdatePostTable1688650337802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL DEFAULT 'example@gmail.com', \`profileImage\` varchar(255) NULL, \`type\` varchar(255) NOT NULL DEFAULT 'user', \`createdAt\` datetime NULL, \`deletedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
