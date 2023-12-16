/*
    Code related to creating and changing tierlists
*/

const models = require('../models');

const { Entry, Tier } = models;

// ========= HELPER FUNCTIONS =========
const updateEntryIndex = async (id, index) => {
  await Entry.findByIdAndUpdate(id, { index });
};

const addToTier = async (entryId, tierIndex) => {
  const targetTier = await Tier.findOne({ index: tierIndex }).lean()
    .exec();

  await Entry.findByIdAndUpdate(entryId, { tier: targetTier._id, index: targetTier.numEntries });
  await Tier.findByIdAndUpdate(targetTier._id, { numEntries: targetTier.numEntries + 1 });
};

// Returns a list of all entries in the tier, sorted by index
const findEntriesInTier = async (tierId) => {
  const query = { tier: tierId };
  return (Entry.find(query).sort({ index: 1 }).lean()
    .exec());
};

const removeFromTier = async (entryId) => {

};

// ============= PAGES ==============

const listPage = async (req, res) => {
  res.render('app');
};

// ========= ENTRY FUNCTIONS =========

// Returns a list of all entries in a given tier
const getEntries = async (req, res) => {
  // Ensure we've been given the tier of the id we're looking for
//   if (!req.body.tier_id) {
//     return res.status(400).json({ error: 'Invalid tier request!' });
//   }

//   try {
//     const entries = findEntriesInTier(req.body.tier_id);
//     return res.json({ entries });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error retrieving data from server' });
//   }
  try {
    const query = { owner: req.session.account._id};
    const entries = await Entry.find(query).sort({ index: 1 }).lean()
        .exec();
    return res.json({ entries });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving entry data from server' });
  }
};

// Creates an entry from the given parameters
const createEntry = async (req, res) => {
  // If missing entry name, throw error
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required!' });
  }

  try {
    const newEntry = new Entry({
      name: req.body.name,
      owner: req.session.account._id,
    });

    await newEntry.save();
    await addToTier(newEntry._id, -1);

    return res.status(201).json(Entry.toAPI(newEntry));
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An entry by that name already exists!' });
    }
    return res.status(500).json({ error: 'An error occured while creating entry' });
  }
};

const swapEntries = async (req, res) => {

};

const moveEntry = async (req, res) => {

};

const deleteEntry = async (req, res) => {

};

// ========= TIER FUNCTIONS =========

// Returns a list of all tiers in the current tierlist
const getTiers = async (req, res) => {
  try {
    // Find all tiers belonging to this account
    const query = { owner: req.session.account._id, index: { $gt: -1 } };
    const tiers = await Tier.find(query).sort({ index: 1 }).lean().exec();

    return res.status(200).json({ tiers });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured while fetching tiers' });
  }
};

// Creates a tier from the given parameters
const createTier = async (req, res) => {
  // If missing entry name, throw error
  if (!req.body.grade || !(req.body.index || req.body.index === 0)) {
    return res.status(400).json({ error: 'Insufficient parameters for creating tier!' });
  }

  try {
    const newTier = new Tier({
      grade: req.body.grade,
      index: req.body.index,
      owner: req.session.account._id,
    });

    await newTier.save();

    return res.status(201).json(Tier.toAPI(newTier));
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An identical tier already exists!' });
    }
    return res.status(500).json({ error: 'An error occured while creating tier' });
  }
};

const deleteTier = async (req, res) => {
  console.log('deleting tier');
};

// ======= TIERLIST FUNCTIONS =======

const getTierlist = async (req, res) => {
  try {
    // Find all tiers belonging to this account besides the pool
    const query = { owner: req.session.account._id, index: { $gt: -1 } };
    const tiers = await Tier.find(query).sort({ index: 1 }).lean().exec();

    const docs = await Promise.all(tiers.map(async (tier) => {
      const entries = await findEntriesInTier(tier._id);
      return ({ tier, entries });
    }));

    console.log(docs);
    return res.status(200).json({ tiers: docs });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured while fetching tierlist' });
  }
};

const getPool = async (req, res) => {
  try {
    // Find all tiers belonging to this account
    const query = { owner: req.session.account._id, index: -1 };
    const pool = await Tier.findOne(query).lean().exec();

    return res.status(200).json({ pool });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured while fetching pool' });
  }
};

module.exports = {
  listPage,
  getEntries,
  createEntry,
  swapEntries,
  moveEntry,
  deleteEntry,
  getTiers,
  createTier,
  deleteTier,
  getTierlist,
  getPool,
};
