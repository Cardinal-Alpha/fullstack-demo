import axios from 'axios';


export const PERMISSIONS = {
    view_contact:[
        'contacts.view_contact'
    ],
    add_contact: [
        'contacts.add_contact'
    ],
    delete_contact: [
        'contacts.delete_contact'
    ],
    update_contact: [
        'contacts.update_contact'
    ]
};


export const isAllowed = (permission)=>{
    return new Promise((resolve, reject)=>{
        let query = '';
        if (permission && PERMISSIONS[permission]){
            const app = PERMISSIONS[permission][0].split(".")[0]
            const pQ = PERMISSIONS[permission].map(p=>{
                return p.split(".")[1];
            });
            query = `?app=${app}&perm=${pQ.join(',')}`;
        }
        axios.get('/api/myaccess' + query)
        .then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err.response);
        });
    });
}