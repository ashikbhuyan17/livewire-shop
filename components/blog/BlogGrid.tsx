import BlogCard from '@/components/blog/BlogCard';
import type { BlogListItem } from '@/lib/blogs';

type Props = {
  blogs: BlogListItem[];
};

export default function BlogGrid({ blogs }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
