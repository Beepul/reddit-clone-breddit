import { getAuthSession } from "@/lib/auth"
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config"
import { notFound } from "next/navigation"
import MiniCreatePost from "@/components/MiniCreatePost"
import { db } from "@/lib/db"
import PostFeed from "@/components/PostFeed"

type Props = {
  params: {
    slug: string
  }
}

const Page = async ({params}: Props) => {
    const { slug } = params 

    const session = await getAuthSession()

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true, 
                    subreddit: true 
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULT
            }
        }
    })


    if(!subreddit) return notFound()

    return <>
        <h1 className="font-bold text-3xl md:text-4xl h-14">
            r/{subreddit.name}
        </h1>
        <MiniCreatePost session={session} />
        <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  
}

export default Page;