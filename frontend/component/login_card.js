import React, {useRef, useState } from 'react';
import {useRouter} from 'next/router'

import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {LoadingOverlay} from './loading';

import {LoginAPI} from '../api/login';
import {isAllowed} from '../api/acess';


const DASHBOARD_URI = '/dashboard';


export function LoginCard(props){
    const router = useRouter();
    const notif = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [api, setAPI] = useState(undefined);

    const loginAction = e=>{
        e.preventDefault();
        api.login(username, password)
        .then(()=>{
            router.push(`${DASHBOARD_URI}`);
        })
        .catch(err=>{
            if(err.status == 429){
                let secs = parseInt(err.headers['retry-after']);
                secs = Math.ceil(secs/60);
                let message = `Too much attempt, please retry after ${secs} ${secs > 1 ? 'minutes' : 'minute'}.`;
                notif.current.show({severity:'error', summary:'Login Failed', detail: message});
            }else{
                notif.current.show({severity:'error', summary:'Login Failed', detail:'Username/password missmatch'});
            }
        });
    }

    if(api){
        return (
            <Card>
                <form onSubmit={e=> loginAction(e)}>
                    <div className='p-d-flex p-flex-column p-jc-center p-ai-center input-spacing'>
                        <span className='p-input-icon-right'>
                            <i className='pi pi-user'/>
                            <InputText value={username}
                                        placeholder='Username'
                                        onChange={e=> setUsername(e.target.value)}/>
                        </span>
                        <Password value={password}
                                    placeholder='Password'
                                    feedback={Boolean(0)}
                                    onChange={e=> setPassword(e.target.value)}
                                    toggleMask/>
                        <Button label='Login' type='submit'/>
                    </div>
                </form>
                <Toast ref={notif} />
            </Card>
        )
    }else{
        if(setTimeout && typeof window != 'undefined')
            setTimeout(()=>{
                isAllowed()
                .then(()=>{
                    router.push(DASHBOARD_URI);
                })
                .catch(()=>{
                    setAPI(new LoginAPI());
                });
            }, 1000);
        return <LoadingOverlay />;
    }
}