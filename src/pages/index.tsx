import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Messages from "../components/ui/Post/Messages";

import { trpc } from "../utils/trpc";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const Form = () => {
    const utils = trpc.useContext();
    const [message, setMessage] = useState("");
    const postMessage = trpc.post.postMessage.useMutation({
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

    return (
      <form
        className="flex gap-2 flex-col md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          postMessage.mutate({
            userId: session?.user?.id as string,
            message,
          });
          setMessage("");
        }}
      >
        <input
          type="text"
          value={message}
          placeholder="Your message..."
          minLength={2}
          maxLength={255}
          onChange={(event) => setMessage(event.target.value)}
          className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-transparent focus:outline-slate-800 focus:ring-slate-800 hover:border-zinc-600 transition-colors duraction-300 ease-in"
        />
        <button
          type="submit"
          className="p-2 rounded-md border-2 border-zinc-800 focus:outline-neutral-900 hover:bg-neutral-800 hover:border-zinc-600 transition-colors duration-300 ease-in">
          Submit
        </button>
      </form>
    );
  };

  return (
    <>
      <Head>
        <title>Guestbook by Nathan Baylon</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex p-4 pt-8 flex-col">
        <div className="mb-16">
          <h1 className="text-4xl text-gray-200 text-center">
            Guestbook
          </h1>
        </div>

        <div className="border-2 rounded-md border-neutral-800 m-auto p-4 text-center">
          {session ? (
            <>
              <div className="mb-2">
                Logged in as:
              </div>

              {
                session.user?.image ? (
                  <Image src={session.user?.image} width={100} height={100} alt="user image" priority={true} className="mx-auto mt-4 mb-2 rounded-full w-24 h-24 border-4 border-neutral-800" />
                ) : (
                  <div className="text-center">No profile picture</div>
                )
              }

              <div className="mb-4 font-bold">
                {session.user?.name}
              </div>

              <Form />

              <button onClick={() => signOut()} className="bg-blue-500 hover:bg-blue-700 mt-4 py-1 px-2 rounded tranistion ease-in-out duration-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                Login with Discord
              </div>
              <button onClick={() => signIn('discord')} type="button" className="inline-block px-6 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700">
                <svg xmlns="http:z//www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-6 h-6">
                  <path fill="currentColor" d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                </svg>
              </button>
            </>
          )}
        </div>
        <div className="mt-12">
          <Messages session={session} />
        </div>
      </main>
    </>
  );
};

export default Home;
