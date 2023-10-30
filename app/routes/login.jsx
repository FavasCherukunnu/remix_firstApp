import React, { useEffect, useState } from 'react'
import OuterLayout from '../components/outerComponent'
import DefInput from '../components/defInput'
import PrimaryBtn from '../components/buttons/button'
import { Form, Link, useActionData } from '@remix-run/react';
import {getUser, login} from '../utils/auth.server'
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
        password:formData.get('password')
    }
    const res = await login(user);

    return res
}

export default function Login() {

    const actionData = useActionData();
    const [error,setError] = useState({})
    const [data, setData] = useState({
        'email': '',
        'password': ''
    });
    // const error = actionData?.error;

    useEffect(
        ()=>{
            console.log('you submitted the form')
            setError(
                actionData?.error||{}
            )
        },
        [actionData]
    )


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

    return (
        <OuterLayout className=' flex flex-col items-center justify-center'>
            <div className={` bg-stone-200 border rounded-lg  px-7 py-3 min-w-[300px] ${error?.message?'shadow-2xl shadow-red-500':'shadow'}`}>
                <h1 className=' text-center font-bold pb-3 text-xl'>LOGIN</h1>
                <p className=' text-red-500 font-bold text-center max-w-[200px] mx-auto'>{error?.message}</p>
                <Form method='post'>
                    <DefInput err={error?.email} title={'email'} name={'email'} value={data.email} onChange={onChangeInput} />
                    <DefInput title={'Password'} name={'password'} value={data.password} onChange={onChangeInput} />
                    <div className=' flex flex-row justify-between w-full pt-4 py-2'>
                        <div className=' flex flex-col items-end gap-0'>
                            <p className=' text-blue-500 font-semibold text-sm'>No account yet?</p>
                            <Link to={'/signup'} className=' text-blue-700 font-semibold text-sm underline cursor-pointer transition-transform duration-75 hover:scale-105 mt-[-5px]'>Sign Up</Link>
                        </div>
                        <PrimaryBtn text={'Login'} />
                    </div>
                </Form>
            </div>
        </OuterLayout>
    )
}
