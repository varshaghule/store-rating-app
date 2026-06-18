const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'address', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      order: [[orderField, orderDir]],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating', 'userId'],
        },
      ],
    });

    const userId = req.user.id;
    const storesWithData = stores.map((s) => {
      const storeData = s.toJSON();
      const ratings = storeData.ratings || [];

      storeData.averageRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
            )
          : null;
      storeData.totalRatings = ratings.length;

      const userRating = ratings.find((r) => r.userId === userId);
      storeData.userRating = userRating ? userRating.rating : null;

      delete storeData.ratings;
      return storeData;
    });

    res.json({ stores: storesWithData });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { rating },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.status(created ? 201 : 200).json({
      message: created ? 'Rating submitted' : 'Rating updated',
      rating: ratingRecord,
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, submitRating };
