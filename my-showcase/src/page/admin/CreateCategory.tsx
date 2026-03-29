import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/useAppContext';

const CreateCategory: React.FC = () => {
  const { axios, token } = useAppContext();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;

    const normalized = name.trim();
    if (!normalized) {
      toast.error('Please enter a category name.');
      return;
    }

    try {
      setIsSaving(true);
      const { data } = await axios.post(
        '/api/category',
        { name: normalized },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (data.success) {
        toast.success(data.message || 'Category created');
        setName('');
      } else {
        toast.error(data.message || 'We could not create this category right now.');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'We could not create this category right now.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
      <div className='max-w-[900px] mx-auto border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-8'>
        <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Category Manager</p>
        <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] text-[#1a2329] mt-2 mb-6'>Create Category</h1>

        <p className='font-medium text-[#1a2329]'>Category Name</p>
        <input
          type='text'
          placeholder='e.g. Commercial Interiors'
          className='w-full max-w-lg mt-2 px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          type='submit'
          disabled={isSaving}
          className='mt-8 w-52 h-11 bg-[#b86f4e] text-white cursor-pointer text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'
        >
          {isSaving ? 'Saving...' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CreateCategory;
