import jwt from 'jsonwebtoken'

const secretKey = "SHERYL BAWEL"

export async function verifyJWTToken(token: string):Promise<any> {

    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error: jwt.VerifyErrors | null, decoded: any) =>  {
            if(error){
                reject(error)
            } else {
                resolve(decoded)
            }
        })
    })
}

export function getJWTToken(){

    return sessionStorage.getItem('token')
}

