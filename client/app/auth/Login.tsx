"use client"

import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import CustomAxios from '../../utils/CustomAxios'
import { LoginOrRegisterEnum } from '../../utils/Constants'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"


type LoginProps = {
  setLoginOrRegister: React.Dispatch<React.SetStateAction<LoginOrRegisterEnum>>;
}

export const Login: React.FC<LoginProps> = ({ setLoginOrRegister }) => {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login, setUser } = useContext(AuthContext);
  const customAxios = CustomAxios.getOrgAxios();
  const { toast } = useToast()

  const loginUser = () => {

    const body = {
      email: email,
      password: password
    }
    customAxios.post('/auth/login', body)
      .then((response) => {
        //console.log(response);
        login(response.data.token);
        setUser(response.data.user);
        toast({ title: 'Logged In' })
        router.replace('/')
      })
      .catch((error) => {
        console.log(error);
        toast({ title: error.message })
      })
  }

  // display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   width: 100%;
  //   height: 100%;
  //   color: #fff;
  //   background-color: aliceblue;
  //   padding: 10px;

  return (
    <div className='login-register-card-container'>
      <div className='login-register-card'>
        <div className='login-register-card-header'> Login </div>
        <div className='login-register-card-body'>
          <Input
            id="email"
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={loginUser}>
            Login
          </Button>
        </div>
      </div>
      <div>
        <div className='register-half-circle' onClick={() => setLoginOrRegister(LoginOrRegisterEnum.register)}>
          <div className='register-half-circle-text'> Register </div>
        </div>
      </div>
    </div>
  )
}
