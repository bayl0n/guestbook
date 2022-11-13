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
                    <MessageItem key={post.id} session={session} post={post} author={post.author} likes={post.likes} />
                );
            })}
        </div>
    );
}