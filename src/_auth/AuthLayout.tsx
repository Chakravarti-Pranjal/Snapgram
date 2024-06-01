import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false ;

  return (
    <>
      { isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
            <section className="flex flex-1 justify-center items-center flex-col py-10">
                <Outlet />
            </section>

            <img src="https://img.freepik.com/premium-vector/social-media-marketing-mobile-style_23-2148410478.jpg?w=740" alt="imgs" className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat "  />
        </>
      )

      }
    </>
  )
}

export default AuthLayout
