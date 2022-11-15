import { Dialog, Transition } from "@headlessui/react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import type { SubmitHandler } from "react-hook-form";

interface Props {
    userId: string
    postId: string
    postAuthor: string | null
}

type Inputs = {
    authorId: string,
    message: string,
    replyId: string,
};

export default function MessageReplyDialog({ userId, postId, postAuthor }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const utils = trpc.useContext();

    const addReply = trpc.post.addReply.useMutation({
        onMutate: () => {
            utils.post.getAll.cancel();
            const optimisticUpdate = utils.post.getAll.getData();

            if (optimisticUpdate) {
                utils.post.getAll.setData(optimisticUpdate);
            }
        },
        onSettled: () => {
            utils.post.getAll.invalidate();
        },
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        const submitData = { userId, replyId: postId, message: data.message };
        addReply.mutate(submitData);
        reset()
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true)
                }}
                className="hover:text-blue-500 transition-all ease-in-out">
                <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            </button>

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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 border-2 border-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6"
                                    >
                                        Replying to @{postAuthor}
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4 md:flex-row justify-center">
                                        <input
                                            type="text"
                                            placeholder="Your message..."
                                            minLength={2}
                                            maxLength={255}
                                            className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-transparent focus:outline-slate-800 focus:ring-slate-800 hover:border-zinc-600 transition-colors duraction-300 ease-in"
                                            {...register("message", { required: true })}
                                        />
                                        <button
                                            type="submit"
                                            className="p-2 rounded-md border-2 border-zinc-800 focus:outline-neutral-900 hover:bg-neutral-800 hover:border-zinc-600 transition-colors duration-300 ease-in">
                                            Submit
                                        </button>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}