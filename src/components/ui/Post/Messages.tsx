import { trpc } from "../../../utils/trpc";
import MessageItem from "./MessageItem";

import type { Session } from "next-auth/core/types";

interface Props {
    session: Session | null;
}

export default function Messages({ session }: Props) {
    const { data } = trpc.post.getAll.useQuery();

    return (
        <div className="flex flex-col gap-4">
            {data?.map((post) => {
                return (
                    <>
                        {console.log(post)}
                        <MessageItem key={post.id} replies={post.replies} message={post.message} id={post.id} createdAt={post.createdAt} session={session} author={post.author} likes={post.likes} userId={post.userId} postId={null} />
                    </>
                );
            })}
        </div>
    );
}