import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import { prisma } from './prisma.server'
import { createUser } from './user.server'
import { validateEmail, validatePassword, validateName } from './validation.server'
import bcrypt from 'bcryptjs'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
    cookie: {
        name: 'kudos-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
})

export async function createUserSession(userId, redirectTo) {
    const session = await storage.getSession()
    session.set('userId', userId)
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    })
}

function getUserSession(request) {
    return storage.getSession(request.headers.get('Cookie'))
}
async function getUserId(request) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') return null
    return userId
}
export async function getUser(request) {
    const userId = await getUserId(request)
    if (typeof userId !== 'string') {
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })
        return user
    } catch {
        throw logout(request)
    }
}

export async function logout(request) {
    const session = await getUserSession(request)
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    })
}

export async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') {
      const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
      throw redirect(`/login?${searchParams}`)
    }
    return userId
  }

export async function registerUser(user) {

    const error = {
        email: validateEmail(user.email),
        password: validatePassword(user.password),
        firstName: validateName(user.firstName),
        lastName: validateName(user.lastName)
    }

    if (Object.values(error).some(Boolean)) {
        return json({ error }, { status: 400 })
    }

    const exists = await prisma.user.count({ where: { email: user.email } })
    if (exists) {
        return json({ error: { message: `User already exists with that email` } }, { status: 400 })
    }
    const newUser = await createUser(user)
    if (!newUser) {
        return json(
            {
                error: { message: `Something went wrong trying to create a new user.` },
            },
            { status: 400 },
        )
    }

    return redirect('/')

}

export async function login({ email, password }) {

    const error = {
        email: validateEmail(email),
    }

    if (Object.values(error).some(Boolean)) {
        return json({ error }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({ error: { message: `Incorrect login` } }, { status: 400 });
    }

    return createUserSession(user.id, '/')

}