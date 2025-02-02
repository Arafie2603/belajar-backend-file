import { connect } from "http2";
import { prismaClient } from "../application/database";
import { minioClient, MINIO_ENDPOINT, MINIO_PORT } from "../helper/minioClient";
import { CreateSuratmasukRequest, SuratmasukResponseWithoutDispoisi } from "../model/suratmasukModel";
import { suratmasukValidation } from "../validation/suratmasukValidation";
import { Validation } from "../validation/validation";

export class suratmasukService {
    static async createSuratmasuk(
        request: CreateSuratmasukRequest,
        file: Express.Multer.File,
        userId: string
    ): Promise<SuratmasukResponseWithoutDispoisi> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId}
        });

        console.log("Original request : ", request);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }


        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal: typeof request.tanggal === 'string' 
                ? new Date(request.tanggal).toISOString()
                : new Date(JSON.stringify(request.tanggal)).toISOString(),
            expired_data: typeof request.expired_data === 'string'
                ? new Date(request.expired_data).toISOString()
                : new Date(JSON.stringify(request.expired_data)).toISOString()
        }

        console.log('modified request : ', modifiedRequest);
    
        const filename = `${Date.now()}-${file.originalname}`;
        const bucketName = 'suratmasuk';
        const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

        const requestWithFile = {
            ...modifiedRequest,
            scan_surat: fileUrl,
            user_id: userId 
        };
        const validationRequest = Validation.validate(
            suratmasukValidation.SuratmasukValidation,
            requestWithFile
        );

        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
        }

        await minioClient.putObject(bucketName, filename, file.buffer);


        const suratmasuk = await prismaClient.suratMasuk.create({
            data: {
                no_surat_masuk: validationRequest.no_surat_masuk,
                tanggal: validationRequest.tanggal,
                alamat: validationRequest.alamat,
                perihal: validationRequest.perihal,
                tujuan: validationRequest.tujuan,
                organisasi: validationRequest.organisasi,
                pengirim: validationRequest.pengirim,
                penerima: validationRequest.penerima,
                sifat_surat: validationRequest.sifat_surat,
                scan_surat: validationRequest.scan_surat,
                expired_data: validationRequest.expired_data,
                diteruskan_kepada: request.diteruskan_kepada,
                tanggal_penyelesaian: request.tanggal_penyelesaian,
                isi_disposisi: request.isi_disposisi,

                user: {
                    connect: {
                        id: validationRequest.user_id 
                    }
                },
            },
            include: {
                user: true, 
            }
        });

        return suratmasuk;
    }

static async updateSuratmasuk(
    nomor_surat_masuk: string,
    request: CreateSuratmasukRequest,
    file: Express.Multer.File | null,
    userId: string
): Promise<SuratmasukResponseWithoutDispoisi> {
    try {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const suratmasuk = await prismaClient.suratMasuk.findUnique({
            where: { no_surat_masuk: nomor_surat_masuk }
        });

        if (!suratmasuk) {
            throw new Error(`suratmasuk with ID ${nomor_surat_masuk} not found`);
        }

        // Modifikasi penanganan tanggal
        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal: request.tanggal ? new Date(request.tanggal) : undefined,
            expired_data: request.expired_data ? new Date(request.expired_data) : undefined
        };

        let fileUrl = suratmasuk.scan_surat;

        if (file) {
            const filename = `${Date.now()}-${file.originalname}`;
            const bucketName = 'suratmasuk';
            fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, 'us-east-1');
            }
            await minioClient.putObject(bucketName, filename, file.buffer);
        }

        console.log("Modified Request:", modifiedRequest); // Tambahkan log
        const { user_id, ...updateData } = modifiedRequest;

        const updateSuratmasuk = await prismaClient.suratMasuk.update({
            where: { no_surat_masuk: nomor_surat_masuk },
            data: {
                ...updateData,
                scan_surat: fileUrl,
                user: { connect: { id: userId } }
            },
        });

        return updateSuratmasuk;
    } catch (error) {
        console.error("Service Error:", error); // Tambahkan log error
        throw error;
    }
}

    static async deleteSuratmasuk(
        no_surat_masuk: string
    ): Promise<void> {
        const suratmasuk = await prismaClient.suratMasuk.findUnique({
            where: { no_surat_masuk: no_surat_masuk },
        });

        if (!suratmasuk) {
            throw new Error(`Surat masuk with ID ${no_surat_masuk} not found`);
        }

        await prismaClient.suratMasuk.delete({
            where: { no_surat_masuk: no_surat_masuk },
        });
    }
}
