import axios from 'axios';

//Base configuration
const API_LIST = {
    login: '/api/admin/login',
    logout: '/api/admin/logout'
}


//Extendable base API class, support login and logout only
export class BaseAPI{
    constructor(onCreated, onFailed, app){
        const accessAPI = app ? `/api/myaccess?app=${app}` : "/api/myaccess";
        axios.get(accessAPI)
        .then(res=>{
            if(res.data.length > 0){
                let perms = {}
                res.data.forEach(perm=>{
                    let sp = perm.codename.split('_');
                    perms[sp[0]] = true;
                });
                if(onCreated) onCreated(perms);
            }else{
                if(onFailed) onFailed();
            }
        })
        .catch(err=>{
            if(onFailed) onFailed();
        });
    }

    login(username, password){
        return new Promise((resolve, reject)=>{
            const loginData = {
                username: username,
                password: password
            };
            axios.post(`${API_LIST.login}`, loginData)
            .then(res=>{
                if(res.data.status == 'SUCCESS'){
                    resolve(res.data.status);
                }else{
                    reject(res.data.status);
                }
            }).catch(err=>{
                reject(err);
            });
        });
    }


    logout(){
        return axios.get(`${API_LIST.logout}`)
    }
}