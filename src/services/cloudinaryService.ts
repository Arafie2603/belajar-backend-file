import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: 'dlnbhhzfi',
    api_key: '224935649152192',
    api_secret: 'AhV_qXHxd3W7Ipotpqfz7f8DHv8'
});

export async function uploadToCloud(
    file: Buffer,
    options: {
        folder?: string,
        resourceType?: 'image' | 'video' | 'raw'
    } = {}
) {
    const {
        folder = 'default',
        resourceType = 'auto'
    } = options;

    return new Promise<{
        url: string,
        publicId: string
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) {
                    console.error('Upload failed:', error);
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );

        uploadStream.end(file);
    });
}

export async function deleteFromCloud(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Delete failed:', error);
        throw error;
    }
}