import React, {useState, useRef} from 'react';

import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar'
import {Button} from 'primereact/button';
import {SimpleUpload} from '../component/simpleupload';

export function ContactForm(props){
    const getBDate = dateStr =>{
        //Return date with from yyyyy-mm-dd string
        let bdate = String(dateStr).split("-");
        let date = new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]));
        return date;
    }

    const [firstname, setFName] = useState(props.data ? props.data.first_name : '');
    const [lastname, setLName] = useState(props.data ? props.data.last_name : '');
    const [birthdate, setBDate] = useState(props.data ? getBDate(props.data.birthdate) : new Date());
    const [email, setEmail] = useState(props.data ? props.data.email : '');
    const [phone, setPhone] = useState(props.data ? props.data.phone_number : '');
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const picture = props.data ? props.data.picture : null;
    const img = useRef(null);

    const doSubmit = e=>{
        e.preventDefault();
        let fd = new FormData(e.target);
        fd.set('birthdate', fd.get('birthdate').replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1") );
        if(profile) fd.append('picture', profile);
        if(props.submitHandler) props.submitHandler(fd);
        setVisible(false);
        setProfile(null);
    }

    const setImg = ()=>{
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            img.current.setAttribute("src", reader.result);
          }, false);
        reader.readAsDataURL(profile);;
    }

    const inputStyle = {width:"25vw"};
    const mandatoryMark = <span style={{color:'red'}}>*</span>
    const editable = props.editable;
    return (
        <React.Fragment>
            <Button icon={props.buttonIcon} label={props.buttonLabel} onClick={()=> setVisible(true)} disabled={Boolean(props.disabled)}/>
            <Dialog visible={visible} header={<h5>{props.header}</h5>} onHide={()=> setVisible(false)}>
                <form style={{padding:'1vw'}} onSubmit={e=> doSubmit(e)}>
                    <div className='p-d-flex p-flex-column  p-ai-center input-spacing' style={{width:'30vw'}}>
                        <div className='input-spacing p-d-flex p-flex-column p-ai-center' style={{width:"100%"}}>
                            <img ref={img} src={profile ? setImg() : picture} style={{width:'15vw', height:'15vw', objectFit:'cover'}}/>
                            {editable ? 
                                <SimpleUpload icon='pi pi-image'
                                                label='Set profile'
                                                media='image/*'
                                                onChange={files=> setProfile(files[0])}/> : null}
                        </div>
                        <div>
                            <h4>First Name {editable ? mandatoryMark : null}</h4>
                            <InputText name='first_name'
                                        value={firstname}
                                        onChange={e=> setFName(e.target.value)}
                                        style={inputStyle}
                                        required
                                        disabled={!editable}/>
                        </div>
                        <div>
                            <h4>Last Name</h4>
                            <InputText name='last_name' 
                                        value={lastname}
                                        onChange={e=> setLName(e.target.value)}
                                        style={inputStyle}
                                        disabled={!editable}/>
                        </div>
                        <div>
                            <h4>Birthday {editable ? mandatoryMark : null}</h4>
                            <Calendar name="birthdate"
                                        dateFormat="dd-mm-yy"
                                        value={birthdate}
                                        onChange={e=> setBDate(e.target.value)}
                                        monthNavigator 
                                        yearNavigator yearRange="1970:2020" showIcon
                                        style={inputStyle}
                                        touchUI
                                        autoZIndex={Boolean(0)}
                                        required
                                        disabled={!editable}/>
                        </div>
                        <div>
                            <h4>Email {editable ? mandatoryMark : null}</h4>
                            <InputText name='email'
                                        value={email}
                                        onChange={e=> setEmail(e.target.value)}
                                        style={inputStyle}
                                        required
                                        disabled={!editable}/>
                        </div>
                        <div>
                            <h4>Phone Number {editable ? mandatoryMark : null}</h4>
                            <InputText name='phone_number'
                                        value={phone}
                                        onChange={e=> setPhone(e.target.value)}
                                        keyfilter={/[\d\+]/}
                                        style={inputStyle}
                                        required
                                        disabled={!editable}/>
                        </div>
                        <Button type="submit" label="Save" style={{width:"15vw"}}/>
                    </div>
                </form>
            </Dialog>
        </React.Fragment>
    )

}