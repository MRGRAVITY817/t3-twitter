import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { type RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log("user", user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <img
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="w-full bg-transparent focus:outline-none"
      />
    </div>
  );
};

type PostWithUsers = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ post, author }: PostWithUsers) => {
  return (
    <div className="flex w-full gap-3 border-b border-slate-400 p-4">
      <img
        src={author.profilePicture}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
      />
      <div>
        <div className="flex">
          <span>{`@${author.username}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  const user = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
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
