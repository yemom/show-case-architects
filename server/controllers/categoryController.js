import Category from '../models/category.js';
import Blog from '../models/blog.js';

const normalizeName = (value = '') => String(value).trim().replace(/\s+/g, ' ');
const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getCategoryUsageMap = async () => {
  const usage = await Blog.aggregate([
    { $group: { _id: '$category', postCount: { $sum: 1 } } },
  ]);

  return usage.reduce((acc, item) => {
    const key = normalizeName(item?._id || '').toLowerCase();
    if (key) acc[key] = Number(item?.postCount || 0);
    return acc;
  }, {});
};

export const getCategories = async (_req, res) => {
  try {
    const [categoriesInDb, blogCategoryValues] = await Promise.all([
      Category.find({}),
      Blog.distinct('category'),
    ]);

    const existingNames = new Set(
      categoriesInDb.map((item) => normalizeName(item.name).toLowerCase()).filter(Boolean)
    );

    const missingFromPosts = (blogCategoryValues || [])
      .map((value) => normalizeName(value || ''))
      .filter(Boolean)
      .filter((name) => !existingNames.has(name.toLowerCase()));

    if (missingFromPosts.length > 0) {
      try {
        await Category.insertMany(
          missingFromPosts.map((name) => ({ name })),
          { ordered: false }
        );
      } catch (insertError) {
        // Ignore duplicate write races and continue returning categories.
        if (!insertError || (insertError && insertError.code !== 11000)) {
          throw insertError;
        }
      }
    }

    const categories = await Category.find({}).sort({ name: 1 });
    const usageMap = await getCategoryUsageMap();

    const withUsage = categories.map((category) => {
      const normalized = normalizeName(category.name).toLowerCase();
      const postCount = usageMap[normalized] || 0;
      return {
        ...category.toObject(),
        postCount,
        isUsedByPosts: postCount > 0,
      };
    });

    return res.json({ success: true, categories: withUsage });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'We could not load categories right now. Please try again.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = normalizeName(req.body?.name);
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const duplicate = await Category.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name });
    return res.json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({ success: false, message: 'We could not create this category right now. Please try again.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const name = normalizeName(req.body?.name);

    if (!id || !name) {
      return res.status(400).json({ success: false, message: 'Category id and name are required' });
    }

    const duplicate = await Category.findOne({ _id: { $ne: id }, name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const current = await Category.findById(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const currentName = normalizeName(current.name);
    if (currentName.toLowerCase() === name.toLowerCase()) {
      return res.json({ success: true, message: 'Category unchanged', category: current });
    }

    const isUsed = await Blog.exists({ category: currentName });
    if (isUsed) {
      return res.status(409).json({ success: false, message: 'Cannot edit category that is currently used by posts' });
    }

    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

    return res.json({ success: true, message: 'Category updated successfully', category });
  } catch (error) {
    console.error('updateCategory error:', error);
    return res.status(500).json({ success: false, message: 'We could not update this category right now. Please try again.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Category id is required' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const categoryName = normalizeName(category.name);
    const isUsed = await Blog.exists({ category: categoryName });
    if (isUsed) {
      return res.status(409).json({ success: false, message: 'Cannot delete category that is currently used by posts' });
    }

    await Category.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ success: false, message: 'We could not delete this category right now. Please try again.' });
  }
};
