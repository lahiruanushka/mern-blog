import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Overview Cards - Enhanced Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-500 text-sm uppercase tracking-wider">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {totalUsers}
              </p>
            </div>
            <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-4xl p-2 shadow-md" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="mr-1" />
              {lastMonthUsers}
            </span>
            <span className="text-gray-400">Last month</span>
          </div>
        </div>

        {/* Total Comments Card */}
        <div className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-500 text-sm uppercase tracking-wider">
                Total Comments
              </h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {totalComments}
              </p>
            </div>
            <HiAnnotation className="bg-indigo-500 text-white rounded-full text-4xl p-2 shadow-md" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="mr-1" />
              {lastMonthComments}
            </span>
            <span className="text-gray-400">Last month</span>
          </div>
        </div>

        {/* Total Posts Card */}
        <div className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-500 text-sm uppercase tracking-wider">
                Total Posts
              </h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {totalPosts}
              </p>
            </div>
            <HiDocumentText className="bg-lime-500 text-white rounded-full text-4xl p-2 shadow-md" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="mr-1" />
              {lastMonthPosts}
            </span>
            <span className="text-gray-400">Last month</span>
          </div>
        </div>
      </div>

      {/* Tables Section - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Button size="sm" outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="w-full">
              <Table.Head>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users &&
                users.map((user) => (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>

        {/* Recent Comments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Comments</h2>
            <Button size="sm" outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="w-full">
              <Table.Head>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {comments &&
                comments.map((comment) => (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Button size="sm" outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable className="w-full">
              <Table.Head>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              {posts &&
                posts.map((post) => (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt="post"
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell className="w-96">{post.title}</Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
