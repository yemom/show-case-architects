import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const BlogTable = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();
  const deleteBlog = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!isConfirmed) return;
    try {
      const { data } = await axios.delete('/api/blog/delete', { data: { id: blog._id } })
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog')
    }
  }
  const togglePublish = async() => {
    try{
      const {data} = await axios.post('/api/blog/toggle-publish',{id:blog._id})
      if(data.success){
        toast.success(data.message)
        await fetchBlogs()
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.response?.data?.message || 'Failed to toggle publish status')
    }
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className='group border-y border-gray-300 bg-background/70 hover:bg-white/90 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden text-white'
    >
      <th className='px-2 py-4 transition-colors duration-200 group-hover:text-gray-800'>{index}</th>
      <td className='px-2 py-4 transition-colors duration-200 group-hover:text-gray-800'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden transition-colors duration-200 group-hover:text-gray-800'>{BlogDate.toLocaleDateString()}</td>
      <td className='px-2 py-4 max-sm:hidden transition-colors duration-200 group-hover:text-gray-800'>
        <p className={blog.isPublished ? "text-green-600" : "text-orange-700"}>
          {blog.isPublished ? 'published' : 'unpublished'}
        </p>
      </td>
      <td className='px-2 py-4 transition-colors duration-200 group-hover:text-gray-800'>
        <div className="flex text-xs gap-3">
          <button onClick={togglePublish}
            className='border px-2 py-0.5 mt-1 rounded cursor-pointer hover:shadow-md transition-all text-white group-hover:text-gray-800'
          >
            {blog.isPublished ? 'unpublish' : 'publish'}
          </button>
          <img
            src={assets.cross_icon}
            className='w-8 hover:scale-110 transition-transform cursor-pointer drop-shadow'
            onClick={deleteBlog}
            alt="delete"
          />
        </div>
      </td>
    </motion.tr>
  )
}

export default BlogTable