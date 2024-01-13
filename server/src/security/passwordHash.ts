import * as bcrypt from 'bcrypt';


export class PasswordHash {

    /**
     * @param plainPassword Plain password
     * @returns Returns hashed password
     */
    public static async hashPassword(plainPassword: string): Promise<string> {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(plainPassword, salt);
        return hashedPassword;
    }

    public static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compareSync(plainPassword, hashedPassword);
        return isMatch;
    }
}