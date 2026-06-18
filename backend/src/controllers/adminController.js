const { Op, fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      Store.count(),
      Rating.count(),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[orderField, orderDir]],
      include: [
        {
          model: Store,
          as: 'store',
          required: false,
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating'],
            },
          ],
        },
      ],
    });

    const usersWithRating = users.map((u) => {
      const userData = u.toJSON();
      if (userData.store && userData.store.ratings) {
        const ratings = userData.store.ratings;
        userData.storeAverageRating =
          ratings.length > 0
            ? parseFloat(
                (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
              )
            : null;
        delete userData.store.ratings;
      }
      return userData;
    });

    res.json({ users: usersWithRating });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'store',
          required: false,
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating'],
            },
          ],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userData = user.toJSON();
    if (userData.store && userData.store.ratings) {
      const ratings = userData.store.ratings;
      userData.storeAverageRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            )
          : null;
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const allowedRoles = ['admin', 'user', 'store_owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({ name, email, password, address, role: userRole });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'email', 'address', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[orderField, orderDir]],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
    });

    const storesWithRating = stores.map((s) => {
      const storeData = s.toJSON();
      const ratings = storeData.ratings || [];
      storeData.averageRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            )
          : null;
      storeData.totalRatings = ratings.length;
      delete storeData.ratings;
      return storeData;
    });

    res.json({ stores: storesWithRating });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(409).json({ message: 'Store with this email already exists' });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) return res.status(404).json({ message: 'Owner not found' });
      if (owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'Owner must have store_owner role' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });

    res.status(201).json({
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getUsers, getUserById, createUser, getStores, createStore };
