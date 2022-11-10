import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";

import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth/core/types";
import { trpc } from "../../../utils/trpc";

interface Props {
    session: Session | null;
    post: Post;
    author: User;
    likes: User[];
}

export default function MessageItem({ session, post, author, likes }: Props) {

    const utils = trpc.useContext();
    const addLike = trpc.post.addLike.useMutation({
        onSuccess: () => utils.post.getAll.invalidate(),
    })
    const removeLike = trpc.post.removeLike.useMutation({
        onSuccess: () => utils.post.getAll.invalidate(),
    })

    return (
        <div className="flex flex-col gap-2 justify-center text-center mx-auto w-11/12 md:w-1/2 border-2 rounded-md border-neutral-800 p-4">
            <p className="text-neutral-400">
                &quot;{post.message}&quot;
            </p>
            <span className="italic font-bold">- {author.name}</span>
            <span className="text-neutral-500 italic text-sm">{post.createdAt?.toLocaleString('en-US', { dateStyle: "long" })} at {post.createdAt.toLocaleTimeString('en-US')}</span>
            <div className="flex gap-2 justify-center">
                {
                    likes.find(user => {
                        return (user.name == session?.user?.name);
                    }) ?
                        // Remove like function
                        <button onClick={() => {
                            if (!session?.user) return;
                            removeLike.mutate({
                                postId: post.id,
                                userId: session.user.id
                            })
                        }}>
                            <SolidHeartIcon className="w-4 h-4 " />
                        </button>
                        :
                        // Add like function
                        <button onClick={() => {
                            if (!session?.user) return;
                            addLike.mutate({
                                postId: post.id,
                                user: { id: session.user.id }
                            })
                        }}>
                            <OutlineHeartIcon className="w-4 h-4 " />
                        </button>
                }
                <div>
                    {likes.length}
                </div>
            </div>
        </div>
    )
}