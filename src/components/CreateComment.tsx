'use client'

import { useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

type Props = {
  postId: string 
  replyToId?: string
}

const CreateComment = ({postId, replyToId}: Props) => {

  const [input, setInput] = useState<string>('')

  const {loginToast} = useCustomToast()

  const router = useRouter()

  const {mutate: comment, isLoading} = useMutation({
    mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      }

      const {data} = await axios.patch(`/api/subreddit/post/comment`, payload)

      return data
    },
    onError: (error) => {
      if(error instanceof AxiosError){
          if(error.response?.status === 401){
              return loginToast()
          }
      }

      return toast({
          title: 'There was an error.',
          description: 'Could comment to this post.',
          variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    }
  })

  return <div className="grid w-full gap-1.5">
    <Label htmlFor='comment'>Your comment</Label>
    <div className="mt-2">
      <Textarea id="comment" value={input} onChange={(e) => setInput(e.target.value)} 
        rows={1}
        placeholder="What are your thoughts"
      />
      <div className="mt-2 flex justify-end">
        <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => comment({ postId, text: input, replyToId})}>Post</Button>
      </div>
    </div>
  </div>
}

export default CreateComment;