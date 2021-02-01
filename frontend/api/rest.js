import axios from 'axios';
import {BaseAPI} from './base';


export class RestAPI extends BaseAPI{
    
    setapp(url){
        this.app = url
    }

    list(page, size){
        return new Promise((resolve, reject)=>{
            const app = typeof page == 'number' && typeof size == 'number' ? this.app + `?page=${page}&size=${size}` : this.app;
            axios.get(app).then(res=>{
                resolve(res);
            }).catch(err=>{
                reject(err);
            });
        });
    }

    create(data){
        return axios.post(`${this.app}`, data);
    }

    retrieve(id){
        return axios.get(`${this.app}/${id}`);
    }

    update(id, data){
        return axios.patch(`${this.app}/${id}`, data);
    }

    delete(id){
        return axios.delete(`${this.app}/${id}`);
    }

    queryget(payload){
        return axios.get(`${this.app}?${payload}`);
    }
}