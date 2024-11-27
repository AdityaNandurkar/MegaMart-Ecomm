export interface User {
    length: number;
    find(arg0: (x: any) => boolean): any;
    fullname: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    role: string;
    isAdmin: boolean;
}