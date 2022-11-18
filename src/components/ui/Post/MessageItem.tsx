import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth/core/types";
import { trpc } from "../../../utils/trpc";
import { Fragment, useState } from "react";
import MessageReplyDialog from "./MessageReplyDialog";
import { Dialog, Disclosure, Transition } from "@headlessui/react";

interface Props extends Post {
    session: Session | null;
    author: User;
    likes: User[];
    replies: Post[];
}

export default function MessageItem({ session, replies, author, message, id, createdAt, likes }: Props) {
    const addLike = trpc.post.addLike.useMutation()
    const removeLike = trpc.post.removeLike.useMutation()
    const [isOpen, setIsOpen] = useState(false);

    const [liked, setLiked] = useState<boolean>(likes.find(user => {
        return (user.name == session?.user?.name);
    }) ? true : false);

    const [likeCount, setLikeCount] = useState<number>(likes.length)

    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <div className={`flex flex-col justify-center mx-auto w-11/12 md:w-1/2 border-2 rounded-md ${open ? "scale-105 border-neutral-600" : "scale-100 border-neutral-800"} transition-all ease-in-out`}>
                        <button
                            className="z-40 absolute top-4 right-4 text-neutral-600 hover:bg-neutral-700 hover:text-neutral-500 p-1 rounded-md"
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                        </button>
                        <Disclosure.Button>
                            <div className="font-bold text-left ml-4 mt-4">@{author.name}</div>
                            <div className={`flex flex-col gap-2 py-4 border-b-2 ${open ? "border-neutral-600" : "border-neutral-800"}`}>
                                <p className="text-left mx-4 text-neutral-300">
                                    {message}
                                </p>
                            </div>
                        </Disclosure.Button>
                        <div className="flex flex-col md:flex-row justify-between text-center gap-2 align-middle py-4 mx-4">
                            <div className="text-neutral-500 italic">{createdAt?.toLocaleDateString()} at {createdAt.toLocaleTimeString('en-US')}</div>
                            <div className="flex gap-2 justify-center align-middle">
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
                                            <SolidHeartIcon className="w-5 h-5 text-red-500 md:hover:text-red-900 transition-all ease-in-out" />
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
                                        }} className="hover:text-red-500 transition-all ease-in-out">
                                            <OutlineHeartIcon className="w-5 h-5" />
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
                    </div>
                    <Disclosure.Panel>
                        {
                            replies.length > 0 ?
                                replies.map(post => {
                                    return (
                                        <div key={post.id} className="scale-95 w-11/12 md:w-1/2 mx-auto border-2 rounded-md border-neutral-800 p-4 my-2">
                                            <div className="font-bold text-left ml-2">Reply from @someone</div>
                                            <div className={`flex flex-col gap-2 py-2`}>
                                                <p className="text-left mx-2 text-neutral-300">
                                                    {post.message}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <p className="text-center scale-95 w-11/12 md:w-1/2 mx-auto border-2 rounded-md border-neutral-800 p-4 my-2">
                                    {
                                        session?.user?.id
                                            ?
                                            <>
                                                <div className="mb-2">
                                                    This conversation is looking lonely...
                                                </div>
                                                <div className="flex justify-center gap-2 text-neutral-400">
                                                    <MessageReplyDialog userId={session.user.id} postId={id} postAuthor={author.name}>
                                                        Add a reply
                                                    </MessageReplyDialog>
                                                </div>
                                            </>
                                            :
                                            "Log in to reply"
                                    }
                                </p>
                        }
                    </Disclosure.Panel>

                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-40" />
                            </Transition.Child>
                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-0"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-0"
                                    >

                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-neutral-900 border-2 border-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 mb-4"
                                            >
                                                @{author.name}
                                            </Dialog.Title>
                                            <p>
                                                {message}
                                            </p>
                                            <div className="flex flex-col md:flex-row justify-between text-center gap-2 align-middle mt-4">
                                                <div className="text-neutral-500 italic">{createdAt?.toLocaleDateString()} at {createdAt.toLocaleTimeString('en-US')}</div>
                                                <div className="flex gap-2 justify-center align-middle">
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
                                                                <SolidHeartIcon className="w-5 h-5 text-red-500 md:hover:text-red-900 transition-all ease-in-out" />
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
                                                            }} className="hover:text-red-500 transition-all ease-in-out">
                                                                <OutlineHeartIcon className="w-5 h-5" />
                                                            </button>
                                                    }
                                                    <div>
                                                        {likeCount}
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </>

            )}
        </Disclosure>
    )
}