import { redirect } from "@remix-run/node";
import { logout } from "../utils/auth.server"


export const action = async({request})=>{

    const res = await logout(request);
    return res

}

// export const loader = ()=>{
//     return redirect('/login')
// }