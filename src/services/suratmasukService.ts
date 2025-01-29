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
        const modifiedRequest = {
            ...request,
            tanggal: new Date(JSON.parse(request.tanggal)).toISOString(),
            expired_data: new Date(JSON.parse(request.expired_data)).toISOString()
        };
    
        // Generate file URL before validation
        const filename = `${Date.now()}-${file.originalname}`;
        const bucketName = 'suratmasuk';
        const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

        // Add scan_surat to request before validation
        const requestWithFile = {
            ...modifiedRequest,
            scan_surat: fileUrl,
            user_id: userId 
        };
        // Validate the complete request
        const validationRequest = Validation.validate(
            suratmasukValidation.SuratmasukValidation,
            requestWithFile
        );

        // Upload file to MinIO
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
        }

        await minioClient.putObject(bucketName, filename, file.buffer);

        // Tentukan disposisi default jika disposisi_id tidak diberikan atau null
        const defaultDisposisiId = 'default_disposisi_id';
        const disposisiId = validationRequest.disposisi_id || defaultDisposisiId;

        // Create record in database with user connection
        const suratmasuk = await prismaClient.suratMasuk.create({
            data: {
                no_surat_masuk: validationRequest.no_surat_masuk,
                tanggal: new Date(validationRequest.tanggal),
                alamat: validationRequest.alamat,
                perihal: validationRequest.perihal,
                tujuan: validationRequest.tujuan,
                organisasi: validationRequest.organisasi,
                pengirim: validationRequest.pengirim,
                penerima: validationRequest.penerima,
                sifat_surat: validationRequest.sifat_surat,
                scan_surat: validationRequest.scan_surat,
                expired_data: new Date(validationRequest.expired_data),
                diteruskan_kepada: request.diteruskan_kepada || "",
                tanggal_penyelesaian: request.tanggal_penyelesaian || "",
                isi_disposisi: request.isi_disposisi || "",

                user: {
                    connect: {
                        id_user: validationRequest.user_id // assuming your user's unique identifier is 'id_user'
                    }
                },
            },
            include: {
                user: true, // if you want to include user details in the response
            }
        });

        return suratmasuk;
    }
}
