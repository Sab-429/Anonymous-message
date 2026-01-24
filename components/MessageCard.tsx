import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/src/types/ApiResponse"

interface Message {
  _id: string;
  [key: string]: any;
}

type MessageCardProps = {
    message : Message,
    onmessageDelete: (messageId : string) => void
}
const MessageCard = ({message, onmessageDelete}: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        onmessageDelete(message._id)
    }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><X className = "w-5 h-5"/></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Alert!!. This will permanently delete your message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter>
        </CardFooter>
    </Card>
     
    </div>
  )
}

export default MessageCard
