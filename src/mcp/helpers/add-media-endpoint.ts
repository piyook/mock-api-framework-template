import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to add media to a specified directory in a local file system when supplied an image or video
const addMediaEndpoint = async (
	mediaName: string,
	type: 'videos' | 'images',
	fileType: 'png' | 'mp4',
	image: string, // This should be a base64 string or buffer
) => {
	if (!mediaName || !type || !fileType || !image) {
		return 'Media API Endpoint Not created. mediaName, type, fileType, and image are required to create a new API endpoint.';
	}

	// Create path to the endpoint directory
	const endpointDir = path.join(__dirname, '..', '..', 'resources', type);
	const apiPath = path.join(endpointDir, `${mediaName}.${fileType}`);

	if (fs.existsSync(apiPath)) {
		return `API Endpoint Not created. API endpoint ${mediaName}.${fileType} already exists.`;
	}

	try {
		// Create the endpoint directory first
		fs.mkdirSync(endpointDir, { recursive: true });

		// Handle image processing with sharp
		if (fileType === 'png' && type === 'images') {
			// Convert base64 to buffer if needed
			let imageBuffer: Buffer;
			if (typeof image === 'string' && image.startsWith('data:')) {
				// Handle data URL format
				const base64Data = image.split(',')[1];
				imageBuffer = Buffer.from(base64Data, 'base64');
			} else if (typeof image === 'string') {
				// Assume it's a base64 string
				imageBuffer = Buffer.from(image, 'base64');
			} else {
				throw new Error('Invalid image format');
			}

			// Use sharp to resize and save as PNG
			await sharp(imageBuffer).resize(1000, 1000).png().toFile(apiPath);
		} else if (fileType === 'mp4' && type === 'videos') {
			// For video files, just save the buffer directly
			// Note: Sharp doesn't handle video files, you'd need ffmpeg for video processing
			let videoBuffer: Buffer;
			if (typeof image === 'string' && image.startsWith('data:')) {
				const base64Data = image.split(',')[1];
				videoBuffer = Buffer.from(base64Data, 'base64');
			} else if (typeof image === 'string') {
				videoBuffer = Buffer.from(image, 'base64');
			} else {
				throw new Error('Invalid video format');
			}

			fs.writeFileSync(apiPath, videoBuffer);
		} else {
			throw new Error(`Unsupported combination: ${fileType} for ${type}`);
		}

		return `API Endpoint ${mediaName} created successfully at ${apiPath}.`;
	} catch (error) {
		return `Failed to create API endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`;
	}
};

export { addMediaEndpoint };
