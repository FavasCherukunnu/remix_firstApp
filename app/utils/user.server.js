import bcrypt from 'bcryptjs'
import { prisma } from './prisma.server'


export async function createUser(user) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })
    return { id: newUser.id, email: user.email }
}

export const getOtherUsers = async (userId) => {
    return prisma.user.findMany({
        where: {
            id: { not: userId },
        },
        orderBy: {
            firstName: 'asc',
        },
    })
}