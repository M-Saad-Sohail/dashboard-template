// import Cookies from 'js-cookie';
// import { User } from "src/types/redux-auth";

// // Helper function to set cookies for middleware/SSR
// export const setCookiesForUser = (user: User, authToken: string) => {
//   if (authToken) {
//     // Only set authToken cookie - this is what middleware checks
//     Cookies.set('authToken', authToken, {
//       path: '/',
//       sameSite: 'Lax',
//       secure: process.env.NODE_ENV === 'production',
//     });

//     // Optional: Set user ID for convenience
//     if (user.id) {
//       Cookies.set('userId', user.id, {
//         path: '/',
//         sameSite: 'Lax',
//         secure: process.env.NODE_ENV === 'production',
//       });
//     }
//   }
// };


// // Helper function to clear cookies
// export const clearCookies = () => {
//   Cookies.remove('authToken', { path: '/' });
//   Cookies.remove('userId', { path: '/' });
//   Cookies.remove('userEmail', { path: '/' });
// };