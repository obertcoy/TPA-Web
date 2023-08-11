export function GetUserInfo(info: string) {

    const user = sessionStorage.getItem('currentUser')
    
    if (user) {
        const userInfoObject = JSON.parse(user)
        
        return userInfoObject[info]
    }

    return null;
}