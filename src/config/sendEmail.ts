import emailjs from "@emailjs/nodejs";
import { emailTemeplate } from "../utils/constants";

type TSendEmail = {
    name: string;
    email: string;
    message: string;
}

export const transporter = async (templateParams: TSendEmail, serviceId: string, templateId: string) => {
    return new Promise((resolve, rejects)=> {
        emailjs.send(
            serviceId,
            templateId,
            templateParams,{
                publicKey: process.env.PUBLIC_KEY!,
                privateKey: process.env.PRIVATE_KEY!,
            }
        )
        .then((response)=>{
            console.log("SUCCESS!", response.status, response.text);
            resolve({
                success:true,
                status: response.status,
                response_text: response.text,
            })
        })
        .catch((error) => {
            console.log("FAILED...", error);
            rejects({
                success:false,
                status: error.status,
                error: error,
            })
        })
    })
}

export default async function sendEmail(name:string, email:string, token:string) {
    const templateParams = {
        name,
        email,
        message: emailTemeplate(token)
    };

    const serviceId = process.env.YOUR_SERVICE_ID!;
    const templateId = process.env.YOUR_TEMPLATE_ID!;

    
    const response = await transporter(templateParams, serviceId, templateId);

    return response
}