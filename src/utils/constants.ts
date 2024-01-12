
export const generateSlugName = (title: string): string => {
  return title.toLowerCase().split(" ").join("-");
};


export const emailTemeplate = (token: string): string => {
  return `
  <h1>Reset Password</h1>
  <p>Click on the link below to reset your password</p>
  <a href="http://localhost:3000/u/0/password/reset/${token}">Reset Password</a>
  `;
}