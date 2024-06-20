import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast' ;

import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from '@/lib/validation'
import { z } from 'zod'
import { Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutation';
import { useUserContext } from '@/context/AuthContext';


const SigninForm = () => {

  // Defing Toast
  const { toast } = useToast()
  const { checkAuthUser, isPending: isUserLoading } = useUserContext() ;
  const navigate = useNavigate()

  // Defining loading
  //const isPending = false ;

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn }= useSignInAccount() ;

// Define the form
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver : zodResolver(SignupValidation),
    defaultValues : {
      email : '',
      password : ''
    }
  })

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof SignupValidation>){
    console.log(values) ;

    const newUser = await createUserAccount(values);

    //console.log(newUser);

    if(!newUser){
      return  toast({titlle : "Sign up failed. Please try again"})
    
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if(!session){
      return toast({title : "Sign in failed. Please try again" })
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();

      navigate('/')
    }else {
      return toast({ title: 'Sign up failed. Please try again.'})
    }
  }

  return (
       <Form {...form}>
          <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />

            <h2 className='h3-bold md:h2-bold pt-5 sm:pt-5'>Log in to Your account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-1">Welcome back! Please enter your details.</p>


            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-2">

                 {/* for email field */}
                  <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="your email here.." className='shad-input' {...field} />
                    </FormControl>
                   
                    <FormMessage />
                  </FormItem>
                )}
              />


                  {/* for password field */}
                   <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="your password here.." className='shad-input' {...field} />
                    </FormControl>
                   
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className='shad-button_primary'>
                {isCreatingAccount ? (
                    <div className='flex-center gap-2'>
                      <Loader /> Loading...
                    </div>
                  ) : "Sign in"
                }
              </Button>

              <p className="text-small regular text-light-2 text-center mt-2">
                Already have an account?
                <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>Sign up</Link>
              </p>
            </form>
       </div>
    </Form>
 
  )
}     

export default SigninForm
