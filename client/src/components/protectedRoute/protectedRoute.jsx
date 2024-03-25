import { Outlet, Navigate } from 'react-router-dom'

export const ProtectedRoute = () => {
    const iscrsf=document.cookie.includes('csrftokenfromserver');
    const isSession=document.cookie.includes('LEETCODE_SESSION_fromserver');
    return(
        (iscrsf && isSession) ? <Outlet/> : <Navigate to="/login"/>
    )
}

