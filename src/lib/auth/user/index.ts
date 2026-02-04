import prisma from "@/lib/prisma";

export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: { username },
    });
}

export async function getUserById(id: number | string) {
    return prisma.user.findUnique({
        where: { id: Number(id) },
    });
}

export async function createUser(username: string, passwordHash: string) {
    return prisma.user.create({
        data: { username, passwordHash },
    });
}

export async function updateUser(id: number, data: { passwordHash?: string }) {
    return prisma.user.update({
        where: { id },
        data,
    });
}

export async function deleteUser(id: number) {
    return prisma.user.delete({
        where: { id },
    });
}
