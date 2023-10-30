import React from 'react'
import UserPanel from '../components/userPanel'
import OuterLayout from '../components/outerComponent'
import { requireUserId } from '../utils/auth.server'
import { getOtherUsers } from '../utils/user.server'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ request }) => {
    const res = await requireUserId(request)
    const users = await getOtherUsers();
    return users
}

export default function Home() {

    const users = useLoaderData()

    return (
        <OuterLayout>
            <div className=' flex '>
                <UserPanel users={users} />
            </div>
        </OuterLayout>
    )
}
