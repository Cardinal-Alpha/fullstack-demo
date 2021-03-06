import axios from 'axios';


export class RestAPI{
    
    constructor(url){
        this.app = url
    }

    list(page, size){
        return new Promise((resolve, reject)=>{
            const app = typeof page == 'number' && typeof size == 'number' ? this.app + `?page=${page}&size=${size}` : this.app;
            axios.get(app).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err.response);
            });
        });
    }

    create(data){
        return new Promise((resolve, reject)=>{
                axios.post(`${this.app}`, data)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }

    retrieve(id){
        return new Promise((resolve, reject)=>{
                axios.get(`${this.app}/${id}`)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }

    update(id, data){
        return new Promise((resolve, reject)=>{
                axios.patch(`${this.app}/${id}`, data)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }

    delete(id){
        return new Promise((resolve, reject)=>{
                axios.delete(`${this.app}/${id}`)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }

    queryget(payload){
        return new Promise((resolve, reject)=>{
                axios.get(`${this.app}?${payload}`)
                .then(res=>{
                    resolve(res);
                }).catch(err=>{
                    reject(err.response);
                });
            });
    }
}