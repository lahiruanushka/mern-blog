import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

export default function PostCard({ post }) {
  return (
    <div className='group relative max-w-[430px] border border-teal-500 hover:border-2 hover:shadow-lg h-[400px] overflow-hidden rounded-lg transition-all'>
      <Link to={`/post/${post.slug}`}>
        <div className="relative">
          <img
            src={post.image}
            alt='post cover'
            className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
          />
          <div className="absolute top-2 left-2 bg-teal-500 text-white px-3 py-1 rounded-md text-sm">
            {post.category}
          </div>
        </div>
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <div className="flex justify-between items-center">
          <p className='text-xl font-semibold line-clamp-2'>{post.title}</p>
          <button className="text-teal-500 hover:text-red-500 transition-colors duration-300">
            <HiHeart className="h-6 w-6" />
          </button>
        </div>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-4 left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}