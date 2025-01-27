/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `username`,
    ADD COLUMN `id_user` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- CreateTable
CREATE TABLE `SuratKeluar` (
    `no_surat_keluar` VARCHAR(191) NOT NULL,
    `tanggal_surat` DATETIME(3) NOT NULL,
    `tempat_surat` VARCHAR(100) NOT NULL,
    `lampiran` VARCHAR(100) NOT NULL,
    `isi_surat` VARCHAR(100) NOT NULL,
    `penerima` VARCHAR(100) NOT NULL,
    `pengirim` VARCHAR(100) NOT NULL,
    `jabatan_pengirim` VARCHAR(100) NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `keterangan_gambar` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `sifat_surat` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`no_surat_keluar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuratKeluar` ADD CONSTRAINT `SuratKeluar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
