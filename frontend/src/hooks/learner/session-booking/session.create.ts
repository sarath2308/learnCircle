import { SESSION_API } from "@/api/learner/session.book.api"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreateSession = () => {
    return useMutation({
        mutationKey:["create-session"],
        mutationFn: SESSION_API.BOOK_SESSION,
        onSuccess:()=>
        {
            toast.success("Session Created Successfully");
        }
    })
}