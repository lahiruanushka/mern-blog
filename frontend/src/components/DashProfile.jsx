import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl text-gray-800 dark:text-white">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user avatar"
            className="rounded-full w-full h-full border-8 object-cover border-[lightgray] dark:border-gray-600"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="dark:bg-gray-700 dark:text-white"
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="dark:bg-gray-700 dark:text-white"
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          className="dark:bg-gray-700 dark:text-white"
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" className="dark:!bg-purple-700">Update</Button>
        <div className="flex justify-between mt-5">
          <span className="text-red-500 cursor-pointer dark:text-red-400">Delete Account</span>
        </div>
      </form>
    </div>
  );
};

export default DashProfile;
