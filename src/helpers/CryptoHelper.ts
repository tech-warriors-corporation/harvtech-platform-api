import crypto from 'crypto'

import { env } from '~config/env'

export class CryptoHelper {
    private readonly ENCRYPT_ENCODING = 'base64'
    private readonly DECRYPT_ENCODING = 'utf8'

    encrypt(text: string): string {
        const chiper = crypto.createCipheriv(env.crypto.algorithm, env.crypto.key, env.crypto.iv)
        let encryptedText = chiper.update(text, this.DECRYPT_ENCODING, this.ENCRYPT_ENCODING)

        encryptedText += chiper.final(this.ENCRYPT_ENCODING)

        return encryptedText
    }

    decrypt(hash: string): string {
        const decipher = crypto.createDecipheriv(env.crypto.algorithm, env.crypto.key, env.crypto.iv)
        let decryptedText = decipher.update(hash, this.ENCRYPT_ENCODING, this.DECRYPT_ENCODING)

        decryptedText += decipher.final(this.DECRYPT_ENCODING)

        return decryptedText
    }
}
