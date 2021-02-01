import React, { Component, createRef } from 'react';
import {useRouter} from 'next/router'

import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {LoadingOverlay} from './loading';

import {BaseAPI} from '../api/base'

const DASHBOARD_URI = '/dashboard';

class _LoginCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.failToast = createRef();
        this.api = undefined;
    }
    
    submitLogin(event){
        event.preventDefault();
        this.api.login(this.state.username, this.state.password)
        .then(()=>{
            this.props.router.push(`${DASHBOARD_URI}`);
        })
        .catch(()=>{
            this.failToast.current.show({severity:'error', summary:'Login Failed', detail:'Username/password missmatch'});
        });
    }


    render(){
        if(this.api){
            return (
                <Card>
                    <form onSubmit={(e)=>{this.submitLogin(e)}}>
                        <div className='p-d-flex p-flex-column p-jc-center p-ai-center input-spacing'>
                            <span className='p-input-icon-right'>
                                <i className='pi pi-user'/>
                                <InputText value={this.state.username} onChange={e=>{this.setState({username:e.target.value})}}/>
                            </span>
                            <span className='p-input-icon-right'>
                                <i className='pi pi-lock'/>
                                <Password value={this.state.password} feedback={Boolean(0)} onChange={e=>{this.setState({password:e.target.value})}}/>
                            </span>
                            <Button label='Login' type='submit'/>
                        </div>
                    </form>
                    <Toast ref={this.failToast} />
                </Card>
            )
        }else{
            const refresh = ()=>{
                if(setTimeout)
                setTimeout(()=>{
                    this.forceUpdate();
                }, 1000);
            }
            const redirect = ()=>{
                if(typeof window != 'undefined')
                    this.props.router.push(`${DASHBOARD_URI}`);
            }
            this.api = new BaseAPI(redirect, refresh);
            return <LoadingOverlay />;
        }
    }
}


export function LoginCard(){
    const router = useRouter();
    return (
        <_LoginCard router={router}/>
    )
}