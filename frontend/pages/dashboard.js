import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Head from 'next/head';
import { useRouter } from 'next/router'; 
import { LoginAPI } from '../api/login';
import { isAllowed } from '../api/acess';
import { LoadingOverlay } from '../component/loading';
import {ContactsTable} from '../dataview/contacts';


const LOGIN_URI = '/';


export default function Page(props){
  const router = useRouter();
  const menu = [
      {label: 'Contact', url: '#/'},
      {label: 'User', url: '#/user'}
  ];
  const [api, setAPI] = useState(null);

  if(api){
    const logoutButton = <Button label="Logout" icon="pi pi-power-off" onClick={()=>{
      api.logout().then(()=> router.push(LOGIN_URI));
    }}/>;

    return (
          <div className="full-viewport">
            <Head>
              <title>Dashboard</title>
            </Head>
            <Menubar style={{width:'100%'}} model={menu} start={<div style={{width:'50px'}}></div>} end={logoutButton}/>
            <div className='content-row p-d-flex p-flex-column p-ai-center'>
                <HashRouter basename="/" >
                  <Switch>
                    <Route exact path='/'>
                      <ContactsTable />
                    </Route>
                    <Route exact path='/user'>
                      <h7>Under Construction</h7>
                    </Route>
                  </Switch>
                </HashRouter>
            </div>
          </div>
      );
  }else{
    if(typeof window != 'undefined')
      isAllowed()
      .then(()=> setTimeout(()=> setAPI(new LoginAPI()), 1000) )
      .catch(()=> router.push(LOGIN_URI));
    return <LoadingOverlay />;
  }
}
