import z from 'zod';
import { BlogId } from './05_interlinked/lib';

// note that often we can't tell a string is or was a real blog id
const looksLikeBlogId = (s: string): s is BlogId => s.startsWith('blog');

const blogUpdateParser = z.object({
  label: z.string(),
});

const blogIdParser = z.string().refine(looksLikeBlogId)

const blogParser = z.object({
  id: blogIdParser,
}).merge(blogUpdateParser);

type BlogUpdate = z.infer<typeof blogUpdateParser>;
type Blog = z.infer<typeof blogParser>;

// i.e.

const blogExample: Blog = {
  id: 'blog1' as BlogId,
  label: 'Bobbert\'s blog',
  // noSuchField: 'a'
};

const blogUpdateExample: BlogUpdate = {
  label: 'Bobbert\'s blog',
  // id: 'blog1' as BlogId,
}

const updateBlogApiCall = (id: string, update: unknown) => {
  // won't compile
  // updateBlogInner(id, update);
  const blogId = blogIdParser.parse(id);
  const blogUpdate = blogUpdateParser.parse(update);
  // at this point we're confident this data is validated (and "type-safe")
  updateBlogInner(blogId, blogUpdate);
}

const updateBlogInner = (id: BlogId, update: BlogUpdate) => {
  // ...
}