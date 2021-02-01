import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {confirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';

import React, {Component} from 'react'
import {ContactForm} from './contactform';
import {RestAPI} from '../api/rest';

const API_URL = '/api/contact';


export class ContactsTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            contacts:[],
            index: 0,
            loading: true,
            permission:{
                view: false,
                change: false,
                add: false,
                delete: false
            },
            search: "",
            rows: 10,
            total: 0
        };
        this.api = new RestAPI((perms)=>{
            this.setState({permission:perms});
        }, undefined, 'contact');
        this.api.setapp(API_URL);
    }


    componentDidMount(){
        this.setPage({
            first:this.state.index,
            rows: this.state.rows
        });
    }


    setPage(e){
        this.setState({loading:true});
        const rows = e.rows;
        const page = (e.first/rows) + 1;
        let apiProm = undefined;
        if(this.state.search.length > 0){
            apiProm = this.api.queryget(`page=${page}&size=${rows}&search=${this.state.search}`)
        }else{
            apiProm = this.api.list(page, rows)
        }
        apiProm.then(res=>{
            setTimeout(()=>{
                this.setState({
                    contacts: res.data.results,
                    index: e.first,
                    loading: false,
                    total: res.data.count
                })
            }, 500);
        })
    }


    setTerm(e){
        const value = e.target.value;
        this.setState({search: value});
        setTimeout(()=>{
            if(value == this.state.search){
                const e = {
                    rows: this.state.rows,
                    first: 0
                };
                this.setPage(e);
            };
        }, 1000);
    }


    displayProfile(row){
        return <img src={row.picture} style={{width:'65px', height:'65px', objectFit:'cover'}}/>
    }


    displayText(header, fieldKey){
        return row=>{
            return (
                <React.Fragment>
                    <div className="m-data-descriptor">{header}</div>
                    <div>{row[fieldKey]}</div>
                </React.Fragment>
            )
        }
    }


    displayCreate(){
        const handler = fdata => {
            this.api.create(fdata)
            .then(()=>{
                const e = {
                    rows: this.state.rows,
                    first: this.state.index
                };
                this.setPage(e);
            });
        }
        let row = {
            picture: "http://localhost:3000/files/profile_pict/default.png",
            birthdate: new Date()
        }
        return <ContactForm buttonIcon='pi pi-plus' buttonLabel='Create'
                    header='Create Contact' editable={true} data={row} submitHandler={handler}/>
    }


    displayEdit(row){
        const handlerUpdate = fdata => {
            this.api.update(row.id, fdata)
            .then(()=>{
                const e = {
                    rows: this.state.rows,
                    first: this.state.index
                };
                this.setPage(e);
            });
        }
        const handlerDelete = ()=>{
            this.api.delete(row.id)
            .then(()=>{
                const e = {
                    rows: this.state.rows,
                    first: this.state.index
                };
                this.setPage(e);
            });
        }
        const deleteConfirm = (e)=>{
            confirmDialog({
                target: e.currentTarget,
                message: 'Do you want to delete this record?',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept : handlerDelete
            });
        }
        return (<React.Fragment>
                <ContactForm buttonIcon='pi pi-pencil' buttonLabel='Edit'
                            header='Contact Editor' editable={true} data={row} submitHandler={handlerUpdate}/>
                <Button onClick={deleteConfirm} icon="pi pi-times" label="Delete" className="p-button-danger p-button-outlined" />
                </React.Fragment>)
    }


    render(){

        if(this.state.permission.view){
            return (
                <div className='resposive-table'>
                    <div className='table-header'>
                        <div style={{marginRight:"10px"}}>
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={this.state.search} onChange={this.setTerm.bind(this)} placeholder="Search" />
                            </span>
                        </div>
                        {this.displayCreate()}
                    </div>
                    <DataTable value={this.state.contacts} paginator rows={this.state.rows} totalRecords={this.state.total}
                        lazy first={this.state.index} onPage={this.setPage.bind(this)} loading={this.state.loading}>
                        <Column body={this.displayProfile} />
                        <Column header="First Name" body={this.displayText("First Name", "first_name")}/>
                        <Column header="Last Name" body={this.displayText("Last Name", "last_name")}/>
                        <Column header="Birthdate" body={this.displayText("Birthdate Name", "birthdate")}/>
                        <Column header="Email" body={this.displayText("Email", "email")}/>
                        <Column header="Phone Number" body={this.displayText("Phone Number", "phone_number")}/>
                        <Column body={this.displayEdit.bind(this)} />
                    </DataTable>
                </div>
            )
        }else{
            return null;
        }
    }
}