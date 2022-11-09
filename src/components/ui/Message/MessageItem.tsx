import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";

import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth/core/types";

interface Props {
    session: Session | null;
    post: Post;
    author: User;
    likes: User[];
}

export default function MessageItem({ session, post, author, likes }: Props) {
    return (
        <div className="flex flex-col gap-2 justify-center text-center mx-auto w-11/12 md:w-1/2 border-2 rounded-md border-neutral-800 p-4">
            <p className="text-neutral-400">
                &quot;{post.message}&quot;
            </p>
            <span className="italic font-bold">- {author.name}</span>
            <span className="text-neutral-500 italic text-sm">{post.createdAt?.toLocaleString('en-US', { dateStyle: "long" })} at {post.createdAt.toLocaleTimeString('en-US')}</span>
            <div className="flex gap-2 justify-center">
                <button>
                    {
                        likes.find(user => {
                            return (user.name == session?.user?.name);
                        }) ? <SolidHeartIcon className="w-4 h-4 " /> : <OutlineHeartIcon className="w-4 h-4 " />
                    }
                </button>
                <div>
                    {likes.length}
                </div>
            </div>
        </div>
    )
}