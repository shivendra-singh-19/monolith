import bcrypt from 'bcrypt';

export class UserUtils {
  /**
   * Encrypt a text with a saltround 10
   * @param text
   * @returns
   */
  static async encryptPlainText(text: string) {
    const hashedText = bcrypt.hash(text, 10);
    return hashedText;
  }
}
