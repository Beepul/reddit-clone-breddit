'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubrreditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
    subredditId: string;
    subredditName: string;
    isSubscribed: boolean;
}

const SubscribeLeaveToggle = ({subredditId, subredditName, isSubscribed}: Props) => {

  const { loginToast } = useCustomToast()

  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubsLoading} = useMutation({
    mutationFn: async () => {
        const payload: SubscribeToSubrreditPayload = {
            subredditId,
        }

        const {data} = await axios.post('/api/subreddit/subscribe', payload)

        return data as string
    },
    onError: (err) => {
        if(err instanceof AxiosError){
            if(err.response?.status === 401){
                return loginToast()
            }
        }

        return toast({
            title: 'There was a problem',
            description: 'Something went wrong, please try again',
            variant: 'destructive'
        })
    },
    onSuccess: () => {
        startTransition(() => {
            router.refresh()
        })

        return toast({
            title: 'Subscribed',
            description: `You are now subscribed to ${subredditName}`
        })
    }
  })
  const { mutate: unsubscribe, isLoading: isUnSubsLoading} = useMutation({
    mutationFn: async () => {
        const payload: SubscribeToSubrreditPayload = {
            subredditId,
        }

        const {data} = await axios.post('/api/subreddit/unsubscribe', payload)

        return data as string
    },
    onError: (err) => {
        if(err instanceof AxiosError){
            if(err.response?.status === 401){
                return loginToast()
            }
        }

        return toast({
            title: 'There was a problem',
            description: 'Something went wrong, please try again',
            variant: 'destructive'
        })
    },
    onSuccess: () => {
        startTransition(() => {
            router.refresh()
        })

        return toast({
            title: 'Unsubscribed',
            description: `You are now unsubscribed from ${subredditName}`
        })
    }
  })

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4" isLoading={isUnSubsLoading} onClick={() => unsubscribe()}>Leave community</Button>
    ) : (
    <Button className="w-full mt-1 mb-4" isLoading={isSubsLoading} onClick={() => subscribe()}>Join to post</Button>        
  )
}


export default SubscribeLeaveToggle;