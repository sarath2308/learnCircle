export interface Idatabase
{
    connect:()=>Promise<void>
    disconnect:()=>Promise<void>
}