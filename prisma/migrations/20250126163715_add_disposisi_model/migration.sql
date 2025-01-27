/*
  Warnings:

  - Added the required column `disposisi_id` to the `SuratMasuk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SuratMasuk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suratmasuk` ADD COLUMN `disposisi_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Disposisi` (
    `id_disposisi` VARCHAR(191) NOT NULL,
    `tanggal_penyelesaian` DATETIME(3) NOT NULL,
    `isi_disposisi` VARCHAR(191) NOT NULL,
    `diteruskan_kepada` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_disposisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuratMasuk` ADD CONSTRAINT `SuratMasuk_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratMasuk` ADD CONSTRAINT `SuratMasuk_disposisi_id_fkey` FOREIGN KEY (`disposisi_id`) REFERENCES `Disposisi`(`id_disposisi`) ON DELETE CASCADE ON UPDATE CASCADE;
