import axios from 'axios';

//Base configuration
const API_LIST = {
    login: '/api/admin/login',
    logout: '/api/admin/logout'
}


//Extendable base API class, support login and logout only
export class LoginAPI{

    login(username, password){
        return new Promise((resolve, reject)=>{
            const loginData = {
                username: username,
                password: password
            };
            axios.post(`${API_LIST.login}`, loginData)
            .then(res=>{
                if(res.data.status == 'SUCCESS'){
                    resolve(res);
                }else{
                    reject(res);
                }
            }).catch(err=>{
                reject(err.response);
            });
        });
    }


    logout(){
        return new Promise((resolve, reject)=>{
                axios.get(`${API_LIST.logout}`)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }
}