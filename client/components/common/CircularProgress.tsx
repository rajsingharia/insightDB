import { Loader } from "lucide-react"

export const CircularProgress = () => {
    return (
        <div className="animate-spin mt-3">
            <Loader color='black' height={20} width={20}/>
        </div>
    )
}