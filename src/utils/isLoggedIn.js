import axiosInstance from "./axios"

const   isLoggedIn = ()=>{
   const token =  localStorage.getItem('token')
   if(token){
        axiosInstance.get('/auth/ptofile')
        .then(res=>{
            if(res){
                console.log('logged in')
            }
        }).catch((err)=>{
            console.log('not logged in',err)
        })
   }else{
    console.log('No Token')
   }
}

export default isLoggedIn