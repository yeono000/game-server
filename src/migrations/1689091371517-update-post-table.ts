import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTable1689091371517 implements MigrationInterface {
    name = 'UpdatePostTable1689091371517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`game1\` ADD \`playerNum\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`game1\` DROP COLUMN \`playerNum\``);
    }

}
