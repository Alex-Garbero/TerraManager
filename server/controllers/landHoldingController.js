// server/controllers/landHoldingController.js
const LandHolding = require('../models/LandHolding');
const Owner = require('../models/Owner');

// Create a new Land Holding
async function createLandHolding(req, res) {
	try {
		console.log('Inside create land holding controller');
		console.log('Request body:', req.body);

		const {
			owner,
			legal_entity,
			net_mineral_acres,
			mineral_owner_royalty,
			section,
			township,
			range,
			title_source } = req.body;



		// Check if all required fields are present
		if (!owner || !legal_entity || !net_mineral_acres || !mineral_owner_royalty || !section || !township || !range || !title_source) {
			console.error('Missing required fields');

			return res.status(422).json({ 'message': 'Missing required fields' });
		}

		const ownerExists = await Owner.findById(owner).exec();
		if (!ownerExists) {
			console.error('Owner does not exist');
			return res.status(404).json({ 'message': 'Owner does not exist' });
		}
		console.log('Owner exists:', ownerExists);


		// Create new land holding
		const newLandHolding = new LandHolding({
			owner,
			legal_entity,
			net_mineral_acres,
			mineral_owner_royalty,
			section,
			township,
			range,
			title_source
		});

		// Save the new land holding
		const savedLandHolding = await newLandHolding.save();
		console.log('Saved LandHolding: savedLandHolding');

		// Update the owner with the new land holding and increment total_land_holdings
		ownerExists.land_holdings.push(savedLandHolding._id);
		ownerExists.total_land_holdings = ownerExists.land_holdings.length;

		// Save the updated owner
		const updatedOwner = await ownerExists.save();
		console.log('Updated Owner:', updatedOwner);

		res.status(201).json({ savedLandHolding });

	} catch (error) {
		console.error('Error creating land holding', error);
		res.status(500).json({ message: error.message });
	}
};

// Get all Land Holdings
async function getLandHoldings(req, res) {
	try {
		const landHoldings = await LandHolding.find().populate('owner');
		res.json(landHoldings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a Land Holding by ID
async function getLandHoldingById(req, res) {
	try {
		const landHolding = await LandHolding.findById(req.params.id).populate('owner');

		if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });

		res.json(landHolding);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a Land Holding by ID
async function updateLandHolding(req, res) {
	try {
		const landHolding = await LandHolding.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!landHolding) {
			return res.status(404).json({ message: 'Land Holding not found' })
		};
		res.json(landHolding);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a Land Holding by ID
async function deleteLandHolding(req, res) {
	try {
		const landHolding = await LandHolding.findByIdAndDelete(req.params.id);
		if (!landHolding) {
			return res.status(404).json({ message: 'Land Holding not found' });
		}
		res.json({ message: 'Land Holding deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createLandHolding,
	getLandHoldings,
	getLandHoldingById,
	updateLandHolding,
	deleteLandHolding,
};
