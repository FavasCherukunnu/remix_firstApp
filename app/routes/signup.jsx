import React, { useEffect, useState } from 'react'
import OuterLayout from '../components/outerComponent'
import DefInput from '../components/defInput'
import PrimaryBtn from '../components/buttons/button'
import { Form, Link, useActionData } from '@remix-run/react';
import {getUser, registerUser} from '../utils/auth.server'
import { redirect } from '@remix-run/node';

export const loader = async({request})=>{

    const user = await getUser(request);
    if(user===null){
        return null
    }
    return redirect('/')

}
export const action = async ({request})=>{
    const formData = await request.formData();

    const user = {
        email:formData.get('email'),
        password:formData.get('password'),
        firstName:formData.get('firstName'),
        lastName:formData.get('lastName'),
    }

    const res = await registerUser(user)
    


    return res
}

export default function Login() {

    const actionData = useActionData();
    const [data, setData] = useState({
        'email': '',
        'password': '',
        'firstName':'',
        'lastName':''
    });
    const [error,setError] = useState({})

    function onChangeInput(event) {
        const name = event.target.name;
        setData(
            {
                ...data,
                [name]: event.target.value
            }
        )
        setError(
            {
                ...error,
                message:null,
                [name]:null
            }
        )
    }
    useEffect(
        ()=>{
            console.log('you submitted the form')
            setError(
                actionData?.error||{}
            )
        },
        [actionData]
    )

    return (
        <OuterLayout className=' flex flex-col items-center justify-center'>
            <div className={` bg-stone-200 border rounded-lg  px-7 py-3 min-w-[300px] ${error?.message?'shadow-2xl shadow-red-500':'shadow'}`}>
                <h1 className=' text-center font-bold pb-3 text-xl'>SIGNUP</h1>
                <p className=' text-red-500 font-bold text-center max-w-[200px] mx-auto'>{error?.message}</p>
                <Form method='post'>
                    <DefInput err={error?.email} title={'Email'} name={'email'} value={data.email} onChange={onChangeInput} />
                    <DefInput err={error?.firstName} title={'First Name'} name={'firstName'} value={data.firstName} onChange={onChangeInput} />
                    <DefInput err={error?.lastName} title={'Last Name'} name={'lastName'} value={data.lastName} onChange={onChangeInput} />
                    <DefInput err={error?.password} title={'Password'} name={'password'} value={data.password} onChange={onChangeInput} />
                    <div className=' flex flex-row justify-between w-full pt-4 py-2'>
                        <div className=' flex flex-col items-end gap-0'>
                            <p className=' text-blue-500 font-semibold text-sm'>Already User?</p>
                            <Link to={'/login'} className=' text-blue-700 font-semibold text-sm underline cursor-pointer transition-transform duration-75 hover:scale-105 mt-[-5px]'>Sign In</Link>
                        </div>
                        <PrimaryBtn text={'SignUp'} />
                    </div>
                </Form>
            </div>
        </OuterLayout>
    )
}
