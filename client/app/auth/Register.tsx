import { useState } from 'react'
import { LoginOrRegisterEnum } from '../../utils/Constants'
import AuthAxios from '../../utils/AuthAxios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"


interface registerUser {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

type RegisterProps = {
  setLoginOrRegister: React.Dispatch<React.SetStateAction<LoginOrRegisterEnum>>;
}


export const Register: React.FC<RegisterProps> = ({ setLoginOrRegister }) => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const authAxios = AuthAxios.getAuthAxios();
  const { toast } = useToast()

  const registerUser = () => {
    console.log(`Register user with name: ${name}, email: ${email} and password: ${password}`);

    const body: registerUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }

    authAxios.post('/auth/register', body)
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


  return (
    <div className='login-register-card-container'>
      <div className='login-register-card'>
        <div className='login-register-card-header'> Register </div>
        <div className='login-register-card-body'>
          <Input
            id="firstName"
            placeholder ="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={registerUser}>
            Register
          </Button>
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
