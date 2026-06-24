import { compare, hash } from "bcryptjs";

if(!process.env.BCRYPT_SALT_ROUNDS) {
    throw new Error("BCRYPT_SALT_ROUNDS must be set");
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

export async function hashPassword(password: string) {
    return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
    return compare(password, passwordHash);
}
