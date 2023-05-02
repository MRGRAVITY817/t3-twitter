import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { LoadingPage } from "~/components/Loading";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
dayjs.extend(relativeTime);

const createdDate = (date: string | Date): string => dayjs(date).fromNow();

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      setInput("");
      await ctx.posts.getAll.invalidate();
    },
  });

  const [input, setInput] = useState<string>("");

  const submitPost = () => {
    mutate({ content: input });
  };

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="w-full bg-transparent focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button
        onClick={submitPost}
        className="rounded-md bg-blue-400 p-2 text-white"
      >
        Post
      </button>
    </div>
  );
};

type PostWithUsers = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ post, author }: PostWithUsers) => {
  return (
    <div className="flex w-full gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profilePicture}
        alt={`@${author.username} profile image`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="ml-2">
        <div className="mb-1 flex">
          <span>{`@${author.username} `}</span>
          <span className="ml-2 font-extralight text-slate-300">{` • ${createdDate(
            post.createdAt
          )}`}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();
  const { isLoaded: userLoaded, ...user } = useUser();

  if (!userLoaded && postLoading) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>T3 Twitter 🦅</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4 text-base text-white">
            {!user.isSignedIn ? <SignInButton /> : <CreatePostWizard />}
          </div>
          <div>
            {data?.map((postInfo) => (
              <PostView key={postInfo.post.id} {...postInfo} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
