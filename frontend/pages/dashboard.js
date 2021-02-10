import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Head from 'next/head';
import { useRouter } from 'next/router'; 
import { RestAPI } from '../api/rest';
import { LoadingOverlay } from '../component/loading';
import {ContactsTable} from '../dataview/contacts';

const LOGIN_URI = '/';

class _DashboardLayout extends Component {

    constructor(props) {
        super(props);
        this.api = undefined;      
        this.menu=[
            {label: 'Contact', url: '#/'},
            {label: 'User', url: '#/user'}
        ];
    }

    render() {
      const redirect = ()=>{
        if(typeof window != 'undefined')
          this.props.router.push(`${LOGIN_URI}`);
      }

      if(this.api){

        const logoutButton = <Button label="Logout" icon="pi pi-power-off" onClick={()=>{
          this.api.logout().then(redirect.bind(this));
        }}/>;

        return (
            <div className="full-viewport">
              <Head>
                <title>Dashboard</title>
              </Head>
              <Menubar style={{width:'100%'}} model={this.menu} start={<div style={{width:'50px'}}></div>} end={logoutButton}/>
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
        const refresh = ()=>{
          if(setTimeout)
              setTimeout(()=>{
                  this.forceUpdate();
              }, 1000);
        }
        this.api = new RestAPI(refresh, redirect);
        return <LoadingOverlay />;
      }
    }
}



export default function Page(props){
  const router = useRouter();
  return(
    <_DashboardLayout {...props} router={router}/>
  )
}
