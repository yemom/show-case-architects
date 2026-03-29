import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/useAppContext';

type Category = {
  _id: string;
  name: string;
  postCount?: number;
  isUsedByPosts?: boolean;
};

const EditCategory: React.FC = () => {
  const { axios, token } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/category');
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        toast.error(data.message || 'We could not load categories right now.');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'We could not load categories right now.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const activeCategory = useMemo(
    () => categories.find((item) => item._id === activeId) || null,
    [categories, activeId]
  );

  const startEdit = (category: Category) => {
    setActiveId(category._id);
    setName(category.name);
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;

    const normalized = name.trim();
    if (!activeId) {
      toast.error('Select a category to edit');
      return;
    }
    if (!normalized) {
      toast.error('Please enter a category name.');
      return;
    }
    if (activeCategory?.isUsedByPosts) {
      toast.error('This category is used by posts and cannot be edited');
      return;
    }

    try {
      setIsSaving(true);
      const { data } = await axios.put(
        `/api/category/${activeId}`,
        { name: normalized },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (data.success) {
        toast.success(data.message || 'Category updated');
        setActiveId('');
        setName('');
        await fetchCategories();
      } else {
        toast.error(data.message || 'We could not update this category right now.');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'We could not update this category right now.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (category: Category) => {
    if (isDeleting) return;

    if (category.isUsedByPosts) {
      toast.error('This category is used by posts and cannot be deleted');
      return;
    }

    const confirmed = window.confirm(`Delete category "${category.name}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const { data } = await axios.delete(`/api/category/${category._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success) {
        toast.success(data.message || 'Category deleted');
        if (activeId === category._id) {
          setActiveId('');
          setName('');
        }
        await fetchCategories();
      } else {
        toast.error(data.message || 'We could not delete this category right now.');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'We could not delete this category right now.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
      <div className='max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6'>
        <div className='border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-8'>
          <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Category Manager</p>
          <h1 className='architectural-heading text-[42px] sm:text-[56px] leading-[0.9] text-[#1a2329] mt-2 mb-6'>Edit Category</h1>

          <form onSubmit={onUpdate}>
            <p className='font-medium text-[#1a2329]'>Selected Category</p>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Select from the list and edit'
              className='w-full mt-2 px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none'
            />
            {activeCategory && (
              <p className='mt-2 text-xs text-[#637081]'>
                Current category: {activeCategory.name} | Used in {activeCategory.postCount || 0} post(s)
              </p>
            )}
            <button
              type='submit'
              disabled={isSaving || !activeCategory || Boolean(activeCategory?.isUsedByPosts)}
              className='mt-6 w-48 h-11 bg-[#b86f4e] text-white cursor-pointer text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'
            >
              {isSaving ? 'Updating...' : 'Update Category'}
            </button>
            <button
              type='button'
              onClick={() => activeCategory && onDelete(activeCategory)}
              disabled={isDeleting || !activeCategory || Boolean(activeCategory?.isUsedByPosts)}
              className='mt-3 ml-0 sm:ml-3 w-48 h-11 border border-[#a9bacd]/70 bg-[#f4f7fb] text-[#49596b] cursor-pointer text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </button>
          </form>
        </div>

        <div className='border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-8'>
          <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081] mb-4'>Available Categories</p>

          {loading ? (
            <p className='text-[#637081]'>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className='text-[#637081]'>No categories found.</p>
          ) : (
            <div className='space-y-2'>
              {categories.map((item) => (
                <div
                  key={item._id}
                  className={`w-full px-3 py-2 border transition-colors ${
                    activeId === item._id
                      ? 'border-[#b86f4e] bg-[#b86f4e]/10 text-[#7d442f]'
                      : 'border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] hover:bg-[#dde5ee]'
                  }`}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <button type='button' onClick={() => startEdit(item)} className='text-left flex-1'>
                      <p>{item.name}</p>
                      <p className='text-xs text-[#637081]'>Posts: {item.postCount || 0}</p>
                    </button>

                    <button
                      type='button'
                      onClick={() => onDelete(item)}
                      disabled={isDeleting || Boolean(item.isUsedByPosts)}
                      className='text-[10px] uppercase tracking-[0.12em] border border-[#a9bacd]/70 px-2 py-1 bg-[#f4f7fb] text-[#49596b] disabled:opacity-50'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
