import { useState, useEffect, ChangeEvent } from "react";
import Error from "./error";
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import * as Yup from 'yup';
import useFetch from '@/hooks/use-fetch';
import { login } from '@/api/apiAuth';
import { useNavigate, useSearchParams } from 'react-router';
import { UrlState } from '@/context'; 

function Login() {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const { data, loading, error, func } = useFetch(login, { formData })
  
  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
    }
  },[data,error])

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email:Yup.string().email("Invalid email").required("Email is required"),
        password:Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
      })

      await schema.validate(formData, { abortEarly: false });
      await func();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path]=err.message;
      })
      setErrors(newErrors);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you already have one</CardDescription>
        <Error message={errors.message} />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter your Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color="black" /> : 'Login'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
