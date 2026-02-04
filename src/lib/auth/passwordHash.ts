import argon2 from "argon2";

//密码学函数
const ARGON2_OPTIONS = {
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4,
  type: argon2.argon2id,
};

function getPasswordPepper() {
  const pepper = process.env.XRA_PASSWORD_PEPPER;
  if (pepper && pepper.length >= 32) return Buffer.from(pepper);
  return Buffer.from("default_dev_pepper_for_xra_project_32_chars"); // 提供默认值防止 undefined
}

export function hashPassword(password: string) {
  // 防止超长密码导致的 DoS 攻击
  if (password.length > 72) {
    throw new Error("静止乱输入而导致Dos攻击噢！");
  }

  return argon2.hash(password, {
    ...ARGON2_OPTIONS,
    secret: getPasswordPepper(),
  });
}

export async function verifyPassword(password: string, hash: string) {
  if (password.length > 72) return { isValid: false, needsRehash: false };

  try {
    const isValid = await argon2.verify(hash, password, {
      secret: getPasswordPepper(),
    });

    // 只有在密码有效的情况下，才检查是否需要重新哈希
    const needsRehash = isValid ? argon2.needsRehash(hash, ARGON2_OPTIONS) : false;

    return { isValid, needsRehash };
  } catch {
    return { isValid: false, needsRehash: false };
  }
}