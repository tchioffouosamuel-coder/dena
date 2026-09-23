import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Stockage local par défaut (simple, suffisant pour démarrer).
// En production avec plusieurs serveurs, remplacez ce service par une
// implémentation S3-compatible (ex: Cloudflare R2) : même interface,
// storeImage() retourne une URL publique au lieu d'un chemin local.
@Injectable()
export class MediaService {
  private uploadPath = process.env.MEDIA_LOCAL_PATH || './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadPath)) fs.mkdirSync(this.uploadPath, { recursive: true });
  }

  async storeImage(file: Express.Multer.File): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Le fichier doit être une image.');
    }
    const filename = `${randomUUID()}.webp`;
    const filepath = path.join(this.uploadPath, filename);

    // Redimensionne et convertit en WebP : réduit fortement le poids des
    // photos (important pour les clients avec une connexion limitée).
    await sharp(file.buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    return `/media/${filename}`;
  }
}
