import { getAllCompny } from "../../../services/getAll/getAllCompany/getAllCompany";
import { useEffect, useState } from "react";
import { ValidateSuperUser } from "../../../services/validate/validateSuperUser/validateSuperUser";
import { NavBar } from "../../navbar/navbar";
import type { companyComplete } from "../../../interfaces/interfaces";
export const GetAllCompany=()=>{
    
    const [company,setCompany] = useState<companyComplete[]>([]);
    ValidateSuperUser();
    useEffect(()=>{
        const fetchCompany = async()=>{
            try{
                const data:companyComplete[] = await getAllCompny();
                setCompany(data);
            }catch(e){
                console.log(e)
            }
        }
        fetchCompany()
    },[])

    return(

       <>
        <NavBar/>
         <table className="table m-5">
            <thead className="">
                <td scope="col">id</td>
                <td scope="col">nome</td>
                <td scope="col">cnpj</td>
                <td scope="col">OwnerId</td>
                <td scope="col">createdAt</td>
            </thead>
            <tbody>
            
                {company.map((c)=>(
                    <tr key={c.id}>
                        <td className="col">{c.id}</td>
                        <td className="col">{c.nome}</td>
                        <td className="col">{c.cnpj}</td>
                        <td className="col">{c.ownerId}</td>
                        <td className="col">{c.createdAt}</td>
                    </tr>
                ))}
            </tbody>

            
        </table>
       </>
    )

}