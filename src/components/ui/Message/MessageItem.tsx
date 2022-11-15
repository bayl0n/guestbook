import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth/core/types";
import { trpc } from "../../../utils/trpc";
import { useState } from "react";
import MessageReplyDialog from "./MessageReplyDialog";
import { Disclosure } from "@headlessui/react";

interface Props extends Post {
    session: Session | null;
    author: User;
    likes: User[];
    replies: Post[];
}

export default function MessageItem({ session, replies, author, message, id, createdAt, likes }: Props) {

    const addLike = trpc.post.addLike.useMutation()
    const removeLike = trpc.post.removeLike.useMutation()

    const [liked, setLiked] = useState<boolean>(likes.find(user => {
        return (user.name == session?.user?.name);
    }) ? true : false);

    const [likeCount, setLikeCount] = useState<number>(likes.length)

    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <div className={`flex flex-col justify-center mx-auto w-11/12 md:w-1/2 border-2 rounded-md ${open ? "scale-105 border-neutral-600" : "scale-100 border-neutral-800"} hover:scale-105 transition-all ease-in-out`}>
                        <Disclosure.Button>
                            <ArrowsPointingOutIcon className="w-5 h-5 absolute top-4 right-4 text-neutral-600" />
                            <div className={`flex flex-col gap-2 justify-center text-center py-4 border-b-2 ${open ? "border-neutral-600" : "border-neutral-800"}`}>

                                <p className="text-neutral-400">
                                    &quot;{message}&quot;
                                </p>
                                <span className="italic font-bold">- {author.name}</span>
                                <span className="text-neutral-500 italic">{createdAt?.toLocaleDateString()} at {createdAt.toLocaleTimeString('en-US')}</span>
                            </div>
                        </Disclosure.Button>
                        <div className="flex gap-2 justify-center py-4 align-middle">
                            {
                                liked ?
                                    <button onClick={() => {
                                        if (!session?.user) return;

                                        removeLike.mutate({
                                            postId: id,
                                            userId: session.user.id
                                        })
                                        setLiked(false)
                                        setLikeCount(likeCount - 1)
                                    }}>
                                        <SolidHeartIcon className="w-5 h-5 " />
                                    </button>
                                    :
                                    <button onClick={() => {
                                        if (!session?.user) return;
                                        addLike.mutate({
                                            postId: id,
                                            user: session.user
                                        })
                                        setLiked(true)
                                        setLikeCount(likeCount + 1)
                                    }}>
                                        <OutlineHeartIcon className="w-5 h-5 " />
                                    </button>
                            }
                            <div className="min-w-[1rem]">
                                {likeCount}
                            </div>
                            {
                                session?.user?.id ? <MessageReplyDialog userId={session.user.id} postId={id} postAuthor={author.name} /> : <button><ChatBubbleOvalLeftIcon className="w-5 h-5" /></button>
                            }

                            <div className="min-w-[1rem]">
                                {replies.length}
                            </div>
                        </div>
                    </div>
                    <Disclosure.Panel>
                        {
                            replies.length > 0 ?
                                replies.map(post => {
                                    return (
                                        <div key={post.id} className="text-center w-11/12 md:w-1/2 mx-auto border-2 rounded-md border-neutral-800 p-4 my-2">
                                            <p className="text-neutral-400">
                                                &quot;{post.message}&quot;
                                            </p>
                                        </div>
                                    )
                                })
                                :
                                <p className="text-center w-11/12 md:w-1/2 mx-auto border-2 rounded-md border-neutral-800 p-4 my-2">
                                    Be the first to reply!
                                    <div className="mt-4">
                                        {session?.user?.id ? <MessageReplyDialog userId={session.user.id} postId={id} postAuthor={author.name} /> : ""}
                                    </div>
                                </p>
                        }
                    </Disclosure.Panel>
                </>

            )}
        </Disclosure>
    )
}