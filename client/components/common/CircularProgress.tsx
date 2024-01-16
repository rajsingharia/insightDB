import { Loader } from "lucide-react"

export const CircularProgress = () => {
    return (
        <div className="animate-spin mt-3">
            <Loader height={25} width={25}/>
        </div>
    )
}