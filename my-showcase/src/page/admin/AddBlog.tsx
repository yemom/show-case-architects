import React, { useEffect, useState, useRef } from 'react';
import { assets } from '../../assets/assets';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/useAppContext';
import { marked } from 'marked';

declare global {
    interface Window {
        refreshBlogList?: () => void;
    }
}

const AddBlog: React.FC = () => {
    const { axios, token } = useAppContext();

    const REQUIRE_IMAGE = false;
    const USE_GENERATE_ENDPOINT = true;

    const [isAdding, setIsAdding] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);

    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                    ],
                },
            });
        }
    }, []);

    const generateContent = async () => {
        if (!USE_GENERATE_ENDPOINT) return;
        if (!title.trim()) return toast.error('Enter a title first');
        try {
            setLoadingAI(true);
            const formData = new FormData();
            formData.append('prompt', title);
            if (image) formData.append('image', image);

            const { data } = await axios.post('/api/blog/generate-content', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success && quillRef.current) {
                const parsed = marked.parse(data.content || '');
                if (parsed instanceof Promise) {
                    quillRef.current.root.innerHTML = await parsed;
                } else {
                    quillRef.current.root.innerHTML = parsed;
                }
            } else {
                toast.error(data.message || 'Failed to generate content');
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e.response?.data?.message || 'Request failed');
        } finally {
            setLoadingAI(false);
        }
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isAdding) return;

        const description = quillRef.current?.root?.innerHTML?.trim() || '';
        if (!title.trim()) return toast.error('Title required');
        if (!subTitle.trim()) return toast.error('Subtitle required');
        if (!description || description === '<p><br></p>') return toast.error('Description required');
        if (!category) return toast.error('Select a category');

        const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
        if (video && video.size > MAX_VIDEO_BYTES) return toast.error('Video too large (limit 500MB)');

        try {
            setIsAdding(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('subTitle', subTitle);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('isPublished', String(isPublished));
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);

            const { data } = await axios.post('/api/admin/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data?.success) {
                toast.success(data.message || 'Blog added successfully');
                setTitle('');
                setSubTitle('');
                setCategory('');
                setIsPublished(false);
                setImage(null);
                setVideo(null);
                if (quillRef.current) quillRef.current.root.innerHTML = '';
                // Optional global refresh hook
                if (typeof window !== 'undefined' && window.refreshBlogList) {
                    window.refreshBlogList();
                }
            } else {
                toast.error(data?.message || 'Failed to add blog');
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e.response?.data?.message || 'Request failed');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
            <div className='max-w-[1100px] mx-auto border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-8'>
                <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Content Studio</p>
                <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] text-[#1a2329] mt-2 mb-6'>Create Project</h1>

                <p className='text-[#4f5f71]'>Upload project image {REQUIRE_IMAGE ? '(required)' : '(optional)'}</p>
                <label htmlFor='image'>
                    <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='Preview' className='mt-2 h-24 w-36 object-cover cursor-pointer border border-[#a9bacd]/55 bg-[#f4f7fb]' />
                    <input type='file' id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
                </label>

                <p className='mt-6 text-[#4f5f71]'>Optional project video</p>
                <label htmlFor='video'>
                    {video ? (
                        <video src={URL.createObjectURL(video)} className='mt-2 h-28 w-48 border border-[#a9bacd]/55 object-cover' controls />
                    ) : (
                        <div className='mt-2 h-16 w-44 flex items-center justify-center border-2 border-dashed border-[#a9bacd]/65 text-xs text-[#637081] cursor-pointer bg-[#f4f7fb]'>
                            Select video
                        </div>
                    )}
                    <input type='file' id='video' accept='video/*' hidden onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)} />
                </label>

                <p className='mt-6 font-medium text-[#1a2329]'>Project Title</p>
                <input type='text' placeholder='e.g. Modern Living Room' className='w-full max-w-lg mt-2 px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none' value={title} onChange={(e) => setTitle(e.target.value)} />

                <p className='mt-4 font-medium text-[#1a2329]'>Project Subtitle</p>
                <input type='text' placeholder='e.g. Cozy and Elegant' className='w-full max-w-lg mt-2 px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none' value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />

                <p className='mt-4 font-medium text-[#1a2329]'>Project Description</p>
                <div className='max-w-lg min-h-60 pb-16 pt-2 relative border border-[#a9bacd]/55 bg-[#f4f7fb]'>
                    <div ref={editorRef}></div>
                    {loadingAI && (
                        <div className='absolute inset-0 flex items-center justify-center bg-[#f4f7fb]/75'>
                            <div className='w-8 h-8 rounded-full border-2 border-[#b86f4e] border-t-transparent animate-spin'></div>
                        </div>
                    )}
                    <button type='button' disabled={loadingAI || !USE_GENERATE_ENDPOINT} onClick={generateContent} className='absolute bottom-2 right-2 text-xs text-white bg-[#b86f4e] px-4 py-1.5 hover:opacity-90 disabled:opacity-50'>
                        {loadingAI ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>

                <p className='mt-4 font-medium text-[#1a2329]'>Project Category</p>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className='mt-2 px-3 h-11 border text-[#1a2329] border-[#a9bacd]/55 bg-[#f4f7fb] outline-none'>
                    <option value=''>Select category</option>
                    <option value='Living Room'>Living Room</option>
                    <option value='Bedroom'>Bedroom</option>
                    <option value='Kitchen'>Kitchen</option>
                    <option value='Office'>Office</option>
                    <option value='Outdoor'>Outdoor</option>
                </select>

                <div className='flex gap-2 mt-4 items-center text-[#4f5f71]'>
                    <p>Publish Now</p>
                    <input type='checkbox' checked={isPublished} className='scale-125 cursor-pointer' onChange={(e) => setIsPublished(e.target.checked)} />
                </div>

                <button type='submit' disabled={isAdding} className='mt-8 w-44 h-11 bg-[#b86f4e] text-white cursor-pointer text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'>
                    {isAdding ? 'Posting...' : 'Add Project'}
                </button>
            </div>
        </form>
    );
};

export default AddBlog;
