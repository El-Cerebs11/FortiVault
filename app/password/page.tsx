'use client'
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { PrimeReactProvider } from "primereact/api";
import Tailwind from 'primereact/passthrough/tailwind';
import axios from 'axios';
import { PasswordManager } from '@prisma/client';
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext';
import { useSession } from 'next-auth/react'
import 'primeicons/primeicons.css';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react'

interface Product {
  id: string | null;
  code: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  category: string | null;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export default function ProductsDemo() {


    const router = useRouter() 
   
    const session = useSession({
        required: true,
        onUnauthenticated() {
         router.push('/signin')
        },
      })
    let emptyProduct: Product = {
       id: null,
       code: '',
       name: '',
       image: null,
       description: '',
       category: null,
       price: 0,
       quantity: 0,
       rating: 0,
       inventoryStatus: 'INSTOCK',
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<PasswordManager[]>>(null);







    const emptyPasswordManager : PasswordManager = {
        id: '',
        userId: '',
        serviceName: '',
        serviceUrl: '',
        password: ''
    }

    const apiUrl = '/api/passwordManager'
    const [passwordManagers, setPasswordManagers] = useState<PasswordManager[]>([])
const [selectedPasswordManager, setSelectedPasswordManager] = useState<PasswordManager>(emptyPasswordManager)
const [showDialog, setShowDialog] = useState(false)



useEffect(() => {

      axios.get(apiUrl).then((response)=>{
        setPasswordManagers(response.data);
        

      }).catch(error=>{
        throw error;
      }) 
}, [])





const formik = useFormik({
    initialValues: emptyPasswordManager,
    validate: 
    (data: PasswordManager) => {
      let errors: { [key: string]: string } = {} ;

      //check is empty
      ['serviceName', 'password'].forEach((element) => {
        let key = element as keyof PasswordManager
        if (data[key] == '') {
          errors[key] = 'This field is required !'
        }

      })
      return errors
    },

    onSubmit:async (data: PasswordManager) => {
       
      if (data) {
        try {
         
             data.userId = session?.data?.user?.id as string
             const {id, ...params}  = data
        
            const response = await axios.post(apiUrl, params ); 
           
          } catch (error) {
            throw error;
          }
      }
    },
  })



    const openNew = () => {

        setShowDialog(true);
    };

    const hideDialog = () => {
       
        setShowDialog(false);
    };



    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

 



    const confirmDeleteSelected = () => {
    
    };




    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };



  

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };




    const isFormFieldInvalid = (name: keyof PasswordManager) =>
    !!(formik.touched[name] && formik.errors[name])

    const getFormErrorMessage = (name: keyof PasswordManager) => {
        return isFormFieldInvalid(name) ? (
          <small className='dark:text-red-400 text-red-800'>{formik.errors[name]}</small>
        ) : (
          <small className=''>&nbsp;</small>
        )
      }


const inputTemplate = (name : keyof PasswordManager , label : string)=>{
    return(
    
    <div className="flex flex-col gap-3 mt-6">
    <label htmlFor={name} >{label}</label>

    <InputText id={name} value={formik.values[name as keyof PasswordManager] as string} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>formik.setFieldValue(name, e.target.value)} />
    {getFormErrorMessage(name)}

</div>
    
    
    )
}


const dialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={(e)=>{formik.submitForm()}} />
    </React.Fragment>
);


    return (
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
        <div className='container mx-auto py-3 '>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable ref={dt} value={passwordManagers} selection={selectedPasswordManager} 
                        onSelectionChange={(e) => {
                            if (Array.isArray(e.value)) {
                                setSelectedProducts(e.value);
                            }
                        }}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[10, 20, 50]} 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} 
                        className='rounded'
                        >
                    <Column field="serviceName" header="Service Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="serviceUrl" header="URL" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="password" header="password" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={showDialog} style={{ width: '32rem' }} header="Password manager" modal  onHide={hideDialog} footer={dialogFooter}>
             

{inputTemplate('serviceName' , 'service Name')}
{inputTemplate('serviceUrl' , 'service Url')}
{inputTemplate('password' , 'password')}  
            </Dialog>

         

          
        </div>
        </PrimeReactProvider>
    );
}
        