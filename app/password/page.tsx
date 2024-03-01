'use client'
import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { PrimeReactProvider } from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind'
import axios, { AxiosRequestConfig } from 'axios'
import { PasswordManager as DefaultPasswordManager } from '@prisma/client'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import { DialogStatus, decryptAES, encryptAES } from '@/utils/utilsClient'
import 'primeicons/primeicons.css'

interface PasswordManager extends DefaultPasswordManager {
  passPhrase: string
}

export default function Password() {
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<PasswordManager[]>>(null)

  const emptyPasswordManager: PasswordManager & {} = {
    id: '',
    userId: '',
    serviceName: '',
    serviceUrl: '',
    password: '',
    passPhrase: '',
  }

  const [refresh, setRefresh] = useState(0)
  const apiUrl = '/api/password-manager'
  const [passwordManagers, setPasswordManagers] = useState<PasswordManager[]>(
    []
  )
  const [showDialog, setShowDialog] = useState(false)
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>(
    DialogStatus.Off
  )

  const [showPassPhraseInput, setShowPassPhraseInput] = useState(false)
  const [realPassword, setRealPassword] = useState<string>('')
  const [clickedRow, setClickedRow] = useState<PasswordManager>()
  const openDialog = () => {
    formik.resetForm()
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
    formik.resetForm()
  }

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        setPasswordManagers(response.data)
      })
      .catch((error) => {
        throw error
      })
  }, [refresh])

  const formik = useFormik({
    initialValues: emptyPasswordManager,
    validate: (data: PasswordManager) => {
      let errors: { [key: string]: string } = {}

      ;['serviceName', 'password', 'passPhrase'].forEach((element) => {
        let key = element as keyof PasswordManager
        if (data[key] == '') {
          errors[key] = 'This field is required !'
        }
      })
      return errors
    },

    onSubmit: async (data: PasswordManager) => {
      if (data) {
        data.password =
          dialogStatus != DialogStatus.Delete
            ? encryptAES(data.password, data.passPhrase)
            : data.password
        const { id, passPhrase, ...cleanData } = data
        let request: AxiosRequestConfig = {}

        switch (dialogStatus) {
          case DialogStatus.Create:
            request = {
              method: 'POST',
              url: apiUrl,
              data: cleanData,
            }
            break
          case DialogStatus.Update:
            request = {
              method: 'PUT',
              url: apiUrl,
              data: cleanData,
              params: { id: id },
            }
            break

          case DialogStatus.Delete:
            request = {
              method: 'DELETE',
              url: apiUrl,
              data: cleanData,
              params: { id: id },
            }
            break
          default:
            break
        }

        try {
          const response = await axios(request)
          setRefresh(refresh + 1)
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
          })
          closeDialog()
        } catch (error) {
          const errorMessage =
            typeof error === 'string'
              ? error
              : error instanceof Error
                ? error.message
                : 'An unknown error occurred'
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          })
        }
      }
    },
  })

  function generateStrongPassword(length: number): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const specialChars = '!@#$%^&*()-_=+'

    const allChars =
      uppercaseChars + lowercaseChars + numberChars + specialChars

    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length)
      password += allChars[randomIndex]
    }

    return password
  }

  const generatePasswordClick = () => {
    formik.setFieldValue('password', generateStrongPassword(12))
  }
  const leftToolbarTemplate = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button
          label='New'
          icon='pi pi-plus'
          severity='success'
          onClick={() => {
            openDialog()
            setDialogStatus(DialogStatus.Create)
          }}
        />
      </div>
    )
  }

  const editPassword = (rowData: PasswordManager) => {
    setDialogStatus(DialogStatus.Update)
    openDialog()
    formik.setValues({ ...rowData, passPhrase: '' })
  }

  const deletePassword = (rowData: PasswordManager) => {
    setDialogStatus(DialogStatus.Delete)
    openDialog()
    formik.setValues({ ...rowData, passPhrase: 'FOR.PASSING.ERROR' })
  }
  const actionBodyTemplate = (rowData: PasswordManager) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          size='small'
          className='mr-2'
          onClick={() => editPassword(rowData)}
        />
        <Button
          icon='pi pi-trash'
          rounded
          outlined
          size='small'
          severity='danger'
          onClick={() => deletePassword(rowData)}
        />
      </React.Fragment>
    )
  }

  const isFormFieldInvalid = (name: keyof PasswordManager) =>
    !!(formik.touched[name] && formik.errors[name])

  const getFormErrorMessage = (name: keyof PasswordManager) => {
    return isFormFieldInvalid(name) ? (
      <small className='dark:text-red-400 text-red-800'>
        {formik.errors[name]}
      </small>
    ) : (
      <small className=''>&nbsp;</small>
    )
  }

  const inputTemplate = (name: keyof PasswordManager, label: string) => {
    return (
      <div className='flex flex-col gap-3 mt-2'>
        <label className='font-bold' htmlFor={name}>
          {label}
        </label>

        <InputText
          id={name}
          className='p-inputtext-sm'
          value={formik.values[name] as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            formik.setFieldValue(name, e.target.value)
          }}
        />
        {getFormErrorMessage(name)}
      </div>
    )
  }

  const dialogFooter = () => {
    let label: string = ''
    switch (dialogStatus) {
      case DialogStatus.Create:
        label = 'Add'
        break
      case DialogStatus.Update:
        label = 'Update'
        break
      case DialogStatus.Delete:
        label = 'Delete'
        break
      default:
        break
    }
    return (
      <React.Fragment>
        <Button
          label='Cancel'
          icon='pi pi-times'
          outlined
          onClick={() => closeDialog()}
        />
        <Button
          label={label}
          icon={
            'pi ' + (formik.isSubmitting ? 'pi-spin pi-spinner ' : 'pi-check ')
          }
          onClick={(e) => {
            formik.submitForm()
          }}
        />
      </React.Fragment>
    )
  }

  const decryptClick = (rowData: PasswordManager) => {
    let _realPassword = decryptAES(
      rowData.password,
      formik.values['passPhrase']
    )
    setRealPassword(_realPassword)
    if (_realPassword) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
      })
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Bad passphrase',
      })
    }
  }

  const passwordBody = (rowData: PasswordManager) => {
    let showPasswordForm = showPassPhraseInput && clickedRow == rowData
    return (
      <div className='flex flex-wrap gap-2 '>
        <Button
          icon={'pi pi-eye' + (showPasswordForm ? '-slash' : '')}
          rounded
          size='small'
          outlined
          severity='help'
          className='h-10'
          onClick={() => {
            setClickedRow(rowData)
            setShowPassPhraseInput(!showPassPhraseInput)
            setRealPassword('')
            formik.resetForm()
          }}
        />

        <div hidden={!showPasswordForm}>
          <div className=''>
            <InputText
              value={formik.values['passPhrase']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                formik.setFieldValue('passPhrase', e.target.value)
              }
              size='small'
            />
            <Button
              label='ok'
              className=''
              size='small'
              severity='secondary'
              onClick={() => decryptClick(rowData)}
            />
          </div>
          <div className='flex flex-col mt-3'>
            <span>{realPassword}</span>
            {realPassword && (
              <small className='dark:text-green-400 text-green-800'>
                Decryption success
              </small>
            )}

            {!realPassword && (
              <small className='dark:text-red-400 text-red-800'>
                Decryption needs passphrase
              </small>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <div className='container mx-auto py-3'>
        <Toast ref={toast} />
        <div className='card'>
          <Toolbar className='mb-4' left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={passwordManagers}
            dataKey='id'
            paginator
            size='small'
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} passwords'
            className='rounded pb-auto text-xs'
          >
            <Column
              field='serviceName'
              header='Service Name'
              filter
              sortable
            ></Column>
            <Column field='serviceUrl' header='URL' filter sortable></Column>
            <Column
              field='password'
              header='Encrypted Password'
              sortable
            ></Column>
            <Column header='Password' sortable body={passwordBody}></Column>
            <Column body={actionBodyTemplate} exportable={false}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog
        visible={showDialog}
        header='Password manager'
        modal
        style={{ width: '90vw' }}
        onHide={() => closeDialog()}
        footer={dialogFooter}
      >
        {dialogStatus != DialogStatus.Delete && (
          <>
            <div className='flex flex-row gap-4'>
              <div className='flex-auto'>
                {inputTemplate('serviceName', 'Service Name')}
              </div>
              <div className='flex-auto'>
                {inputTemplate('serviceUrl', 'Service Url')}
              </div>
            </div>

            <div className='flex flex-row gap-4'>
              <div className='flex-auto'>
                {inputTemplate('password', 'Password')}
                <Button
                  label='Generate'
                  rounded
                  size='small'
                  outlined
                  severity='warning'
                  className='mb-2'
                  onClick={generatePasswordClick}
                />
              </div>
              <div className='flex-auto'>
                {inputTemplate('passPhrase', 'PassPhrase')}
              </div>
            </div>
          </>
        )}
      </Dialog>
    </PrimeReactProvider>
  )
}
