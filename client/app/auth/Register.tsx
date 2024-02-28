import { useState } from 'react'
import { LoginOrRegisterEnum } from '../../utils/Constants'
import CustomAxios from '../../utils/CustomAxios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"


interface registerUser {
  firstName: string,
  lastName: string,
  email: string,
  organisationId: string,
  password: string,
  isAdmin: boolean
}

type RegisterProps = {
  setLoginOrRegister: React.Dispatch<React.SetStateAction<LoginOrRegisterEnum>>;
}


export const Register: React.FC<RegisterProps> = ({ setLoginOrRegister }) => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [organisationName, setOrganisationName] = useState('')
  const [organisationId, setOrganisationId] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const customAxios = CustomAxios.getOrgAxios();
  const { toast } = useToast()

  const registerUser = () => {
    console.log(`Register user with name: ${name}, email: ${email} and password: ${password}`);

    const body: registerUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      organisationId: organisationId,
      password: password,
      isAdmin: isAdmin
    }

    customAxios.post('/auth/register', body)
      .then((response) => {
        console.log(response);
        setLoginOrRegister(LoginOrRegisterEnum.login)
        toast({ title: "User registered successfully" })
      })
      .catch((error) => {
        console.log(error);
        toast(error.message)
      });

  }

  const createorganisation = () => {
    const body = {
      organisation: {
        organisationName: organisationName,
      }
    }

    customAxios.post('/organisation', body)
      .then((response) => {
        console.log(response);
        toast({ title: "Organisation Created successfully" })
        setOrganisationId(response.data.id)
      })
      .catch((error) => {
        console.log(error);
        toast({ title: error.message })
      });

  }


  return (
    <div className='login-register-card-container'>
      <div className='login-register-card'>
        <div className='login-register-card-header'> Register </div>
        <div className='login-register-card-body'>
          <Input
            id="firstName"
            placeholder="First Name"
            type='string'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            id="lastName"
            placeholder="Last Name"
            type='string'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="organisation"
            placeholder="organisation Name"
            type="string"
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
          />
          <Input
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-end space-x-2">
            <Checkbox
              checked={isAdmin}
              onCheckedChange={(value) => setIsAdmin(value === "indeterminate" ? false : true)}
              id="isAdmin" />
            <label
              htmlFor="isAdmin"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              is Admin
            </label>
          </div>
          <Button
            className="mb-8"
            onClick={registerUser}>
            Register
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <a href='#'>
                <p className="text-sm text-muted-foreground text-center">
                  Create organisation
                </p>
              </a>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create organisation</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input
                  id="name"
                  value={organisationId}
                  onChange={(e) => setOrganisationId(e.target.value)}
                  placeholder="organisation Name" />
              </div>
              <DialogFooter>
                <Button
                  onClick={createorganisation}
                  type="submit">
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <div className='login-half-circle flex-end' onClick={() => setLoginOrRegister(LoginOrRegisterEnum.login)}>
          <div className='login-half-circle-text'> Login </div>
        </div>
      </div>
    </div>
  )
}
