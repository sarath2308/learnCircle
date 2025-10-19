import { ROLE } from "@/contstant/role";

export type Roles = (typeof ROLE)[keyof typeof ROLE];
