import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {confirmDialog} from 'primereact/confirmdialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';

import React, {useState, useRef} from 'react';
import {ContactForm} from './contactform';
import {RestAPI} from '../api/rest';


const API_URL = '/api/contact';


export function ContactsTable(props){
    const [contacts, setContacts] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [permission, setPermission] = useState(['view', 'add', 'delete', 'update']);
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState(10);
    const [total, setTotal] =  useState(0);
    const api = useRef( new RestAPI(API_URL) );

    const setPage = e=>{
        setLoading(true);
        const rows = e.rows;
        const page = (e.first/rows) + 1;
        let apiProm = undefined;
        if(search.length > 0){
            apiProm = api.current.queryget(`page=${page}&size=${rows}&search=${search}`);
        }else{
            apiProm = api.current.list(page, rows);
        }
        apiProm
        .then(res=>{
            setTimeout(()=>{
                setContacts(res.data.results)
                setIndex(e.first)
                setLoading(false)
                setTotal(res.data.count)
            }, 500);
        })
    }

    const setTerm = e=>{
        setSearch(e.target.value);
        setTimeout(()=>{
            const value = e.target.value;
            if(value == search){
                const e = {
                    rows: rows,
                    first: 0
                };
                setPage(e);
            };
        }, 1000);
    }

    const displayProfile = row=>{
        return <img src={row.picture} style={{width:'65px', height:'65px', objectFit:'cover'}}/>
    }

    const displayText = (header, fieldKey)=>{
        return row=>{
            return (
                <React.Fragment>
                    <div className="m-data-descriptor">{header}</div>
                    <div>{row[fieldKey]}</div>
                </React.Fragment>
            )
        }
    }

    const displayCreate = ()=>{
        const handler = fdata => {
            api.current.create(fdata)
            .then(()=>{
                const e = {
                    rows: rows,
                    first: index
                };
                setPage(e);
            });
        }
        let row = {
            picture: "/files/profile_pict/default.png",
            birthdate: new Date()
        }
        return <ContactForm buttonIcon='pi pi-plus' buttonLabel='Create'
                    header='Create Contact' editable={true} data={row} submitHandler={handler}
                    disabled={permission.indexOf('add') < 0}/>
    }

    const displayEdit = row=>{
        const handlerUpdate = fdata => {
            api.current.update(row.id, fdata)
            .then(()=>{
                const e = {
                    rows: rows,
                    first: index
                };
                setPage(e);
            });
        }
        const handlerDelete = ()=>{
            api.current.delete(row.id)
            .then(()=>{
                const e = {
                    rows: rows,
                    first: index
                };
                setPage(e);
            });
        }
        const deleteConfirm = e =>{
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
                            header='Contact Editor' editable={true} data={row}
                            submitHandler={handlerUpdate}
                            disabled={permission.indexOf('update') < 0}/>
                <Button onClick={deleteConfirm} icon="pi pi-times" label="Delete" 
                        className="p-button-danger p-button-outlined"
                        disabled={permission.indexOf('delete') < 0}/>
                </React.Fragment>)
    }

    if(loading && contacts.length == 0)
        setPage({
            first:index,
            rows: rows
        });

    if(permission.indexOf('view') >= 0){
        return (
            <div className='resposive-table'>
                <div className='table-header'>
                    <div style={{marginRight:"10px"}}>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={search} onChange={setTerm} placeholder="Search" />
                        </span>
                    </div>
                    {displayCreate()}
                </div>
                <DataTable value={contacts} paginator rows={rows} totalRecords={total}
                    lazy first={index} onPage={setPage} loading={loading}>
                    <Column body={displayProfile} />
                    <Column header="First Name" body={displayText("First Name", "first_name")}/>
                    <Column header="Last Name" body={displayText("Last Name", "last_name")}/>
                    <Column header="Birthdate" body={displayText("Birthdate Name", "birthdate")}/>
                    <Column header="Email" body={displayText("Email", "email")}/>
                    <Column header="Phone Number" body={displayText("Phone Number", "phone_number")}/>
                    <Column body={displayEdit} />
                </DataTable>
            </div>
        )
    }else{
        return null;
    }
}